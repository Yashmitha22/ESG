import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  PieChart,
  Building2
} from 'lucide-react';

const FinancialMetrics = ({ financialData }) => {
  if (!financialData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Financial Metrics
        </h3>
        <div className="text-center py-8 text-gray-500">
          No financial data available
        </div>
      </div>
    );
  }

  const formatNumber = (value, type = 'number') => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
      case 'currency':
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
        return `$${value.toFixed(2)}`;
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'ratio':
        return value.toFixed(2);
      default:
        return value.toLocaleString();
    }
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return <BarChart className="w-4 h-4" />;
  };

  const metrics = [
    {
      label: 'Market Cap',
      value: financialData.market_cap,
      type: 'currency',
      icon: Building2,
      color: 'blue'
    },
    {
      label: 'Current Price',
      value: financialData.current_price,
      type: 'currency',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'P/E Ratio',
      value: financialData.pe_ratio,
      type: 'ratio',
      icon: BarChart,
      color: 'purple'
    },
    {
      label: 'Revenue Growth',
      value: financialData.revenue_growth,
      type: 'percentage',
      icon: TrendingUp,
      color: 'indigo',
      isChange: true
    },
    {
      label: 'Debt-to-Equity',
      value: financialData.debt_to_equity,
      type: 'ratio',
      icon: PieChart,
      color: 'orange'
    },
    {
      label: 'ROE',
      value: financialData.roe ? financialData.roe * 100 : null,
      type: 'percentage',
      icon: TrendingUp,
      color: 'teal',
      isChange: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Financial Metrics
        </h3>
        <div className="text-sm text-gray-500">
          {financialData.timestamp && 
            `Updated: ${new Date(financialData.timestamp).toLocaleDateString()}`
          }
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const formattedValue = formatNumber(metric.value, metric.type);
          const isPositive = metric.value > 0;
          const isNegative = metric.value < 0;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 bg-${metric.color}-100 rounded-lg`}>
                    <Icon className={`w-4 h-4 text-${metric.color}-600`} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {metric.label}
                  </span>
                </div>
                {metric.isChange && metric.value !== null && (
                  <div className={`flex items-center ${getChangeColor(metric.value)}`}>
                    {getChangeIcon(metric.value)}
                  </div>
                )}
              </div>
              
              <div className="text-xl font-bold text-gray-900">
                {formattedValue}
              </div>
              
              {/* Add context for some metrics */}
              {metric.label === 'P/E Ratio' && metric.value && (
                <div className="text-xs text-gray-500 mt-1">
                  {metric.value < 15 ? 'Undervalued' : 
                   metric.value > 25 ? 'Overvalued' : 'Fair Value'}
                </div>
              )}
              
              {metric.label === 'Debt-to-Equity' && metric.value && (
                <div className="text-xs text-gray-500 mt-1">
                  {metric.value < 0.3 ? 'Low Debt' : 
                   metric.value > 1.0 ? 'High Debt' : 'Moderate Debt'}
                </div>
              )}
              
              {metric.label === 'Revenue Growth' && metric.value && (
                <div className="text-xs text-gray-500 mt-1">
                  {metric.value > 15 ? 'Strong Growth' : 
                   metric.value > 5 ? 'Moderate Growth' : 
                   metric.value > 0 ? 'Slow Growth' : 'Declining'}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Financial Health Indicator */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Financial Health Score
        </h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                style={{ width: '75%' }}
              />
            </div>
          </div>
          <span className="text-sm font-bold text-indigo-600">Good</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Based on P/E ratio, debt levels, and growth metrics
        </p>
      </div>
    </motion.div>
  );
};

export default FinancialMetrics;
