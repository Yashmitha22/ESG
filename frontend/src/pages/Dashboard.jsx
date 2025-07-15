import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Globe, 
  Users, 
  Shield,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useESG } from '../context/ESGContext';
import ESGScoreCard from '../components/ESGScoreCard';
import TrendingCompanies from '../components/TrendingCompanies';
import MarketOverview from '../components/MarketOverview';
import RecentAnalyses from '../components/RecentAnalyses';

const Dashboard = () => {
  const { 
    companies, 
    loading, 
    getTrendingCompanies, 
    getSectorAnalysis,
    notifications 
  } = useESG();
  
  const [trendingCompanies, setTrendingCompanies] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const [trending, sectors] = await Promise.all([
        getTrendingCompanies(),
        getSectorAnalysis()
      ]);
      
      setTrendingCompanies(trending || []);
      setSectorData(sectors || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Calculate dashboard stats
  const totalAnalyses = companies.length;
  const avgESGScore = companies.length > 0 
    ? companies.reduce((sum, company) => sum + (company.esg_scores?.overall || 0), 0) / companies.length
    : 0;
  
  const highRiskCompanies = companies.filter(
    company => company.esg_scores?.risk_rating === 'High Risk'
  ).length;

  const recentAlerts = notifications.slice(0, 5);

  const dashboardStats = [
    {
      title: 'Total Analyses',
      value: totalAnalyses,
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Avg ESG Score',
      value: avgESGScore.toFixed(1),
      change: '+2.3',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'High Risk',
      value: highRiskCompanies,
      change: '-1',
      trend: 'down',
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'Sectors Covered',
      value: new Set(companies.map(c => c.sector || 'Unknown')).size,
      change: '+3',
      trend: 'up',
      icon: Globe,
      color: 'purple'
    }
  ];

  if (dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ESG Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time insights into environmental, social, and governance performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Market Overview */}
            <MarketOverview sectorData={sectorData} />
            
            {/* Recent Analyses */}
            <RecentAnalyses companies={companies.slice(0, 5)} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Trending Companies */}
            <TrendingCompanies companies={trendingCompanies} />
            
            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Alerts
                </h3>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              
              <div className="space-y-3">
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert, index) => (
                    <div
                      key={alert.id || index}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        {alert.type === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent alerts
                  </p>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Analyze New Company</span>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Export Report</span>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Share Portfolio</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
