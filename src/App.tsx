import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';

export interface Admin {
  name: string;
  email: string;
  department: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  address: string;
  date: string;
  status: 'pending' | 'done';
  critical: boolean;
  imageUrl: string;
  department: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = (admin: Admin) => {
    setCurrentAdmin(admin);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setCurrentView('landing');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'landing' && (
        <LandingPage onLoginClick={handleLoginClick} />
      )}
      
      {currentView === 'login' && (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess} 
          onBack={handleBackToLanding}
        />
      )}
      
      {currentView === 'dashboard' && currentAdmin && (
        <AdminDashboard 
          admin={currentAdmin} 
          onLogout={handleLogout}
        />
      )}
      
      <Toaster />
    </div>
  );
}