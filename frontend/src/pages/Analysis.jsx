import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useESG } from '../context/ESGContext';
import ESGScoreCard from '../components/ESGScoreCard';
import SentimentChart from '../components/SentimentChart';
import FinancialMetrics from '../components/FinancialMetrics';
import CompanyNews from '../components/CompanyNews';
import toast from 'react-hot-toast';

const Analysis = () => {
  const { analyzeCompany, currentAnalysis, loading, error } = useESG();
  const [symbol, setSymbol] = useState('');
  const [daysBack, setDaysBack] = useState(30);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!symbol.trim()) {
      toast.error('Please enter a company symbol');
      return;
    }

    try {
      await analyzeCompany(symbol.toUpperCase(), daysBack);
      toast.success(`Analysis complete for ${symbol.toUpperCase()}`);
    } catch (error) {
      toast.error(error.message || 'Analysis failed');
    }
  };

  const getRiskColor = (riskRating) => {
    switch (riskRating) {
      case 'Low Risk':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium-Low Risk':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Medium Risk':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Medium-High Risk':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'High Risk':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Company Analysis
          </h1>
          <p className="text-gray-600">
            Comprehensive ESG analysis with real-time sentiment and financial data
          </p>
        </div>

        {/* Analysis Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
                Company Symbol
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g., AAPL, TSLA, MSFT"
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <label htmlFor="daysBack" className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Period
              </label>
              <select
                id="daysBack"
                value={daysBack}
                onChange={(e) => setDaysBack(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={180}>6 months</option>
              </select>
            </div>
            
            <div className="sm:w-32 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing {symbol.toUpperCase()}</h3>
            <p className="text-gray-600">
              Fetching financial data, news sentiment, and calculating ESG scores...
            </p>
          </motion.div>
        )}

        {/* Analysis Results */}
        {currentAnalysis && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Company Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentAnalysis.company_name || currentAnalysis.symbol}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Symbol: {currentAnalysis.symbol}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    getRiskColor(currentAnalysis.esg_scores?.risk_rating)
                  }`}>
                    {currentAnalysis.esg_scores?.risk_rating === 'Low Risk' ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-1" />
                    )}
                    {currentAnalysis.esg_scores?.risk_rating || 'Unknown Risk'}
                  </div>
                </div>
              </div>
            </div>

            {/* ESG Scores Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <ESGScoreCard
                title="Environmental"
                score={currentAnalysis.esg_scores?.environmental || 0}
                maxScore={100}
                color="green"
                icon="🌱"
              />
              <ESGScoreCard
                title="Social"
                score={currentAnalysis.esg_scores?.social || 0}
                maxScore={100}
                color="blue"
                icon="👥"
              />
              <ESGScoreCard
                title="Governance"
                score={currentAnalysis.esg_scores?.governance || 0}
                maxScore={100}
                color="purple"
                icon="🛡️"
              />
              <ESGScoreCard
                title="Overall ESG"
                score={currentAnalysis.esg_scores?.overall || 0}
                maxScore={100}
                color="gray"
                icon="📊"
                highlight={true}
              />
            </div>

            {/* Charts and Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sentiment Analysis */}
              <SentimentChart sentimentData={currentAnalysis.sentiment_data} />
              
              {/* Financial Metrics */}
              <FinancialMetrics financialData={currentAnalysis.financial_metrics} />
            </div>

            {/* Company News */}
            <CompanyNews 
              symbol={currentAnalysis.symbol}
              sentimentData={currentAnalysis.sentiment_data}
            />
          </motion.div>
        )}

        {/* Empty State */}
        {!currentAnalysis && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to analyze
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a company symbol above to get comprehensive ESG analysis with real-time 
              sentiment data and financial metrics.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
