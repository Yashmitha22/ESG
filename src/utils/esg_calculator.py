"""
ESG Score Calculator
Combines financial metrics, sentiment analysis, and industry benchmarks
"""

import numpy as np
from typing import Dict, Any
from datetime import datetime

class ESGCalculator:
    """Calculate comprehensive ESG scores"""
    
    def __init__(self):
        self.industry_benchmarks = self._load_industry_benchmarks()
        self.esg_weights = {
            'environmental': 0.35,
            'social': 0.35,
            'governance': 0.30
        }
    
    def _load_industry_benchmarks(self) -> Dict[str, Dict[str, float]]:
        """Load industry-specific ESG benchmarks"""
        return {
            'Technology': {
                'environmental_baseline': 70,
                'social_baseline': 75,
                'governance_baseline': 80,
                'carbon_intensity_factor': 0.8,
                'innovation_bonus': 10
            },
            'Energy': {
                'environmental_baseline': 45,
                'social_baseline': 60,
                'governance_baseline': 65,
                'carbon_intensity_factor': 1.5,
                'transition_bonus': 15
            },
            'Healthcare': {
                'environmental_baseline': 65,
                'social_baseline': 85,
                'governance_baseline': 75,
                'carbon_intensity_factor': 0.9,
                'access_bonus': 12
            },
            'Financials': {
                'environmental_baseline': 60,
                'social_baseline': 70,
                'governance_baseline': 85,
                'carbon_intensity_factor': 0.7,
                'governance_bonus': 8
            },
            'Default': {
                'environmental_baseline': 60,
                'social_baseline': 65,
                'governance_baseline': 70,
                'carbon_intensity_factor': 1.0,
                'sector_bonus': 0
            }
        }
    
    def calculate_esg_score(self, financial_data: Dict[str, Any], 
                           sentiment_data: Dict[str, Any], 
                           symbol: str) -> Dict[str, Any]:
        """Calculate comprehensive ESG scores"""
        
        industry = financial_data.get('industry', 'Default')
        sector = financial_data.get('sector', 'Other')
        
        # Get industry benchmarks
        benchmarks = self.industry_benchmarks.get(sector, self.industry_benchmarks['Default'])
        
        # Calculate individual ESG components
        environmental_score = self._calculate_environmental_score(
            financial_data, sentiment_data, benchmarks
        )
        
        social_score = self._calculate_social_score(
            financial_data, sentiment_data, benchmarks
        )
        
        governance_score = self._calculate_governance_score(
            financial_data, sentiment_data, benchmarks
        )
        
        # Calculate overall ESG score
        overall_score = (
            environmental_score * self.esg_weights['environmental'] +
            social_score * self.esg_weights['social'] +
            governance_score * self.esg_weights['governance']
        )
        
        # Determine risk rating
        risk_rating = self._determine_risk_rating(overall_score)
        
        return {
            'environmental': round(environmental_score, 2),
            'social': round(social_score, 2),
            'governance': round(governance_score, 2),
            'overall': round(overall_score, 2),
            'risk_rating': risk_rating,
            'industry_benchmark': benchmarks,
            'calculation_timestamp': datetime.now().isoformat()
        }
    
    def _calculate_environmental_score(self, financial_data: Dict, 
                                     sentiment_data: Dict, 
                                     benchmarks: Dict) -> float:
        """Calculate environmental score"""
        base_score = benchmarks['environmental_baseline']
        
        # Sentiment impact (30% weight)
        sentiment_impact = self._get_sentiment_impact(sentiment_data, 'Environmental') * 30
        
        # Financial metrics impact (40% weight)
        financial_impact = 0
        
        # Revenue growth (positive growth can indicate efficiency)
        revenue_growth = financial_data.get('revenue_growth', 0)
        if revenue_growth:
            if revenue_growth > 10:
                financial_impact += 5
            elif revenue_growth < -5:
                financial_impact -= 5
        
        # Market cap impact (larger companies often have better ESG resources)
        market_cap = financial_data.get('market_cap', 0)
        if market_cap:
            if market_cap > 100_000_000_000:  # $100B+
                financial_impact += 8
            elif market_cap > 10_000_000_000:  # $10B+
                financial_impact += 5
            elif market_cap < 1_000_000_000:  # <$1B
                financial_impact -= 3
        
        # Industry-specific adjustments (30% weight)
        industry_impact = 0
        carbon_factor = benchmarks.get('carbon_intensity_factor', 1.0)
        
        # Apply carbon intensity penalty/bonus
        if carbon_factor > 1.2:
            industry_impact -= 10  # High carbon industries penalty
        elif carbon_factor < 0.8:
            industry_impact += 8   # Low carbon industries bonus
        
        # News sentiment topic bonus
        key_topics = sentiment_data.get('key_topics', [])
        if 'Environmental' in key_topics:
            industry_impact += 5
        
        total_score = base_score + sentiment_impact + financial_impact + industry_impact
        
        return max(0, min(100, total_score))
    
    def _calculate_social_score(self, financial_data: Dict, 
                              sentiment_data: Dict, 
                              benchmarks: Dict) -> float:
        """Calculate social score"""
        base_score = benchmarks['social_baseline']
        
        # Sentiment impact (35% weight)
        sentiment_impact = self._get_sentiment_impact(sentiment_data, 'Social') * 35
        
        # Financial stability impact (30% weight)
        financial_impact = 0
        
        # Debt to equity ratio impact
        debt_to_equity = financial_data.get('debt_to_equity', 0)
        if debt_to_equity:
            if debt_to_equity < 0.3:
                financial_impact += 8  # Low debt is good for employee security
            elif debt_to_equity > 1.0:
                financial_impact -= 5  # High debt may impact employees
        
        # ROE impact (profitable companies can invest more in social programs)
        roe = financial_data.get('roe', 0)
        if roe:
            if roe > 0.15:
                financial_impact += 6
            elif roe < 0:
                financial_impact -= 8
        
        # Industry and size impact (35% weight)
        industry_impact = 0
        
        # Large companies often have better social programs
        market_cap = financial_data.get('market_cap', 0)
        if market_cap and market_cap > 50_000_000_000:
            industry_impact += 6
        
        # Topic-based bonus
        key_topics = sentiment_data.get('key_topics', [])
        if 'Social' in key_topics:
            industry_impact += 7
        
        # Sector-specific bonuses
        sector = financial_data.get('sector', '')
        if sector == 'Healthcare':
            industry_impact += benchmarks.get('access_bonus', 0)
        
        total_score = base_score + sentiment_impact + financial_impact + industry_impact
        
        return max(0, min(100, total_score))
    
    def _calculate_governance_score(self, financial_data: Dict, 
                                  sentiment_data: Dict, 
                                  benchmarks: Dict) -> float:
        """Calculate governance score"""
        base_score = benchmarks['governance_baseline']
        
        # Sentiment impact (25% weight)
        sentiment_impact = self._get_sentiment_impact(sentiment_data, 'Governance') * 25
        
        # Financial performance impact (45% weight)
        financial_impact = 0
        
        # ROE (good governance should lead to better returns)
        roe = financial_data.get('roe', 0)
        if roe:
            if roe > 0.20:
                financial_impact += 10
            elif roe > 0.10:
                financial_impact += 5
            elif roe < 0:
                financial_impact -= 10
        
        # PE ratio (reasonable valuations suggest good governance)
        pe_ratio = financial_data.get('pe_ratio', 0)
        if pe_ratio:
            if 10 <= pe_ratio <= 25:
                financial_impact += 5
            elif pe_ratio > 50:
                financial_impact -= 5
        
        # Debt management
        debt_to_equity = financial_data.get('debt_to_equity', 0)
        if debt_to_equity:
            if debt_to_equity < 0.5:
                financial_impact += 8
            elif debt_to_equity > 1.5:
                financial_impact -= 8
        
        # Industry and topic impact (30% weight)
        industry_impact = 0
        
        # Financial sector gets governance bonus
        sector = financial_data.get('sector', '')
        if sector == 'Financials':
            industry_impact += benchmarks.get('governance_bonus', 0)
        
        # Topic-based bonus
        key_topics = sentiment_data.get('key_topics', [])
        if 'Governance' in key_topics:
            industry_impact += 8
        
        # Overall sentiment bonus (good news often reflects good governance)
        overall_sentiment = sentiment_data.get('overall_sentiment', 0)
        if overall_sentiment > 0.3:
            industry_impact += 5
        elif overall_sentiment < -0.3:
            industry_impact -= 5
        
        total_score = base_score + sentiment_impact + financial_impact + industry_impact
        
        return max(0, min(100, total_score))
    
    def _get_sentiment_impact(self, sentiment_data: Dict, topic: str) -> float:
        """Calculate sentiment impact for a specific ESG topic"""
        overall_sentiment = sentiment_data.get('overall_sentiment', 0)
        key_topics = sentiment_data.get('key_topics', [])
        
        # Base sentiment impact
        sentiment_impact = overall_sentiment * 20  # Scale to -20 to +20
        
        # Topic-specific bonus
        if topic in key_topics:
            # Position in key topics list indicates importance
            topic_position = key_topics.index(topic)
            topic_bonus = max(0, 10 - (topic_position * 2))
            sentiment_impact += topic_bonus
        
        return sentiment_impact
    
    def _determine_risk_rating(self, overall_score: float) -> str:
        """Determine ESG risk rating based on overall score"""
        if overall_score >= 80:
            return "Low Risk"
        elif overall_score >= 65:
            return "Medium-Low Risk"
        elif overall_score >= 50:
            return "Medium Risk"
        elif overall_score >= 35:
            return "Medium-High Risk"
        else:
            return "High Risk"
    
    def compare_to_industry(self, esg_scores: Dict, sector: str) -> Dict[str, Any]:
        """Compare ESG scores to industry benchmarks"""
        benchmarks = self.industry_benchmarks.get(sector, self.industry_benchmarks['Default'])
        
        comparison = {
            'environmental': {
                'score': esg_scores['environmental'],
                'benchmark': benchmarks['environmental_baseline'],
                'difference': esg_scores['environmental'] - benchmarks['environmental_baseline']
            },
            'social': {
                'score': esg_scores['social'],
                'benchmark': benchmarks['social_baseline'],
                'difference': esg_scores['social'] - benchmarks['social_baseline']
            },
            'governance': {
                'score': esg_scores['governance'],
                'benchmark': benchmarks['governance_baseline'],
                'difference': esg_scores['governance'] - benchmarks['governance_baseline']
            }
        }
        
        # Calculate percentile ranking (simplified)
        overall_benchmark = (
            benchmarks['environmental_baseline'] * self.esg_weights['environmental'] +
            benchmarks['social_baseline'] * self.esg_weights['social'] +
            benchmarks['governance_baseline'] * self.esg_weights['governance']
        )
        
        percentile = min(99, max(1, 50 + (esg_scores['overall'] - overall_benchmark)))
        
        comparison['overall'] = {
            'score': esg_scores['overall'],
            'benchmark': overall_benchmark,
            'percentile': round(percentile, 1)
        }
        
        return comparison
