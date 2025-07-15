import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Building2, TrendingUp, Shield, Leaf, Users } from 'lucide-react';

const RecentAnalyses = ({ companies = [] }) => {
  if (companies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Analyses
          </h3>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-center py-8 text-gray-500">
          No recent analyses available
        </div>
      </motion.div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (category, score) => {
    const iconClass = `w-4 h-4 ${getScoreColor(score)}`;
    
    switch (category) {
      case 'environmental':
        return <Leaf className={iconClass} />;
      case 'social':
        return <Users className={iconClass} />;
      case 'governance':
        return <Shield className={iconClass} />;
      default:
        return <TrendingUp className={iconClass} />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const analysisTime = new Date(timestamp);
    const diffMs = now - analysisTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Analyses
        </h3>
        <Clock className="w-5 h-5 text-blue-500" />
      </div>

      <div className="space-y-4">
        {companies.map((company, index) => (
          <motion.div
            key={`${company.symbol}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {company.symbol}
                  </span>
                  <span className="text-sm text-gray-500">
                    •
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(company.analysis_timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {company.company_name || company.symbol}
                </p>
                
                <div className="flex items-center space-x-4">
                  {['environmental', 'social', 'governance'].map((category) => {
                    const score = company.esg_scores?.[category] || 0;
                    return (
                      <div key={category} className="flex items-center space-x-1">
                        {getScoreIcon(category, score)}
                        <span className={`text-xs font-medium ${getScoreColor(score)}`}>
                          {score.toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {company.esg_scores?.overall?.toFixed(1) || 'N/A'}
              </div>
              <div className={`text-sm font-medium ${getScoreColor(company.esg_scores?.overall || 0)}`}>
                {company.esg_scores?.risk_rating || 'Unknown Risk'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {companies.length >= 5 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Analyses
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RecentAnalyses;
