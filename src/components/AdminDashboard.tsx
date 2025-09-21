import React, { useState, useEffect, useMemo } from 'react';
import {
  LogOut,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  Building,
  RefreshCw,
  AlertCircle,
  Code
} from 'lucide-react';

// Types (these should match your existing types)
interface Admin {
  name: string;
  email: string;
  department: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  address: string;
  date: string;
  status: 'pending' | 'done';
  critical: boolean;
  imageUrl: string;
  department: string;
  belongsToDepartment: boolean;
  originalLocation?: string;
  gpsCoordinates?: string | null;
}

// Local JSON data interface
interface LocalAnalysisData {
  GPSDateStamp: string;
  Classification: string | null;
  Location: string;
}

interface AdminDashboardProps {
  admin: Admin;
  onLogout: () => void;
}

// Backend API integration
interface BackendReport {
  GPSDateStamp: string;
  Classification: string | null;
  Location: string;
}

// Component to render location with Google Maps link if available
const LocationDisplay: React.FC<{ address: string; originalLocation?: string }> = ({ 
  address, 
  originalLocation 
}) => {
  const isGoogleMapsUrl = originalLocation?.includes("google.com/maps");
  
  return (
    <div className="flex items-center text-sm text-gray-600">
      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
      <div className="truncate flex-1">
        {isGoogleMapsUrl ? (
          <a 
            href={originalLocation} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
            title="Open in Google Maps"
          >
            {address}
          </a>
        ) : (
          <span>{address}</span>
        )}
      </div>
    </div>
  );
};

// Helper function to extract coordinates from Google Maps URL
const extractCoordinatesFromMapsUrl = (url: string): string => {
  try {
    const match = url.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) {
      const [, lat, lng] = match;
      return `Lat: ${lat}, Lng: ${lng}`;
    }
    return url; // Return original URL if parsing fails
  } catch (error) {
    return url;
  }
};

// Helper function to format date from GPS timestamp
const formatDateFromGPS = (gpsDateStamp: string): string => {
  try {
    // Handle format "2025:09:19" - convert to "2025-09-19"
    if (gpsDateStamp && gpsDateStamp !== "null") {
      const formattedDate = gpsDateStamp.replace(/:/g, '-');
      // Validate the date
      const date = new Date(formattedDate);
      if (!isNaN(date.getTime())) {
        return formattedDate;
      }
    }
    // Fallback to current date
    return new Date().toISOString().split("T")[0];
  } catch (error) {
    return new Date().toISOString().split("T")[0];
  }
};

