import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  User, 
  Shield, 
  Database,
  Palette,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General settings
    autoRefresh: true,
    refreshInterval: 300, // 5 minutes
    defaultAnalysisPeriod: 30,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    analysisCompleteNotifications: true,
    riskAlerts: true,
    
    // API settings
    newsApiKey: '',
    alphaVantageApiKey: '',
    maxConcurrentRequests: 5,
    
    // UI preferences
    theme: 'light',
    chartType: 'bar',
    defaultView: 'dashboard'
  });

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'api', name: 'API Keys', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    localStorage.setItem('esgSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      autoRefresh: true,
      refreshInterval: 300,
      defaultAnalysisPeriod: 30,
      emailNotifications: true,
      pushNotifications: false,
      analysisCompleteNotifications: true,
      riskAlerts: true,
      newsApiKey: '',
      alphaVantageApiKey: '',
      maxConcurrentRequests: 5,
      theme: 'light',
      chartType: 'bar',
      defaultView: 'dashboard'
    });
    toast.success('Settings reset to defaults');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Data Refresh</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto-refresh data</label>
              <p className="text-sm text-gray-500">Automatically update market data and analyses</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refresh interval (seconds)
            </label>
            <select
              value={settings.refreshInterval}
              onChange={(e) => handleSettingChange('refreshInterval', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={1800}>30 minutes</option>
              <option value={3600}>1 hour</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Analysis Defaults</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default analysis period (days)
          </label>
          <select
            value={settings.defaultAnalysisPeriod}
            onChange={(e) => handleSettingChange('defaultAnalysisPeriod', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>1 year</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Notification Types</h4>
        <div className="space-y-4">
          {[
            {
              key: 'emailNotifications',
              label: 'Email notifications',
              description: 'Receive notifications via email'
            },
            {
              key: 'pushNotifications',
              label: 'Push notifications',
              description: 'Receive browser push notifications'
            },
            {
              key: 'analysisCompleteNotifications',
              label: 'Analysis complete',
              description: 'Notify when company analysis is finished'
            },
            {
              key: 'riskAlerts',
              label: 'Risk alerts',
              description: 'Alert when high-risk companies are detected'
            }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">{setting.label}</label>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[setting.key]}
                  onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">API Keys</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              News API Key
            </label>
            <input
              type="password"
              value={settings.newsApiKey}
              onChange={(e) => handleSettingChange('newsApiKey', e.target.value)}
              placeholder="Enter your News API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Get your API key from <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">newsapi.org</a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alpha Vantage API Key
            </label>
            <input
              type="password"
              value={settings.alphaVantageApiKey}
              onChange={(e) => handleSettingChange('alphaVantageApiKey', e.target.value)}
              placeholder="Enter your Alpha Vantage API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Get your API key from <a href="https://www.alphavantage.co" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">alphavantage.co</a>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">API Limits</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max concurrent requests
          </label>
          <select
            value={settings.maxConcurrentRequests}
            onChange={(e) => handleSettingChange('maxConcurrentRequests', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 request</option>
            <option value={3}>3 requests</option>
            <option value={5}>5 requests</option>
            <option value={10}>10 requests</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Lower values reduce API rate limiting but slower performance
          </p>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Theme</h4>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'light', label: 'Light', preview: 'bg-white border-gray-300' },
            { value: 'dark', label: 'Dark', preview: 'bg-gray-800 border-gray-600' }
          ].map((theme) => (
            <label
              key={theme.value}
              className={`relative cursor-pointer rounded-lg border-2 p-4 ${
                settings.theme === theme.value ? 'border-blue-500' : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={theme.value}
                checked={settings.theme === theme.value}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="sr-only"
              />
              <div className={`w-full h-20 rounded ${theme.preview} mb-2`}></div>
              <div className="text-sm font-medium text-gray-900">{theme.label}</div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Charts</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default chart type
          </label>
          <select
            value={settings.chartType}
            onChange={(e) => handleSettingChange('chartType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Navigation</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default view on login
          </label>
          <select
            value={settings.defaultView}
            onChange={(e) => handleSettingChange('defaultView', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dashboard">Dashboard</option>
            <option value="analysis">Analysis</option>
            <option value="portfolio">Portfolio</option>
            <option value="market">Market</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your ESG analysis experience</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
              </div>

              {activeTab === 'general' && renderGeneralSettings()}
              {activeTab === 'notifications' && renderNotificationSettings()}
              {activeTab === 'api' && renderApiSettings()}
              {activeTab === 'appearance' && renderAppearanceSettings()}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset to Defaults</span>
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
