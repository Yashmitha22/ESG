import React from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { BarChart3, TrendingUp, Globe, Building } from 'lucide-react';

const MarketOverview = ({ sectorData = [] }) => {
  // Sample market indices data
  const marketIndices = [
    { name: 'S&P 500', value: 4780.2, change: 1.2, changePercent: 0.025 },
    { name: 'NASDAQ', value: 15234.5, change: -0.8, changePercent: -0.005 },
    { name: 'Dow Jones', value: 37856.2, change: 0.5, changePercent: 0.013 },
  ];

  // Prepare sector chart data
  const prepareSectorChartData = () => {
    if (sectorData.length === 0) {
      // Sample data for demonstration
      return {
        sectors: ['Technology', 'Healthcare', 'Financials', 'Energy', 'Consumer Discretionary'],
        avgScores: [75.2, 68.8, 72.1, 45.6, 58.9],
        companyCounts: [15, 12, 18, 8, 11]
      };
    }

    return {
      sectors: sectorData.map(sector => sector.sector),
      avgScores: sectorData.map(sector => sector.avg_overall),
      companyCounts: sectorData.map(sector => sector.company_count)
    };
  };

  const chartData = prepareSectorChartData();

  const sectorChartData = [{
    x: chartData.sectors,
    y: chartData.avgScores,
    type: 'bar',
    marker: {
      color: chartData.avgScores.map(score => {
        if (score >= 70) return '#22c55e';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
      }),
      opacity: 0.8
    },
    text: chartData.avgScores.map(score => `${score.toFixed(1)}`),
    textposition: 'outside',
    name: 'ESG Score'
  }];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 rotate-180" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Market Overview
        </h3>
        <BarChart3 className="w-5 h-5 text-blue-500" />
      </div>

      {/* Market Indices */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">Market Indices</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketIndices.map((index, idx) => (
            <motion.div
              key={index.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {index.name}
                </span>
                <Building className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="mt-2">
                <div className="text-lg font-bold text-gray-900">
                  {index.value.toLocaleString()}
                </div>
                <div className={`flex items-center space-x-1 ${getChangeColor(index.change)}`}>
                  {getChangeIcon(index.change)}
                  <span className="text-sm font-medium">
                    {index.change > 0 ? '+' : ''}{index.change}
                  </span>
                  <span className="text-sm">
                    ({index.changePercent > 0 ? '+' : ''}{(index.changePercent * 100).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sector ESG Scores */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-4">
          ESG Scores by Sector
        </h4>
        
        <div className="h-64">
          <Plot
            data={sectorChartData}
            layout={{
              height: 240,
              margin: { t: 20, b: 60, l: 40, r: 20 },
              xaxis: {
                title: '',
                tickangle: -45,
                showgrid: false
              },
              yaxis: {
                title: 'ESG Score',
                range: [0, 100],
                showgrid: true,
                gridcolor: '#f3f4f6'
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              showlegend: false,
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 12
              }
            }}
            config={{ 
              displayModeBar: false,
              responsive: true
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Sector Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {chartData.avgScores.filter(score => score >= 70).length}
            </div>
            <div className="text-sm text-gray-600">High ESG Sectors</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {chartData.companyCounts.reduce((sum, count) => sum + count, 0)}
            </div>
            <div className="text-sm text-gray-600">Companies Analyzed</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {(chartData.avgScores.reduce((sum, score) => sum + score, 0) / chartData.avgScores.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Average ESG Score</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketOverview;
