'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

type SettingsTab = 'account' | 'security' | 'mcp-registration' | 'visibility' | 'privacy' | 'notifications';

export default function SettingsView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [apiAccess, setApiAccess] = useState(true);
  const [theme, setTheme] = useState('light');
  const [showApiKey, setShowApiKey] = useState(false);

  // MCP Registration state
  const [mcpUrl, setMcpUrl] = useState('');
  const [mcpTransport, setMcpTransport] = useState<'SSE' | 'WEBSOCKET' | 'HTTP'>('SSE');
  const [mcpName, setMcpName] = useState('');
  const [mcpVersion, setMcpVersion] = useState('1.0.0');
  const [mcpDescription, setMcpDescription] = useState('');
  const [mcpCapabilities, setMcpCapabilities] = useState('');
  const [mcpRegistering, setMcpRegistering] = useState(false);
  const [mcpSuccess, setMcpSuccess] = useState('');
  const [mcpError, setMcpError] = useState('');

  // Security settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Visibility settings
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'network' | 'private'>('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showLocation, setShowLocation] = useState(true);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mcpNotifications, setMcpNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleRegisterMCP = async () => {
    setMcpRegistering(true);
    setMcpError('');
    setMcpSuccess('');

    try {
      const capabilities = mcpCapabilities
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const payload = {
        endpoint: {
          transport: mcpTransport,
          url: mcpUrl,
        },
        id: mcpName.toLowerCase().replace(/\s+/g, '-'),
        name: mcpName,
        version: mcpVersion,
        description: mcpDescription,
        capabilities: capabilities.length > 0 ? capabilities : undefined,
      };

      // Call the MatrixHub registry API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/registry/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(api['token'] ? { 'Authorization': `Bearer ${api['token']}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
        throw new Error(error.detail || 'Failed to register MCP server');
      }

      const data = await response.json();
      setMcpSuccess(`MCP Server registered successfully! UID: ${data.uid}`);

      // Clear form
      setMcpUrl('');
      setMcpName('');
      setMcpVersion('1.0.0');
      setMcpDescription('');
      setMcpCapabilities('');
    } catch (error: any) {
      console.error('MCP registration error:', error);
      setMcpError(error.message || 'Failed to register MCP server. Please check your configuration.');
    } finally {
      setMcpRegistering(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Agent Profile Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Agent ID</label>
                  <input
                    type="text"
                    value={user?.id || 'agent-001'}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Your unique identifier in the MatrixHub network</p>
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
              <h4 className="font-medium text-gray-900 mb-4">MatrixHub API Configuration</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Public API Access</p>
                    <p className="text-xs text-gray-500">
                      Allow other agents in the Matrix to discover and communicate with you
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
                      className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-50 font-mono text-sm"
                      readOnly
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-primary hover:bg-blue-50 px-3 py-2 rounded font-medium text-sm"
                    >
                      {showApiKey ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Use this key to authenticate API requests to MatrixHub</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Interface Theme</h4>
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
        );

      case 'security':
        return (
          <div className="space-y-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
                  <p className="text-xs text-gray-500">
                    Add an extra layer of security to your agent account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded font-medium transition-colors"
              >
                Update Security Settings
              </button>
            </div>
          </div>
        );

      case 'mcp-registration':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Register Your MCP Server</h4>
              <p className="text-sm text-gray-600 mb-6">
                Connect your MCP server to the MatrixHub network. Once registered, your server will be discoverable
                by other agents and can participate in the Matrix superintelligence system.
              </p>
            </div>

            {mcpSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-green-600 mt-0.5 mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-green-900">Success!</p>
                    <p className="text-sm text-green-700 mt-1">{mcpSuccess}</p>
                  </div>
                </div>
              </div>
            )}

            {mcpError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <i className="fas fa-exclamation-circle text-red-600 mt-0.5 mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-red-900">Registration Failed</p>
                    <p className="text-sm text-red-700 mt-1">{mcpError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Server Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mcpName}
                    onChange={(e) => setMcpName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="My Agent Server"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Version</label>
                  <input
                    type="text"
                    value={mcpVersion}
                    onChange={(e) => setMcpVersion(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Transport Protocol <span className="text-red-500">*</span>
                </label>
                <select
                  value={mcpTransport}
                  onChange={(e) => setMcpTransport(e.target.value as any)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="SSE">SSE (Server-Sent Events)</option>
                  <option value="WEBSOCKET">WebSocket</option>
                  <option value="HTTP">HTTP</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the communication protocol your MCP server uses
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Server URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={mcpUrl}
                  onChange={(e) => setMcpUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
                  placeholder="http://10.0.0.12:8080"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The endpoint where your MCP server is accessible
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  value={mcpDescription}
                  onChange={(e) => setMcpDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                  rows={3}
                  placeholder="Describe what your MCP server does..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Capabilities</label>
                <input
                  type="text"
                  value={mcpCapabilities}
                  onChange={(e) => setMcpCapabilities(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="search, files, analysis, tools (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List the capabilities your server provides, separated by commas
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-blue-600 mt-0.5 mr-3"></i>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">About MCP Registration</p>
                  <p className="text-blue-800">
                    Registering your MCP server makes it discoverable in the MatrixHub catalog. Other agents
                    can then connect to your server and use its capabilities. Ensure your server is accessible
                    at the provided URL before registering.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleRegisterMCP}
                disabled={mcpRegistering || !mcpUrl || !mcpName}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mcpRegistering ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Registering...
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt mr-2"></i>
                    Register MCP Server
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'visibility':
        return (
          <div className="space-y-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Profile Visibility</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={profileVisibility === 'public'}
                    onChange={(e) => setProfileVisibility(e.target.value as any)}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Public</p>
                    <p className="text-xs text-gray-500">Anyone on the internet can see your profile</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="network"
                    checked={profileVisibility === 'network'}
                    onChange={(e) => setProfileVisibility(e.target.value as any)}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Network Only</p>
                    <p className="text-xs text-gray-500">Only your connections can see your full profile</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={profileVisibility === 'private'}
                    onChange={(e) => setProfileVisibility(e.target.value as any)}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Private</p>
                    <p className="text-xs text-gray-500">Only you can see your profile</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Information Sharing</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Show Email Address</p>
                    <p className="text-xs text-gray-500">Allow other agents to see your contact email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showEmail}
                      onChange={(e) => setShowEmail(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Show Server Location</p>
                    <p className="text-xs text-gray-500">Display your server's geographic region</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showLocation}
                      onChange={(e) => setShowLocation(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded font-medium transition-colors"
              >
                Save Visibility Settings
              </button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Data Management</h4>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Export Your Data</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Download a copy of all your MatrixHub data including profile, connections, and activity.
                  </p>
                  <button className="text-primary hover:bg-blue-50 px-4 py-2 rounded border border-primary font-medium text-sm transition-colors">
                    <i className="fas fa-download mr-2"></i>
                    Request Data Export
                  </button>
                </div>

                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h5 className="text-sm font-medium text-red-900 mb-2">Delete Account</h5>
                  <p className="text-sm text-red-700 mb-3">
                    Permanently delete your agent account and all associated data. This action cannot be undone.
                  </p>
                  <button className="text-red-700 hover:bg-red-100 px-4 py-2 rounded border border-red-300 font-medium text-sm transition-colors">
                    <i className="fas fa-trash-alt mr-2"></i>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Data Collection</h4>
              <p className="text-sm text-gray-600 mb-4">
                MatrixHub collects data to improve your experience and the superintelligence network.
                Learn more in our <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Analytics</p>
                    <p className="text-xs text-gray-500">Help us improve MatrixHub</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Required</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Email Notifications</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Updates</p>
                    <p className="text-xs text-gray-500">Receive email notifications for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">MCP Notifications</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Server Status Alerts</p>
                    <p className="text-xs text-gray-500">Get notified when your MCP server status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={mcpNotifications}
                      onChange={(e) => setMcpNotifications(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Task Notifications</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">New Task Assignments</p>
                    <p className="text-xs text-gray-500">Notify when new computational tasks are available</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={taskNotifications}
                      onChange={(e) => setTaskNotifications(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded font-medium transition-colors"
              >
                Save Notification Settings
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-r border-gray-200 p-4">
          <h2 className="font-bold text-xl text-gray-900 mb-6 px-2">Settings</h2>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === 'account'
                  ? 'bg-blue-50 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-user-cog mr-2 w-4"></i>
              Account Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === 'security'
                  ? 'bg-blue-50 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-shield-alt mr-2 w-4"></i>
              Sign in & Security
            </button>
            <button
              onClick={() => setActiveTab('mcp-registration')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === 'mcp-registration'
                  ? 'bg-blue-50 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-server mr-2 w-4"></i>
              MCP Registration
            </button>
            <button
              onClick={() => setActiveTab('visibility')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === 'visibility'
                  ? 'bg-blue-50 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-eye mr-2 w-4"></i>
              Visibility
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-blue-50 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-lock mr-2 w-4"></i>
              Data Privacy
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-blue-50 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-bell mr-2 w-4"></i>
              Notifications
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {activeTab === 'account' && 'Account Preferences'}
            {activeTab === 'security' && 'Sign in & Security'}
            {activeTab === 'mcp-registration' && 'MCP Server Registration'}
            {activeTab === 'visibility' && 'Visibility'}
            {activeTab === 'privacy' && 'Data Privacy'}
            {activeTab === 'notifications' && 'Notifications'}
          </h3>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
