"""
News data service for fetching company-related news
"""

import requests
import asyncio
from typing import List, Dict, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class NewsDataService:
    """Service for fetching news data from various sources"""
    
    def __init__(self):
        self.news_api_key = os.getenv('NEWS_API_KEY')
        self.alpha_vantage_key = os.getenv('ALPHA_VANTAGE_API_KEY')
        
    async def get_company_news(self, symbol: str, days_back: int = 30) -> List[Dict[str, Any]]:
        """Get recent news articles for a company"""
        news_articles = []
        
        # Try multiple news sources
        try:
            # News API
            if self.news_api_key:
                news_api_articles = await self._fetch_from_news_api(symbol, days_back)
                news_articles.extend(news_api_articles)
            
            # Alpha Vantage News
            if self.alpha_vantage_key:
                av_articles = await self._fetch_from_alpha_vantage(symbol)
                news_articles.extend(av_articles)
            
            # If no API keys, use sample data
            if not news_articles:
                news_articles = self._get_sample_news(symbol)
                
        except Exception as e:
            print(f"Error fetching news for {symbol}: {e}")
            news_articles = self._get_sample_news(symbol)
        
        return news_articles[:50]  # Limit to 50 articles
    
    async def _fetch_from_news_api(self, symbol: str, days_back: int) -> List[Dict[str, Any]]:
        """Fetch news from News API"""
        articles = []
        
        try:
            from_date = (datetime.now() - timedelta(days=days_back)).strftime('%Y-%m-%d')
            
            # Get company name for better search results
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            company_name = ticker.info.get('longName', symbol)
            
            url = 'https://newsapi.org/v2/everything'
            params = {
                'q': f'{symbol} OR "{company_name}"',
                'from': from_date,
                'sortBy': 'relevancy',
                'apiKey': self.news_api_key,
                'language': 'en',
                'pageSize': 30
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            for article in data.get('articles', []):
                articles.append({
                    'title': article.get('title', ''),
                    'description': article.get('description', ''),
                    'content': article.get('content', ''),
                    'url': article.get('url', ''),
                    'published_at': article.get('publishedAt', ''),
                    'source': article.get('source', {}).get('name', 'Unknown'),
                    'symbol': symbol
                })
                
        except Exception as e:
            print(f"Error fetching from News API: {e}")
            
        return articles
    
    async def _fetch_from_alpha_vantage(self, symbol: str) -> List[Dict[str, Any]]:
        """Fetch news from Alpha Vantage"""
        articles = []
        
        try:
            url = 'https://www.alphavantage.co/query'
            params = {
                'function': 'NEWS_SENTIMENT',
                'tickers': symbol,
                'apikey': self.alpha_vantage_key,
                'limit': 20
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            for item in data.get('feed', []):
                articles.append({
                    'title': item.get('title', ''),
                    'description': item.get('summary', ''),
                    'content': item.get('summary', ''),
                    'url': item.get('url', ''),
                    'published_at': item.get('time_published', ''),
                    'source': item.get('source', 'Alpha Vantage'),
                    'sentiment': item.get('overall_sentiment_label', 'Neutral'),
                    'sentiment_score': item.get('overall_sentiment_score', 0),
                    'symbol': symbol
                })
                
        except Exception as e:
            print(f"Error fetching from Alpha Vantage: {e}")
            
        return articles
    
    def _get_sample_news(self, symbol: str) -> List[Dict[str, Any]]:
        """Generate sample news data when APIs are not available"""
        import random
        
        sample_headlines = [
            f"{symbol} Reports Strong Q4 Earnings Beat",
            f"{symbol} Announces New Sustainability Initiative",
            f"{symbol} CEO Discusses Climate Change Strategy",
            f"{symbol} Invests in Renewable Energy Projects",
            f"{symbol} Receives ESG Rating Upgrade",
            f"{symbol} Launches Green Bond Program",
            f"{symbol} Partners with Environmental Organizations",
            f"{symbol} Sets Net-Zero Carbon Emissions Target",
            f"{symbol} Improves Corporate Governance Practices",
            f"{symbol} Enhances Employee Diversity Programs"
        ]
        
        articles = []
        for i, headline in enumerate(sample_headlines):
            sentiment_scores = [0.2, 0.5, 0.8, -0.2, -0.5]
            sentiment_labels = ["Positive", "Neutral", "Positive", "Negative", "Neutral"]
            
            sentiment_score = random.choice(sentiment_scores)
            sentiment_label = random.choice(sentiment_labels)
            
            articles.append({
                'title': headline,
                'description': f"Analysis of {symbol} recent developments and market impact.",
                'content': f"Detailed analysis of {symbol} business activities and ESG initiatives. The company continues to show commitment to sustainable practices and stakeholder value.",
                'url': f"https://example.com/news/{symbol.lower()}-{i}",
                'published_at': (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                'source': random.choice(['Financial Times', 'Reuters', 'Bloomberg', 'Wall Street Journal']),
                'sentiment': sentiment_label,
                'sentiment_score': sentiment_score,
                'symbol': symbol
            })
        
        return articles
    
    async def get_sector_news(self, sector: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get news articles for a specific sector"""
        try:
            if self.news_api_key:
                url = 'https://newsapi.org/v2/everything'
                params = {
                    'q': f'{sector} sustainability ESG',
                    'sortBy': 'relevancy',
                    'apiKey': self.news_api_key,
                    'language': 'en',
                    'pageSize': limit
                }
                
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                
                data = response.json()
                
                articles = []
                for article in data.get('articles', []):
                    articles.append({
                        'title': article.get('title', ''),
                        'description': article.get('description', ''),
                        'url': article.get('url', ''),
                        'published_at': article.get('publishedAt', ''),
                        'source': article.get('source', {}).get('name', 'Unknown'),
                        'sector': sector
                    })
                
                return articles
            
        except Exception as e:
            print(f"Error fetching sector news: {e}")
        
        return []
