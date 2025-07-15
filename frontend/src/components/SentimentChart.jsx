import React from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { TrendingUp, MessageCircle, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';

const SentimentChart = ({ sentimentData }) => {
  if (!sentimentData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Sentiment Analysis
        </h3>
        <div className="text-center py-8 text-gray-500">
          No sentiment data available
        </div>
      </div>
    );
  }

  const { 
    overall_sentiment, 
    positive_count, 
    negative_count, 
    neutral_count,
    sentiment_trend,
    key_topics 
  } = sentimentData;

  // Prepare trend data for chart
  const trendData = sentiment_trend?.slice(0, 20) || [];
  const dates = trendData.map(item => new Date(item.date).toLocaleDateString());
  const sentiments = trendData.map(item => item.sentiment);

  // Sentiment distribution data
  const pieData = [{
    values: [positive_count, neutral_count, negative_count],
    labels: ['Positive', 'Neutral', 'Negative'],
    type: 'pie',
    marker: {
      colors: ['#22c55e', '#64748b', '#ef4444']
    },
    textinfo: 'label+percent',
    textposition: 'outside'
  }];

  // Trend line data
  const trendLineData = [{
    x: dates.reverse(),
    y: sentiments.reverse(),
    type: 'scatter',
    mode: 'lines+markers',
    line: {
      color: '#3b82f6',
      width: 3
    },
    marker: {
      color: '#3b82f6',
      size: 6
    },
    name: 'Sentiment Score'
  }];

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return 'text-green-600 bg-green-50';
    if (sentiment < -0.1) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.3) return 'Very Positive';
    if (sentiment > 0.1) return 'Positive';
    if (sentiment < -0.3) return 'Very Negative';
    if (sentiment < -0.1) return 'Negative';
    return 'Neutral';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.1) return <ThumbsUp className="w-4 h-4" />;
    if (sentiment < -0.1) return <ThumbsDown className="w-4 h-4" />;
    return <Heart className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Sentiment Analysis
        </h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getSentimentColor(overall_sentiment)}`}>
          {getSentimentIcon(overall_sentiment)}
          <span className="text-sm font-medium">
            {getSentimentLabel(overall_sentiment)}
          </span>
        </div>
      </div>

      {/* Overall Sentiment Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Overall Sentiment</span>
          <span className={`text-lg font-bold ${getSentimentColor(overall_sentiment).split(' ')[0]}`}>
            {overall_sentiment > 0 ? '+' : ''}{overall_sentiment.toFixed(3)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              overall_sentiment > 0 ? 'bg-green-500' : overall_sentiment < 0 ? 'bg-red-500' : 'bg-gray-400'
            }`}
            style={{ 
              width: `${Math.abs(overall_sentiment) * 100}%`,
              marginLeft: overall_sentiment < 0 ? `${(1 + overall_sentiment) * 100}%` : '0'
            }}
          />
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Article Distribution</h4>
          <Plot
            data={pieData}
            layout={{
              width: 280,
              height: 280,
              margin: { t: 20, b: 20, l: 20, r: 20 },
              showlegend: false,
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)'
            }}
            config={{ displayModeBar: false }}
          />
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Article Counts</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Positive</span>
              </div>
              <span className="text-lg font-bold text-green-600">{positive_count}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Neutral</span>
              </div>
              <span className="text-lg font-bold text-gray-600">{neutral_count}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Negative</span>
              </div>
              <span className="text-lg font-bold text-red-600">{negative_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Trend */}
      {trendData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-3">Sentiment Trend</h4>
          <Plot
            data={trendLineData}
            layout={{
              width: 500,
              height: 200,
              margin: { t: 20, b: 40, l: 40, r: 20 },
              xaxis: {
                title: 'Date',
                showgrid: false
              },
              yaxis: {
                title: 'Sentiment Score',
                range: [-1, 1],
                zeroline: true,
                zerolinecolor: '#e5e7eb',
                showgrid: true,
                gridcolor: '#f3f4f6'
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              showlegend: false
            }}
            config={{ displayModeBar: false }}
          />
        </div>
      )}

      {/* Key Topics */}
      {key_topics && key_topics.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Key ESG Topics</h4>
          <div className="flex flex-wrap gap-2">
            {key_topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SentimentChart;
