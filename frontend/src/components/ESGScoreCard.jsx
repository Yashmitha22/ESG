import React from 'react';
import { motion } from 'framer-motion';

const ESGScoreCard = ({ 
  title, 
  score, 
  maxScore = 100, 
  color = 'blue', 
  icon, 
  highlight = false 
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskLevel = () => {
    if (percentage >= 80) return 'Low Risk';
    if (percentage >= 60) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-sm border p-6 ${
        highlight ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {highlight && (
          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            Overall
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold ${getScoreColor()}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-lg text-gray-500">/ {maxScore}</span>
        </div>
        <p className={`text-sm font-medium mt-1 ${getScoreColor()}`}>
          {getRiskLevel()}
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-2 rounded-full ${getProgressColor()}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ESGScoreCard;
