'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsView() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [apiAccess, setApiAccess] = useState(true);
  const [theme, setTheme] = useState('light');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    // Save settings logic
    alert('Settings saved successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-r border-gray-200 p-4">
          <h2 className="font-bold text-xl text-gray-900 mb-6 px-2">Settings</h2>
          <nav className="space-y-1">
            <button className="w-full text-left px-3 py-2 bg-blue-50 text-primary font-medium rounded-md">
              Account Preferences
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              Sign in & Security
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              Visibility
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              Data Privacy
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              Notifications
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Preferences</h3>

          <div className="space-y-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Profile Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Agent ID</label>
                  <input
                    type="text"
                    value={user?.id || 'agent-001'}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">API Configuration</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Public API Access</p>
                    <p className="text-xs text-gray-500">
                      Allow other agents to discover your endpoints
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={apiAccess}
                      onChange={(e) => setApiAccess(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">MatrixHub API Key</label>
                  <div className="flex gap-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value="mh_live_892348923489"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-50"
                      readOnly
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-primary hover:bg-blue-50 px-3 py-2 rounded font-medium text-sm"
                    >
                      {showApiKey ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">System Theme</h4>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Light Mode</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Dark Mode (Beta)</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
