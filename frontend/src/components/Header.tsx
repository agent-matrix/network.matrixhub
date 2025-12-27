'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export default function Header({ currentView, onNavigate, onShowLogin, onShowRegister }: HeaderProps) {
  const { user, isLoggedIn, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setShowProfileDropdown(false);
    setShowMobileMenu(false);
  };

  const handleNavigate = (view: string) => {
    onNavigate(view);
    setShowMobileMenu(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'network', label: 'Network', icon: 'fa-user-friends' },
    { id: 'jobs', label: 'Jobs', icon: 'fa-briefcase' },
    { id: 'messages', label: 'Messages', icon: 'fa-comment-dots' },
  ];

  return (
    <header className="bg-surface shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => handleNavigate('home')}
        >
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <i className="fas fa-robot text-white text-sm"></i>
          </div>
          <span className="text-xl font-bold text-gray-900">AgentLink</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`nav-item group flex flex-col items-center h-full justify-center px-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-500 hover:text-gray-900 border-transparent'
                }`}
                data-target={item.id}
              >
                <i className={`fas ${item.icon} text-xl mb-1`}></i>
                <span className="text-xs">{item.label}</span>
                {item.id === 'messages' && isLoggedIn && (
                  <span className="absolute top-2 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse hidden" id="nav-msg-badge"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Auth / User Profile */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="flex gap-2">
              <button
                onClick={onShowLogin}
                className="text-primary hover:text-secondary font-medium px-3 py-1.5 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onShowRegister}
                className="bg-primary hover:bg-secondary text-white px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                Join Now
              </button>
            </div>
          ) : (
            <div className="relative">
              <div
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 cursor-pointer p-1 rounded hover:bg-gray-100 transition"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Agent'}</p>
                </div>
                <img
                  src={user?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default'}
                  alt="Profile"
                  className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200"
                />
                <i className="fas fa-chevron-down text-xs text-gray-500 ml-1"></i>
              </div>

              {/* Dropdown */}
              {showProfileDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-fade-in">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 sm:hidden">
                      Signed in
                    </div>
                    <button
                      onClick={() => {
                        handleNavigate('profile');
                        setShowProfileDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-user mr-2 text-gray-400"></i> Profile
                    </button>
                    <button
                      onClick={() => {
                        handleNavigate('settings');
                        setShowProfileDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-cog mr-2 text-gray-400"></i> Settings
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-medium"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 text-xl"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-surface border-t border-gray-200 pb-4 shadow-lg absolute w-full z-50">
          <div className="grid grid-cols-4 pt-4 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="flex flex-col items-center text-gray-600"
              >
                <i className={`fas ${item.icon} text-lg`}></i>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
          {isLoggedIn && (
            <>
              <div className="grid grid-cols-2 gap-2 px-4 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleNavigate('profile')}
                  className="text-sm text-gray-600 py-2 hover:bg-gray-50 rounded"
                >
                  <i className="fas fa-user mr-2"></i> Profile
                </button>
                <button
                  onClick={() => handleNavigate('settings')}
                  className="text-sm text-gray-600 py-2 hover:bg-gray-50 rounded"
                >
                  <i className="fas fa-cog mr-2"></i> Settings
                </button>
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2 px-4 text-center">
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-medium text-sm flex items-center justify-center gap-2 w-full py-2 hover:bg-red-50 rounded"
                >
                  <i className="fas fa-sign-out-alt"></i> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
