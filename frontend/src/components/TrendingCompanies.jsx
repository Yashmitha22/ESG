import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Star, Building2 } from 'lucide-react';

const TrendingCompanies = ({ companies = [] }) => {
  if (companies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Trending Companies
          </h3>
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="text-center py-8 text-gray-500">
          No trending data available
        </div>
      </motion.div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Trending Companies
        </h3>
        <Star className="w-5 h-5 text-yellow-500" />
      </div>
      
      <div className="space-y-4">
        {companies.slice(0, 8).map((company, index) => (
          <motion.div
            key={company.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {company.symbol}
                  </span>
                  <span className="text-xs text-gray-500">
                    {company.sector}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate max-w-32">
                  {company.name}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(company.latest_score)}`}>
                {company.latest_score?.toFixed(1) || 'N/A'}
              </div>
              
              {company.score_change !== undefined && (
                <div className={`flex items-center justify-end space-x-1 mt-1 ${getChangeColor(company.score_change)}`}>
                  {getChangeIcon(company.score_change)}
                  <span className="text-xs font-medium">
                    {company.score_change > 0 ? '+' : ''}{company.score_change?.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Trending Companies
        </button>
      </div>
    </motion.div>
  );
};

export default TrendingCompanies;
