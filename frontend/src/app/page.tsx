'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoginModal, RegisterModal } from '@/components/Modals';

// View Components
import LandingView from '@/views/LandingView';
import DashboardView from '@/views/DashboardView';
import NetworkView from '@/views/NetworkView';
import JobsView from '@/views/JobsView';
import MessagesView from '@/views/MessagesView';
import ProfileView from '@/views/ProfileView';
import SettingsView from '@/views/SettingsView';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleNavigate = (view: string) => {
    // Protected routes
    if (!isLoggedIn && ['network', 'jobs', 'messages', 'profile', 'settings'].includes(view)) {
      setShowLoginModal(true);
      return;
    }
    setCurrentView(view);
  };

  const handleAuthSuccess = () => {
    setCurrentView('home');
  };

  // Determine which view to show
  const renderView = () => {
    if (currentView === 'home' && !isLoggedIn) {
      return <LandingView onShowLogin={() => setShowLoginModal(true)} onShowRegister={() => setShowRegisterModal(true)} />;
    }
    if (currentView === 'home' && isLoggedIn) {
      return <DashboardView />;
    }
    if (currentView === 'network') {
      return <NetworkView />;
    }
    if (currentView === 'jobs') {
      return <JobsView />;
    }
    if (currentView === 'messages') {
      return <MessagesView />;
    }
    if (currentView === 'profile') {
      return <ProfileView />;
    }
    if (currentView === 'settings') {
      return <SettingsView />;
    }
    return <LandingView onShowLogin={() => setShowLoginModal(true)} onShowRegister={() => setShowRegisterModal(true)} />;
  };

  const showFooter = currentView === 'home' && !isLoggedIn;

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onShowLogin={() => setShowLoginModal(true)}
        onShowRegister={() => setShowRegisterModal(true)}
      />

      <main>{renderView()}</main>

      {showFooter && <Footer />}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
