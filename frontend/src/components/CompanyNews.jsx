import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  ExternalLink, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CompanyNews = ({ symbol, sentimentData }) => {
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [sortBy, setSortBy] = useState('date');

  // Generate sample news data based on sentiment
  const generateNewsData = () => {
    if (!sentimentData || !sentimentData.sentiment_trend) return [];
    
    return sentimentData.sentiment_trend.slice(0, 10).map((item, index) => ({
      id: index,
      title: item.title || `${symbol} ${getSampleTitle(item.sentiment)}`,
      summary: `Analysis of ${symbol}'s recent developments and market impact. ${getSentimentDescription(item.sentiment)}`,
      url: `#news-${index}`,
      source: item.source || getSampleSource(),
      publishedAt: item.date,
      sentiment: item.sentiment,
      sentimentLabel: getSentimentLabel(item.sentiment)
    }));
  };

  const getSampleTitle = (sentiment) => {
    if (sentiment > 0.3) return 'Reports Strong Q4 Earnings Beat';
    if (sentiment > 0.1) return 'Announces New Sustainability Initiative';
    if (sentiment < -0.3) return 'Faces Regulatory Challenges';
    if (sentiment < -0.1) return 'Stock Price Declines on Market Concerns';
    return 'Updates on Business Operations';
  };

  const getSampleSource = () => {
    const sources = ['Reuters', 'Bloomberg', 'Financial Times', 'Wall Street Journal', 'Yahoo Finance'];
    return sources[Math.floor(Math.random() * sources.length)];
  };

  const getSentimentDescription = (sentiment) => {
    if (sentiment > 0.3) return 'Market analysts are optimistic about the company\'s future prospects.';
    if (sentiment > 0.1) return 'The development is viewed positively by industry experts.';
    if (sentiment < -0.3) return 'Investors express concerns about potential impacts on performance.';
    if (sentiment < -0.1) return 'Market sentiment remains cautious following recent developments.';
    return 'The market maintains a neutral outlook on recent developments.';
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.3) return 'Very Positive';
    if (sentiment > 0.1) return 'Positive';
    if (sentiment < -0.3) return 'Very Negative';
    if (sentiment < -0.1) return 'Negative';
    return 'Neutral';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return 'bg-green-100 text-green-800';
    if (sentiment < -0.1) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.1) return <TrendingUp className="w-3 h-3" />;
    if (sentiment < -0.1) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const newsData = generateNewsData();

  const sortedNews = [...newsData].sort((a, b) => {
    switch (sortBy) {
      case 'sentiment':
        return b.sentiment - a.sentiment;
      case 'date':
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      default:
        return 0;
    }
  });

  if (newsData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Newspaper className="w-5 h-5 mr-2" />
          Recent News
        </h3>
        <div className="text-center py-8 text-gray-500">
          No recent news available for {symbol}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Newspaper className="w-5 h-5 mr-2" />
          Recent News & Analysis
        </h3>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="sentiment">Sentiment</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedNews.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
                    {getSentimentIcon(article.sentiment)}
                    <span>{article.sentimentLabel}</span>
                  </span>
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{article.source}</span>
                  </div>
                </div>
                
                <h4 className="text-md font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.summary}
                </p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setExpandedArticle(
                      expandedArticle === article.id ? null : article.id
                    )}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>
                      {expandedArticle === article.id ? 'Show Less' : 'Read More'}
                    </span>
                    {expandedArticle === article.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                  
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Source</span>
                  </a>
                </div>
              </div>
              
              <div className="ml-4 text-right">
                <div className="text-lg font-bold text-gray-900">
                  {article.sentiment > 0 ? '+' : ''}{article.sentiment.toFixed(3)}
                </div>
                <div className="text-xs text-gray-500">Sentiment Score</div>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedArticle === article.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700">
                      This article discusses {symbol}'s recent developments and their impact on ESG ratings. 
                      The sentiment analysis indicates {article.sentimentLabel.toLowerCase()} market perception 
                      based on the content and context of the reporting.
                    </p>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Key Points:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Market sentiment score: {article.sentiment.toFixed(3)}</li>
                        <li>• Publication source: {article.source}</li>
                        <li>• ESG relevance: {article.sentiment > 0 ? 'Positive' : article.sentiment < 0 ? 'Negative' : 'Neutral'} impact expected</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
      {newsData.length > 10 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
            Load More Articles
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyNews;