// Function to fetch data from local output.json file
const fetchReportsFromLocal = async (): Promise<LocalAnalysisData[]> => {
  try {
    const response = await fetch('/backend/output/output.json');
    console.log('Fetching from local file:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Handle both array and single object responses
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching reports from local file:', error);
    throw error;
  }
};

const fetchReportsFromBackend = async (): Promise<BackendReport[]> => {
  try {
    const response = await fetch('http://localhost:5000/api/issue');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching reports from backend:', error);
    throw error;
  }
};

// Transform backend data to Report interface
const transformBackendDataToReport = (
  backendData: (BackendReport | LocalAnalysisData)[] | BackendReport | LocalAnalysisData,
  adminDepartment: string
): Report[] => {
  // Ensure we're always working with an array
  const dataArray = Array.isArray(backendData) ? backendData : [backendData];
  
  return dataArray
    .map((item, index) => {
      const classification = item.Classification?.toLowerCase() || "";
      const isPothole = classification.includes("pothole");
      const isGarbage = classification.includes("garbage") || classification.includes("trash") || classification.includes("waste");
      const isCrack = classification.includes("crack");
      const isDamage = classification.includes("damage") || classification.includes("broken");

      // Dynamically pick department based on Classification
      let department = "General";
      if (isPothole || isCrack || isDamage) {
        department = "Road & Infrastructure";
      } else if (isGarbage) {
        department = "Sanitation";
      }

      // Generate more specific titles based on classification
      let title = "Infrastructure Issue";
      if (isPothole) title = "Pothole Detected";
      else if (isGarbage) title = "Garbage/Waste Detected";
      else if (isCrack) title = "Road Crack Detected";
      else if (isDamage) title = "Infrastructure Damage Detected";
      else if (item.Classification) title = `${item.Classification} Detected`;

      // Process location - check if it's a Google Maps URL
      let processedAddress = "Location not available";
      if (item.Location && item.Location !== "null") {
        if (item.Location.includes("google.com/maps")) {
          // Extract coordinates and format them nicely
          processedAddress = extractCoordinatesFromMapsUrl(item.Location);
        } else {
          processedAddress = item.Location;
        }
      }

      // Process date from GPS timestamp
      const processedDate = formatDateFromGPS(item.GPSDateStamp);

      // Only allow reports for admin's department
      const belongsToDepartment =
        adminDepartment === "All" || department === adminDepartment;

      return {
        id: `report-${index + 1}`,
        title,
        description: `AI Classification: ${item.Classification || "Unknown issue"}`,
        address: processedAddress,
        date: processedDate,
        status: "pending" as const,
        critical: isPothole || isGarbage || isCrack || isDamage, // Mark infrastructure issues as critical
        imageUrl: "https://images.unsplash.com/photo-1665631154001-5f921d61a1a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpYyUyMGluZnJhc3RydWN0dXJlJTIwcmVwYWlyfGVufDF8fHx8MTc1ODMxNjY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        department,
        belongsToDepartment,
        // Store original data for reference
        originalLocation: item.Location,
        gpsCoordinates: item.Location && item.Location.includes("google.com/maps") 
          ? extractCoordinatesFromMapsUrl(item.Location) 
          : null
      };
    })
    .filter((report) => report.belongsToDepartment); // Only show reports relevant to the admin
};

// Toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Simple toast implementation
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white transition-all duration-300 ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onLogout }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'critical' | 'status'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'pending' | 'done'>('all');
  const [rawJsonData, setRawJsonData] = useState<any>(null);
  const [showRawData, setShowRawData] = useState<boolean>(false);

  // Function to fetch and display raw JSON data
  const fetchRawJsonData = async () => {
    try {
      const response = await fetch('/backend/output/output.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRawJsonData(data);
      setShowRawData(true);
    } catch (error) {
      console.error('Error fetching raw JSON data:', error);
      showToast('Failed to load raw JSON data', 'error');
    }
  };

  // Fetch reports from local file first, then backend as fallback
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      let dataSource = '';

      try {
        // Try to fetch from local file first
        data = await fetchReportsFromLocal();
        dataSource = 'local file';
        showToast('Loaded reports from local analysis');
      } catch (localError) {
        console.log('Local file not available, trying backend API...', localError);
        // Fallback to backend API
        data = await fetchReportsFromBackend();
        dataSource = 'backend API';
        showToast('Loaded reports from backend API');
      }

      const transformedReports = transformBackendDataToReport(data, admin.department);
      setReports(transformedReports);

      console.log(`Successfully loaded ${transformedReports.length} reports from ${dataSource}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      showToast('Failed to load reports from all sources', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load reports on component mount
  useEffect(() => {
    fetchReports();
  }, [admin.department]);

  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports;
    
    if (filterBy !== 'all') {
      filtered = reports.filter(report => report.status === filterBy);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'critical':
          return (b.critical ? 1 : 0) - (a.critical ? 1 : 0);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [reports, sortBy, filterBy]);

  const updateReportStatus = (reportId: string, newStatus: 'pending' | 'done') => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
    showToast(`Report status updated to ${newStatus}`);
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const done = reports.filter(r => r.status === 'done').length;
    const critical = reports.filter(r => r.critical && r.status === 'pending').length;
    
    return { total, pending, done, critical };
  }, [reports]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">CivicCare Dashboard</h1>
                <p className="text-sm text-gray-500">{admin.department} Department</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{admin.name}</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
                onClick={fetchReports}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button 
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
                onClick={fetchRawJsonData}
                disabled={loading}
              >
                <Code className="h-4 w-4" />
                <span>View Raw Data</span>
              </button>
              <button 
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Raw JSON Data Modal */}
        {showRawData && rawJsonData && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRawData(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Raw JSON Data</h3>
                <button 
                  className="px-2 py-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowRawData(false)}
                >
                  ×
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(80vh-80px)]">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(rawJsonData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Reports
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
              </div>
              <button
                className="ml-4 px-3 py-1 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                onClick={fetchReports}
              >
                <RefreshCw className="h-4 w-4 mr-1 inline" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading reports from backend...</p>
            </div>
          </div>
        )}

        {/* Content only shows when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{stats.done}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Critical</p>
                    <p className="text-2xl font-bold">{stats.critical}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="date">Date</option>
                  <option value="critical">Criticality</option>
                  <option value="status">Status</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Filter by:</span>
                <select 
                  value={filterBy} 
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Reports</option>
                  <option value="pending">Pending</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {report.critical && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Critical
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold leading-tight">{report.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status === 'done' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {report.status === 'done' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {report.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <LocationDisplay 
                        address={report.address} 
                        originalLocation={report.originalLocation} 
                      />
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {report.status === 'pending' ? (
                        <button 
                          className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center justify-center"
                          onClick={() => updateReportStatus(report.id, 'done')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Done
                        </button>
                      ) : (
                        <button 
                          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 flex items-center justify-center"
                          onClick={() => updateReportStatus(report.id, 'pending')}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedReports.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
                <p className="text-gray-600">
                  {filterBy === 'all' 
                    ? `No reports available for the ${admin.department} department.`
                    : `No ${filterBy} reports found.`}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};