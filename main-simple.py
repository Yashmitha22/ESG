"""
ESG Analysis Tool - Simplified Main Application
Compatible with Python 3.12
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import uvicorn
import yfinance as yf
import pandas as pd
import json
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="ESG Analysis Tool",
    description="Real-time ESG equity analysis with sentiment analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class CompanyRequest(BaseModel):
    symbol: str

class ESGAnalysisResponse(BaseModel):
    symbol: str
    company_name: str
    esg_score: float
    environmental_score: float
    social_score: float
    governance_score: float
    market_data: dict
    timestamp: str

@app.get("/")
async def root():
    return {"message": "ESG Analysis Tool API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/analyze", response_model=ESGAnalysisResponse)
async def analyze_company(request: CompanyRequest):
    """
    Analyze a company's ESG metrics
    """
    try:
        # Get basic company data from yfinance
        ticker = yf.Ticker(request.symbol)
        info = ticker.info
        
        if not info or 'longName' not in info:
            raise HTTPException(status_code=404, detail=f"Company not found: {request.symbol}")
        
        # Get recent price data
        hist = ticker.history(period="5d")
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No market data found for: {request.symbol}")
        
        # Calculate simple ESG scores (placeholder algorithm)
        # In a real implementation, these would come from actual ESG data sources
        market_cap = info.get('marketCap', 0)
        revenue = info.get('totalRevenue', 0)
        employees = info.get('fullTimeEmployees', 0)
        
        # Simple scoring algorithm based on available data
        environmental_score = min(85, max(15, 50 + (employees / 10000 if employees else 0)))
        social_score = min(90, max(20, 45 + (employees / 5000 if employees else 0)))
        governance_score = min(95, max(25, 60 + (market_cap / 1000000000 if market_cap else 0)))
        
        # Overall ESG score (weighted average)
        esg_score = (environmental_score * 0.35 + social_score * 0.35 + governance_score * 0.30)
        
        # Market data
        current_price = hist['Close'].iloc[-1]
        price_change = ((current_price - hist['Close'].iloc[0]) / hist['Close'].iloc[0]) * 100
        
        market_data = {
            "current_price": float(current_price),
            "price_change_5d": float(price_change),
            "volume": int(hist['Volume'].iloc[-1]),
            "market_cap": market_cap,
            "currency": info.get('currency', 'USD')
        }
        
        return ESGAnalysisResponse(
            symbol=request.symbol.upper(),
            company_name=info['longName'],
            esg_score=round(esg_score, 2),
            environmental_score=round(environmental_score, 2),
            social_score=round(social_score, 2),
            governance_score=round(governance_score, 2),
            market_data=market_data,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/companies/search/{query}")
async def search_companies(query: str):
    """
    Search for companies (simplified implementation)
    """
    # Common companies for demo purposes
    companies = [
        {"symbol": "AAPL", "name": "Apple Inc."},
        {"symbol": "MSFT", "name": "Microsoft Corporation"},
        {"symbol": "GOOGL", "name": "Alphabet Inc."},
        {"symbol": "TSLA", "name": "Tesla, Inc."},
        {"symbol": "AMZN", "name": "Amazon.com, Inc."},
        {"symbol": "META", "name": "Meta Platforms, Inc."},
        {"symbol": "NVDA", "name": "NVIDIA Corporation"},
        {"symbol": "JPM", "name": "JPMorgan Chase & Co."},
        {"symbol": "JNJ", "name": "Johnson & Johnson"},
        {"symbol": "V", "name": "Visa Inc."},
    ]
    
    # Filter companies based on query
    filtered = [
        comp for comp in companies 
        if query.lower() in comp["name"].lower() or query.lower() in comp["symbol"].lower()
    ]
    
    return {"companies": filtered[:10]}  # Return max 10 results

@app.get("/api/market/indices")
async def get_market_indices():
    """
    Get major market indices
    """
    try:
        indices = ["^GSPC", "^DJI", "^IXIC"]  # S&P 500, Dow Jones, NASDAQ
        market_data = {}
        
        for index in indices:
            ticker = yf.Ticker(index)
            hist = ticker.history(period="2d")
            if not hist.empty:
                current = float(hist['Close'].iloc[-1])
                previous = float(hist['Close'].iloc[0])
                change = ((current - previous) / previous) * 100
                
                market_data[index] = {
                    "value": current,
                    "change": round(change, 2)
                }
        
        return {"indices": market_data, "timestamp": datetime.now().isoformat()}
        
    except Exception as e:
        return {"error": str(e), "indices": {}}

if __name__ == "__main__":
    print("🚀 Starting ESG Analysis Tool...")
    print("📊 Backend API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🌐 Make sure to start the frontend at: http://localhost:3000")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
