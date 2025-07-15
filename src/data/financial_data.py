"""
Financial data service for fetching stock and company information
"""

import yfinance as yf
import pandas as pd
from typing import Dict, Any, Optional
import asyncio
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv

load_dotenv()

class FinancialDataService:
    """Service for fetching financial data from various sources"""
    
    def __init__(self):
        self.alpha_vantage_key = os.getenv('ALPHA_VANTAGE_API_KEY')
        
    async def get_company_data(self, symbol: str) -> Dict[str, Any]:
        """Get comprehensive company financial data"""
        try:
            # Use yfinance for basic data
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Get historical data
            hist = ticker.history(period="1y")
            
            # Calculate metrics
            current_price = hist['Close'].iloc[-1] if not hist.empty else None
            
            # Calculate revenue growth (simplified)
            revenue_growth = self._calculate_revenue_growth(ticker)
            
            # ESG data from yfinance (if available)
            esg_data = self._get_esg_data(ticker)
            
            return {
                "symbol": symbol,
                "company_name": info.get('longName', symbol),
                "sector": info.get('sector', 'Unknown'),
                "industry": info.get('industry', 'Unknown'),
                "market_cap": info.get('marketCap'),
                "current_price": current_price,
                "pe_ratio": info.get('trailingPE'),
                "debt_to_equity": info.get('debtToEquity'),
                "roe": info.get('returnOnEquity'),
                "revenue_growth": revenue_growth,
                "esg_scores": esg_data,
                "historical_prices": hist.to_dict('records'),
                "timestamp": datetime.now()
            }
            
        except Exception as e:
            print(f"Error fetching financial data for {symbol}: {e}")
            return {
                "symbol": symbol,
                "error": str(e),
                "timestamp": datetime.now()
            }
    
    def _calculate_revenue_growth(self, ticker) -> Optional[float]:
        """Calculate revenue growth rate"""
        try:
            financials = ticker.financials
            if financials.empty:
                return None
                
            revenues = financials.loc['Total Revenue']
            if len(revenues) >= 2:
                latest = revenues.iloc[0]
                previous = revenues.iloc[1]
                growth = ((latest - previous) / previous) * 100
                return round(growth, 2)
        except:
            pass
        return None
    
    def _get_esg_data(self, ticker) -> Dict[str, Any]:
        """Get ESG data if available"""
        try:
            # Try to get ESG data from yfinance
            sustainability = ticker.sustainability
            if sustainability is not None and not sustainability.empty:
                return {
                    "esg_score": sustainability.get('totalEsg', {}).iloc[0] if 'totalEsg' in sustainability.columns else None,
                    "environment_score": sustainability.get('environmentScore', {}).iloc[0] if 'environmentScore' in sustainability.columns else None,
                    "social_score": sustainability.get('socialScore', {}).iloc[0] if 'socialScore' in sustainability.columns else None,
                    "governance_score": sustainability.get('governanceScore', {}).iloc[0] if 'governanceScore' in sustainability.columns else None,
                }
        except:
            pass
        
        return {
            "esg_score": None,
            "environment_score": None,
            "social_score": None,
            "governance_score": None
        }
    
    async def get_sector_companies(self, sector: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get companies in a specific sector"""
        # This would typically use a financial data API
        # For now, return some sample data
        sample_companies = {
            "Technology": ["AAPL", "MSFT", "GOOGL", "META", "NVDA"],
            "Energy": ["XOM", "CVX", "COP", "SLB", "EOG"],
            "Healthcare": ["JNJ", "PFE", "UNH", "MRK", "ABT"],
            "Financials": ["JPM", "BAC", "WFC", "GS", "MS"]
        }
        
        symbols = sample_companies.get(sector, ["AAPL", "MSFT", "GOOGL"])[:limit]
        companies = []
        
        for symbol in symbols:
            data = await self.get_company_data(symbol)
            companies.append(data)
            
        return companies
    
    async def get_market_indices(self) -> Dict[str, Any]:
        """Get major market indices data"""
        indices = {
            "^GSPC": "S&P 500",
            "^DJI": "Dow Jones",
            "^IXIC": "NASDAQ",
            "^RUT": "Russell 2000"
        }
        
        results = {}
        for symbol, name in indices.items():
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1d")
                if not hist.empty:
                    results[name] = {
                        "symbol": symbol,
                        "price": hist['Close'].iloc[-1],
                        "change": hist['Close'].iloc[-1] - hist['Open'].iloc[-1],
                        "change_percent": ((hist['Close'].iloc[-1] - hist['Open'].iloc[-1]) / hist['Open'].iloc[-1]) * 100
                    }
            except Exception as e:
                print(f"Error fetching index data for {symbol}: {e}")
                
        return results
