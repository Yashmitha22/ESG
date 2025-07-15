"""
Pydantic models for request/response schemas
"""

from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class ESGRequest(BaseModel):
    """Request model for ESG analysis"""
    symbol: str
    days_back: Optional[int] = 30
    include_competitors: Optional[bool] = False
    
class ESGScores(BaseModel):
    """ESG scoring model"""
    environmental: float
    social: float
    governance: float
    overall: float
    risk_rating: str
    
class FinancialMetrics(BaseModel):
    """Financial metrics model"""
    market_cap: Optional[float]
    pe_ratio: Optional[float]
    revenue_growth: Optional[float]
    debt_to_equity: Optional[float]
    roe: Optional[float]
    current_price: Optional[float]
    
class SentimentData(BaseModel):
    """Sentiment analysis results"""
    overall_sentiment: float
    positive_count: int
    negative_count: int
    neutral_count: int
    sentiment_trend: List[Dict[str, Any]]
    key_topics: List[str]
    
class CompanyData(BaseModel):
    """Company information model"""
    symbol: str
    name: str
    sector: str
    industry: str
    market_cap: Optional[float]
    
class ESGResponse(BaseModel):
    """Response model for ESG analysis"""
    symbol: str
    company_name: str
    esg_scores: ESGScores
    financial_metrics: FinancialMetrics
    sentiment_data: SentimentData
    analysis_timestamp: datetime
    
class HistoricalData(BaseModel):
    """Historical ESG data model"""
    date: datetime
    esg_scores: ESGScores
    stock_price: float
    
class TrendingCompany(BaseModel):
    """Trending company model"""
    symbol: str
    name: str
    esg_change: float
    sentiment_change: float
    price_change: float
