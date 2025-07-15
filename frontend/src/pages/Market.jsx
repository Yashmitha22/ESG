import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  BarChart3,
  Filter,
  Search
} from 'lucide-react';
import { useESG } from '../context/ESGContext';
import Plot from 'react-plotly.js';

const Market = () => {
  const { getSectorAnalysis, getTrendingCompanies } = useESG();
  const [sectorData, setSectorData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState('avg_overall');

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const [sectors, trending] = await Promise.all([
        getSectorAnalysis(),
        getTrendingCompanies()
      ]);
      
      setSectorData(sectors || []);
      setTrendingData(trending || []);
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample market data for demonstration
  const marketIndices = [
    { 
      name: 'S&P 500 ESG', 
      value: 4789.2, 
      change: 15.3, 
      changePercent: 0.32,
      description: 'ESG-focused S&P 500 companies'
    },
    { 
      name: 'MSCI World ESG', 
      value: 3241.8, 
      change: -8.7, 
      changePercent: -0.27,
      description: 'Global ESG leaders index'
    },
    { 
      name: 'FTSE4Good', 
      value: 1876.4, 
      change: 23.1, 
      changePercent: 1.25,
      description: 'Global sustainable investment index'
    },
    { 
      name: 'Dow Jones Sustainability', 
      value: 2945.7, 
      change: 12.4, 
      changePercent: 0.42,
      description: 'Corporate sustainability leaders'
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Prepare sector comparison chart
  const prepareSectorChart = () => {
    const filteredData = selectedSector === 'All' 
      ? sectorData 
      : sectorData.filter(sector => sector.sector === selectedSector);

    if (filteredData.length === 0) {
      // Sample data for demonstration
      return {
        x: ['Technology', 'Healthcare', 'Financials', 'Energy', 'Consumer Discretionary'],
        environmental: [75, 68, 65, 45, 58],
        social: [78, 85, 72, 52, 61],
        governance: [82, 76, 88, 58, 64]
      };
    }

    return {
      x: filteredData.map(item => item.sector),
      environmental: filteredData.map(item => item.avg_environmental),
      social: filteredData.map(item => item.avg_social),
      governance: filteredData.map(item => item.avg_governance)
    };
  };

  const chartData = prepareSectorChart();

  const sectorChartData = [
    {
      x: chartData.x,
      y: chartData.environmental,
      name: 'Environmental',
      type: 'bar',
      marker: { color: '#22c55e' }
    },
    {
      x: chartData.x,
      y: chartData.social,
      name: 'Social',
      type: 'bar',
      marker: { color: '#3b82f6' }
    },
    {
      x: chartData.x,
      y: chartData.governance,
      name: 'Governance',
      type: 'bar',
      marker: { color: '#8b5cf6' }
    }
  ];

  const sectors = ['All', ...new Set(sectorData.map(item => item.sector))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading market data...</p>
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
            ESG Market Overview
          </h1>
          <p className="text-gray-600">
            Global sustainable investment market trends and sector analysis
          </p>
        </div>

        {/* ESG Market Indices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            ESG Market Indices
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketIndices.map((index, idx) => (
              <motion.div
                key={index.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {index.name}
                  </span>
                  <Building2 className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="mb-3">
                  <div className="text-xl font-bold text-gray-900">
                    {index.value.toLocaleString()}
                  </div>
                  <div className={`flex items-center space-x-1 ${getChangeColor(index.change)}`}>
                    {getChangeIcon(index.change)}
                    <span className="text-sm font-medium">
                      {index.change > 0 ? '+' : ''}{index.change}
                    </span>
                    <span className="text-sm">
                      ({index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600">
                  {index.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Sector:</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="avg_overall">Overall ESG</option>
                  <option value="avg_environmental">Environmental</option>
                  <option value="avg_social">Social</option>
                  <option value="avg_governance">Governance</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sector Analysis Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Sector ESG Comparison
          </h3>
          
          <Plot
            data={sectorChartData}
            layout={{
              height: 400,
              margin: { t: 20, b: 60, l: 40, r: 20 },
              barmode: 'group',
              xaxis: { 
                title: 'Sectors',
                tickangle: -45
              },
              yaxis: { 
                title: 'ESG Score',
                range: [0, 100]
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              legend: { x: 0, y: 1 }
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
          />
        </motion.div>

        {/* Sector Details and Trending Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sector Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Sector Performance Details
            </h3>
            
            <div className="space-y-4">
              {sectorData.length > 0 ? (
                sectorData
                  .sort((a, b) => b[sortBy] - a[sortBy])
                  .slice(0, 6)
                  .map((sector, index) => (
                    <motion.div
                      key={sector.sector}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {sector.sector}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {sector.company_count} companies analyzed
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(sector.avg_overall)}`}>
                          {sector.avg_overall.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          E:{sector.avg_environmental.toFixed(0)} S:{sector.avg_social.toFixed(0)} G:{sector.avg_governance.toFixed(0)}
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No sector data available
                </div>
              )}
            </div>
          </motion.div>

          {/* Trending Companies */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Trending ESG Companies
            </h3>
            
            <div className="space-y-4">
              {trendingData.length > 0 ? (
                trendingData.slice(0, 8).map((company, index) => (
                  <motion.div
                    key={company.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {company.symbol.substring(0, 2)}
                        </span>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-900">
                          {company.symbol}
                        </div>
                        <div className="text-sm text-gray-600">
                          {company.name}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {company.latest_score?.toFixed(1) || 'N/A'}
                      </div>
                      {company.score_change !== undefined && (
                        <div className={`flex items-center justify-end space-x-1 ${getChangeColor(company.score_change)}`}>
                          {getChangeIcon(company.score_change)}
                          <span className="text-xs font-medium">
                            {company.score_change > 0 ? '+' : ''}{company.score_change.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No trending data available
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Market;
