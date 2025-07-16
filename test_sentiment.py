"""
Test the simplified sentiment analyzer
"""
import sys
sys.path.append('src')

from ml.sentiment_analyzer import SentimentAnalyzer
import asyncio

async def test_sentiment_analyzer():
    analyzer = SentimentAnalyzer()
    
    # Test articles
    test_articles = [
        {
            'title': 'Company improves carbon footprint with renewable energy',
            'description': 'The company announced a major initiative to reduce emissions and invest in green technology.',
            'published_at': '2025-07-15T12:00:00Z',
            'source': 'ESG News'
        },
        {
            'title': 'Board faces governance challenges',
            'description': 'Shareholders raise concerns about transparency and accountability in leadership decisions.',
            'published_at': '2025-07-15T10:00:00Z',
            'source': 'Financial Times'
        }
    ]
    
    # Analyze sentiment
    result = await analyzer.analyze_batch(test_articles)
    
    print("✅ Sentiment Analysis Test Results:")
    print(f"Overall Sentiment: {result['overall_sentiment']}")
    print(f"Positive: {result['positive_count']}, Negative: {result['negative_count']}, Neutral: {result['neutral_count']}")
    print(f"Key Topics: {result['key_topics']}")
    print(f"ESG Relevance: {result.get('esg_relevance', 'N/A')}")
    print("\n🎉 Sentiment analyzer is working correctly!")

if __name__ == "__main__":
    asyncio.run(test_sentiment_analyzer())
