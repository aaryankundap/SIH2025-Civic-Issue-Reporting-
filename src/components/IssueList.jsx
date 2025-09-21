
import React, { useEffect, useState } from "react";

export default function IssueList() {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchIssue() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/issue");
        if (!res.ok) throw new Error("Fetch failed: " + res.status);
        const data = await res.json();
        setIssue(data);
      } catch (e) {
        setErr(e.toString());
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, []);

  if (loading) return <div>Loading latest report...</div>;
  if (err) return <div style={{color:'red'}}>Error: {err}</div>;
  if (!issue) return <div>No issue data</div>;

  return (
    <div style={{padding:16}}>
      <h2>Latest Report</h2>
      <div style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
        <p><strong>Classification:</strong> {issue.get('Classification') ?? issue.Classification ?? 'Unknown'}</p>
        <p><strong>GPS Date:</strong> {issue.get('GPSDateStamp') ?? issue.GPSDateStamp ?? 'Not available'}</p>
        <p><strong>Location:</strong> {issue.get('Location') ?? issue.Location ? <a href={(issue.get('Location') ?? issue.Location)} target="_blank" rel="noreferrer">View on map</a> : 'Not available'}</p>
        <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(issue, null, 2)}</pre>
      </div>
    </div>
  );
}
