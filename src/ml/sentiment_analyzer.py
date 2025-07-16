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
        """Analyze sentiment for a batch of articles using TextBlob"""
        if not articles:
            return self._empty_sentiment_result()
        
        # Extract texts for analysis
        texts = []
        for article in articles:
            text = f"{article.get('title', '')} {article.get('description', '')}"
            texts.append(self._preprocess_text(text))
        
        # Run sentiment analysis using TextBlob
        sentiment_results = []
        
        try:
            for text in texts:
                if text.strip():
                    # TextBlob sentiment analysis
                    blob = TextBlob(text)
                    polarity = blob.sentiment.polarity  # -1 to 1
                    subjectivity = blob.sentiment.subjectivity  # 0 to 1
                    
                    # Convert polarity to positive/negative/neutral
                    if polarity > 0.1:
                        sentiment_label = 'POSITIVE'
                        score = polarity
                    elif polarity < -0.1:
                        sentiment_label = 'NEGATIVE'
                        score = abs(polarity)
                    else:
                        sentiment_label = 'NEUTRAL'
                        score = 0.5
                    
                    # Analyze ESG relevance
                    esg_relevance = self._analyze_esg_relevance(text)
                    
                    sentiment_results.append({
                        'sentiment_label': sentiment_label,
                        'sentiment_score': score,
                        'polarity': polarity,
                        'subjectivity': subjectivity,
                        'esg_relevance': esg_relevance
                    })
                else:
                    sentiment_results.append({
                        'sentiment_label': 'NEUTRAL',
                        'sentiment_score': 0.5,
                        'polarity': 0,
                        'subjectivity': 0,
                        'esg_relevance': {'Environmental': 0, 'Social': 0, 'Governance': 0}
                    })
            
            # Calculate aggregated scores
            aggregated_results = self._aggregate_sentiments_simple(sentiment_results, articles)
            
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
    
    def _analyze_esg_relevance(self, text: str) -> Dict[str, float]:
        """Analyze ESG relevance of text"""
        text_lower = text.lower()
        esg_scores = {}
        
        for category, keywords in self.esg_keywords.items():
            score = 0
            for keyword in keywords:
                score += text_lower.count(keyword)
            
            # Normalize score
            esg_scores[category] = min(1.0, score / 5.0)  # Cap at 1.0
        
        return esg_scores
    
    def _aggregate_sentiments_simple(self, sentiment_results: List[Dict], articles: List[Dict]) -> Dict[str, Any]:
        """Aggregate sentiment results using simple TextBlob analysis"""
        if not sentiment_results:
            return self._empty_sentiment_result()
        
        # Count sentiment labels
        positive_count = sum(1 for r in sentiment_results if r['sentiment_label'] == 'POSITIVE')
        negative_count = sum(1 for r in sentiment_results if r['sentiment_label'] == 'NEGATIVE')
        neutral_count = len(sentiment_results) - positive_count - negative_count
        
        # Calculate average sentiment
        polarities = [r['polarity'] for r in sentiment_results]
        overall_sentiment = np.mean(polarities) if polarities else 0
        
        # ESG relevance scores
        esg_environmental = np.mean([r['esg_relevance']['Environmental'] for r in sentiment_results])
        esg_social = np.mean([r['esg_relevance']['Social'] for r in sentiment_results])
        esg_governance = np.mean([r['esg_relevance']['Governance'] for r in sentiment_results])
        
        # Create sentiment trend
        sentiment_trend = []
        for i, (result, article) in enumerate(zip(sentiment_results, articles)):
            sentiment_trend.append({
                'date': article.get('published_at', datetime.now().isoformat()),
                'sentiment': result['polarity'],
                'title': article.get('title', ''),
                'source': article.get('source', 'Unknown'),
                'esg_relevance': result['esg_relevance']
            })
        
        # Sort by date
        sentiment_trend.sort(key=lambda x: x['date'], reverse=True)
        
        # Extract key topics
        key_topics = self._extract_key_topics(articles)
        
        return {
            'overall_sentiment': round(overall_sentiment, 3),
            'positive_count': positive_count,
            'negative_count': negative_count,
            'neutral_count': neutral_count,
            'sentiment_trend': sentiment_trend,
            'key_topics': key_topics,
            'esg_sentiment_avg': round(overall_sentiment, 3),
            'financial_sentiment_avg': round(overall_sentiment, 3),
            'esg_relevance': {
                'Environmental': round(esg_environmental, 3),
                'Social': round(esg_social, 3),
                'Governance': round(esg_governance, 3)
            },
            'dominant_emotions': ['neutral'],  # Simplified for now
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
        """Fallback sentiment analysis using basic TextBlob methods"""
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
            'esg_relevance': {'Environmental': 0, 'Social': 0, 'Governance': 0},
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
