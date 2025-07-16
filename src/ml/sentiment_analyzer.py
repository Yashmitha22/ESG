"""
Sentiment analysis for ESG content - Python 3.12 Compatible
"""

import asyncio
from typing import List, Dict, Any
import numpy as np
from datetime import datetime
import re
from textblob import TextBlob

class SentimentAnalyzer:
    """Advanced sentiment analysis for ESG-related content using TextBlob"""
    
    def __init__(self):
        self.esg_keywords = {
            'Environmental': ['climate', 'carbon', 'renewable', 'sustainability', 'green', 'emissions', 'environment', 'pollution', 'waste', 'energy'],
            'Social': ['diversity', 'employees', 'community', 'safety', 'human rights', 'social', 'workplace', 'labor', 'diversity', 'inclusion'],
            'Governance': ['board', 'ethics', 'compliance', 'transparency', 'governance', 'leadership', 'audit', 'corruption', 'accountability']
        }
        print("Simple sentiment analyzer initialized successfully!")
    
    def _initialize_models(self):
        """Dummy method for compatibility"""
        pass
    
    async def analyze_batch(self, articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze sentiment for a batch of articles"""
        if not articles:
            return self._empty_sentiment_result()
        
        # Extract texts for analysis
        texts = []
        for article in articles:
            text = f"{article.get('title', '')} {article.get('description', '')}"
            texts.append(self._preprocess_text(text))
        
        # Run sentiment analysis
        sentiment_results = []
        esg_scores = []
        emotions = []
        
        try:
            # ESG sentiment analysis
            for text in texts:
                if text.strip():
                    esg_result = self.esg_sentiment_pipeline(text[:512])  # Limit token length
                    financial_result = self.financial_sentiment_pipeline(text[:512])
                    emotion_result = self.emotion_pipeline(text[:512])
                    
                    sentiment_results.append({
                        'esg_sentiment': esg_result[0] if esg_result else {'label': 'NEUTRAL', 'score': 0.5},
                        'financial_sentiment': financial_result[0] if financial_result else {'label': 'neutral', 'score': 0.5},
                        'emotion': emotion_result[0] if emotion_result else {'label': 'neutral', 'score': 0.5}
                    })
            
            # Calculate aggregated scores
            aggregated_results = self._aggregate_sentiments(sentiment_results, articles)
            
            return aggregated_results
            
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            return self._fallback_sentiment_analysis(texts, articles)
    
    def _preprocess_text(self, text: str) -> str:
        """Preprocess text for sentiment analysis"""
        if not text:
            return ""
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,!?;:-]', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text.strip()
    
    def _aggregate_sentiments(self, sentiment_results: List[Dict], articles: List[Dict]) -> Dict[str, Any]:
        """Aggregate individual sentiment results"""
        if not sentiment_results:
            return self._empty_sentiment_result()
        
        # Count sentiment labels
        positive_count = 0
        negative_count = 0
        neutral_count = 0
        
        esg_scores = []
        financial_scores = []
        emotions = []
        
        sentiment_trend = []
        
        for i, result in enumerate(sentiment_results):
            article = articles[i] if i < len(articles) else {}
            
            # ESG sentiment processing
            esg_sentiment = result.get('esg_sentiment', {})
            esg_label = esg_sentiment.get('label', 'NEUTRAL').upper()
            esg_score = esg_sentiment.get('score', 0.5)
            
            # Convert labels to standardized format
            if 'POSITIVE' in esg_label or esg_label in ['4 stars', '5 stars']:
                positive_count += 1
                esg_scores.append(esg_score)
            elif 'NEGATIVE' in esg_label or esg_label in ['1 star', '2 stars']:
                negative_count += 1
                esg_scores.append(-esg_score)
            else:
                neutral_count += 1
                esg_scores.append(0)
            
            # Financial sentiment
            financial_sentiment = result.get('financial_sentiment', {})
            financial_score = financial_sentiment.get('score', 0.5)
            financial_label = financial_sentiment.get('label', 'neutral').lower()
            
            if financial_label == 'positive':
                financial_scores.append(financial_score)
            elif financial_label == 'negative':
                financial_scores.append(-financial_score)
            else:
                financial_scores.append(0)
            
            # Emotions
            emotion = result.get('emotion', {})
            emotions.append(emotion.get('label', 'neutral'))
            
            # Sentiment trend
            sentiment_trend.append({
                'date': article.get('published_at', datetime.now().isoformat()),
                'sentiment': np.mean([esg_scores[-1], financial_scores[-1]]),
                'title': article.get('title', ''),
                'source': article.get('source', 'Unknown')
            })
        
        # Calculate overall sentiment
        overall_sentiment = np.mean(esg_scores + financial_scores) if (esg_scores + financial_scores) else 0
        
        # Identify key topics (simplified)
        key_topics = self._extract_key_topics(articles)
        
        return {
            'overall_sentiment': round(overall_sentiment, 3),
            'positive_count': positive_count,
            'negative_count': negative_count,
            'neutral_count': neutral_count,
            'sentiment_trend': sorted(sentiment_trend, key=lambda x: x['date'], reverse=True),
            'key_topics': key_topics,
            'esg_sentiment_avg': round(np.mean(esg_scores) if esg_scores else 0, 3),
            'financial_sentiment_avg': round(np.mean(financial_scores) if financial_scores else 0, 3),
            'dominant_emotions': self._get_dominant_emotions(emotions),
            'total_articles': len(articles)
        }
    
    def _extract_key_topics(self, articles: List[Dict]) -> List[str]:
        """Extract key topics from articles using simple keyword analysis"""
        esg_keywords = {
            'Environmental': ['climate', 'carbon', 'renewable', 'sustainability', 'green', 'emissions', 'environment'],
            'Social': ['diversity', 'employees', 'community', 'safety', 'human rights', 'social', 'workplace'],
            'Governance': ['board', 'ethics', 'compliance', 'transparency', 'governance', 'leadership', 'audit']
        }
        
        topic_scores = {topic: 0 for topic in esg_keywords.keys()}
        
        all_text = ' '.join([
            f"{article.get('title', '')} {article.get('description', '')}"
            for article in articles
        ]).lower()
        
        for topic, keywords in esg_keywords.items():
            for keyword in keywords:
                topic_scores[topic] += all_text.count(keyword)
        
        # Sort topics by frequency
        sorted_topics = sorted(topic_scores.items(), key=lambda x: x[1], reverse=True)
        
        return [topic for topic, score in sorted_topics if score > 0][:5]
    
    def _get_dominant_emotions(self, emotions: List[str]) -> List[str]:
        """Get the most common emotions"""
        emotion_counts = {}
        for emotion in emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        sorted_emotions = sorted(emotion_counts.items(), key=lambda x: x[1], reverse=True)
        return [emotion for emotion, count in sorted_emotions[:3]]
    
    def _fallback_sentiment_analysis(self, texts: List[str], articles: List[Dict]) -> Dict[str, Any]:
        """Fallback sentiment analysis using basic methods"""
        from textblob import TextBlob
        
        sentiments = []
        for text in texts:
            if text.strip():
                blob = TextBlob(text)
                sentiment = blob.sentiment.polarity
                sentiments.append(sentiment)
            else:
                sentiments.append(0)
        
        overall_sentiment = np.mean(sentiments) if sentiments else 0
        
        positive_count = sum(1 for s in sentiments if s > 0.1)
        negative_count = sum(1 for s in sentiments if s < -0.1)
        neutral_count = len(sentiments) - positive_count - negative_count
        
        sentiment_trend = [
            {
                'date': article.get('published_at', datetime.now().isoformat()),
                'sentiment': sentiments[i] if i < len(sentiments) else 0,
                'title': article.get('title', ''),
                'source': article.get('source', 'Unknown')
            }
            for i, article in enumerate(articles)
        ]
        
        return {
            'overall_sentiment': round(overall_sentiment, 3),
            'positive_count': positive_count,
            'negative_count': negative_count,
            'neutral_count': neutral_count,
            'sentiment_trend': sorted(sentiment_trend, key=lambda x: x['date'], reverse=True),
            'key_topics': self._extract_key_topics(articles),
            'esg_sentiment_avg': round(overall_sentiment, 3),
            'financial_sentiment_avg': round(overall_sentiment, 3),
            'dominant_emotions': ['neutral'],
            'total_articles': len(articles)
        }
    
    def _empty_sentiment_result(self) -> Dict[str, Any]:
        """Return empty sentiment result"""
        return {
            'overall_sentiment': 0.0,
            'positive_count': 0,
            'negative_count': 0,
            'neutral_count': 0,
            'sentiment_trend': [],
            'key_topics': [],
            'esg_sentiment_avg': 0.0,
            'financial_sentiment_avg': 0.0,
            'dominant_emotions': [],
            'total_articles': 0
        }
