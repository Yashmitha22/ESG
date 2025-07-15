import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3,
  Download,
  Share
} from 'lucide-react';
import { useESG } from '../context/ESGContext';
import Plot from 'react-plotly.js';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const { portfolio, addToPortfolio, removeFromPortfolio, analyzeCompany } = useESG();
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddToPortfolio = async (e) => {
    e.preventDefault();
    
    if (!newSymbol.trim()) {
      toast.error('Please enter a company symbol');
      return;
    }

    setLoading(true);
    try {
      const analysisResult = await analyzeCompany(newSymbol.toUpperCase());
      addToPortfolio(analysisResult);
      setNewSymbol('');
      toast.success(`${newSymbol.toUpperCase()} added to portfolio`);
    } catch (error) {
      toast.error('Failed to add company to portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromPortfolio = (symbol) => {
    removeFromPortfolio(symbol);
    toast.success(`${symbol} removed from portfolio`);
  };

  // Calculate portfolio metrics
  const portfolioMetrics = {
    totalCompanies: portfolio.length,
    avgESGScore: portfolio.length > 0 
      ? portfolio.reduce((sum, company) => sum + (company.esg_scores?.overall || 0), 0) / portfolio.length
      : 0,
    highRiskCount: portfolio.filter(company => 
      company.esg_scores?.risk_rating === 'High Risk' || 
      company.esg_scores?.risk_rating === 'Medium-High Risk'
    ).length,
    topPerformer: portfolio.length > 0 
      ? portfolio.reduce((best, company) => 
          (company.esg_scores?.overall || 0) > (best.esg_scores?.overall || 0) ? company : best
        )
      : null
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (portfolio.length === 0) return null;

    // ESG Scores by Company
    const companyNames = portfolio.map(company => company.symbol);
    const environmentalScores = portfolio.map(company => company.esg_scores?.environmental || 0);
    const socialScores = portfolio.map(company => company.esg_scores?.social || 0);
    const governanceScores = portfolio.map(company => company.esg_scores?.governance || 0);

    // Risk distribution
    const riskCounts = portfolio.reduce((acc, company) => {
      const risk = company.esg_scores?.risk_rating || 'Unknown';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {});

    return {
      companyScores: {
        names: companyNames,
        environmental: environmentalScores,
        social: socialScores,
        governance: governanceScores
      },
      riskDistribution: riskCounts
    };
  };

  const chartData = prepareChartData();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low Risk':
        return 'bg-green-100 text-green-800';
      case 'Medium-Low Risk':
        return 'bg-blue-100 text-blue-800';
      case 'Medium Risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'Medium-High Risk':
        return 'bg-orange-100 text-orange-800';
      case 'High Risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart configurations
  const esgBarChart = chartData ? [{
    x: chartData.companyScores.names,
    y: chartData.companyScores.environmental,
    name: 'Environmental',
    type: 'bar',
    marker: { color: '#22c55e' }
  }, {
    x: chartData.companyScores.names,
    y: chartData.companyScores.social,
    name: 'Social',
    type: 'bar',
    marker: { color: '#3b82f6' }
  }, {
    x: chartData.companyScores.names,
    y: chartData.companyScores.governance,
    name: 'Governance',
    type: 'bar',
    marker: { color: '#8b5cf6' }
  }] : [];

  const riskPieChart = chartData ? [{
    values: Object.values(chartData.riskDistribution),
    labels: Object.keys(chartData.riskDistribution),
    type: 'pie',
    marker: {
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444']
    }
  }] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ESG Portfolio
            </h1>
            <p className="text-gray-600">
              Track and analyze your sustainable investment portfolio
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Companies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioMetrics.totalCompanies}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Avg ESG Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioMetrics.avgESGScore.toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  High Risk
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioMetrics.highRiskCount}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Top Performer
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {portfolioMetrics.topPerformer?.symbol || 'None'}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add Company Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Company to Portfolio
          </h3>
          
          <form onSubmit={handleAddToPortfolio} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="Enter company symbol (e.g., AAPL, TSLA)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Adding...' : 'Add'}</span>
            </button>
          </form>
        </motion.div>

        {/* Charts Section */}
        {portfolio.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* ESG Scores Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ESG Scores by Company
              </h3>
              <Plot
                data={esgBarChart}
                layout={{
                  height: 300,
                  margin: { t: 20, b: 60, l: 40, r: 20 },
                  barmode: 'group',
                  xaxis: { title: '' },
                  yaxis: { title: 'ESG Score', range: [0, 100] },
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  legend: { x: 0, y: 1 }
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: '100%' }}
              />
            </motion.div>

            {/* Risk Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Risk Distribution
              </h3>
              <Plot
                data={riskPieChart}
                layout={{
                  height: 300,
                  margin: { t: 20, b: 20, l: 20, r: 20 },
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  showlegend: true,
                  legend: { x: 0, y: 0 }
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: '100%' }}
              />
            </motion.div>
          </div>
        )}

        {/* Portfolio Companies List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Portfolio Companies ({portfolio.length})
          </h3>

          {portfolio.length === 0 ? (
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No companies in portfolio
              </h4>
              <p className="text-gray-600 mb-6">
                Start building your ESG portfolio by adding companies above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio.map((company, index) => (
                <motion.div
                  key={company.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {company.symbol.substring(0, 2)}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-semibold text-gray-900">
                          {company.symbol}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(company.esg_scores?.risk_rating)}`}>
                          {company.esg_scores?.risk_rating || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {company.company_name || company.symbol}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(company.esg_scores?.overall || 0).split(' ')[0]}`}>
                        {company.esg_scores?.overall?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">ESG Score</div>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveFromPortfolio(company.symbol)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;
