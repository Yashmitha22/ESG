"""
Real-Time ESG Equity Analysis Tool
Main FastAPI application for ESG data processing and analysis
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import asyncio
from typing import List, Dict, Any
import json

from src.data.financial_data import FinancialDataService
from src.data.news_data import NewsDataService
from src.ml.sentiment_analyzer import SentimentAnalyzer
from src.models.schemas import (
    ESGRequest, ESGResponse, CompanyData, 
    SentimentData, FinancialMetrics
)
from src.utils.esg_calculator import ESGCalculator
from src.database.db_manager import DatabaseManager

# Initialize FastAPI app
app = FastAPI(
    title="ESG Equity Analysis Tool",
    description="Real-time ESG analysis with sentiment and financial data",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
financial_service = FinancialDataService()
news_service = NewsDataService()
sentiment_analyzer = SentimentAnalyzer()
esg_calculator = ESGCalculator()
db_manager = DatabaseManager()

# WebSocket connections for real-time updates
active_connections: List[WebSocket] = []

@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    await db_manager.initialize()
    print("ESG Analysis Tool started successfully!")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)

async def broadcast_update(data: dict):
    """Broadcast updates to all connected clients"""
    for connection in active_connections:
        try:
            await connection.send_text(json.dumps(data))
        except:
            active_connections.remove(connection)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "ESG Equity Analysis Tool API", "status": "active"}

@app.post("/analyze", response_model=ESGResponse)
async def analyze_company(request: ESGRequest):
    """Analyze a company's ESG metrics"""
    try:
        # Get financial data
        financial_data = await financial_service.get_company_data(request.symbol)
        
        # Get news and sentiment data
        news_data = await news_service.get_company_news(
            request.symbol, 
            days_back=request.days_back or 30
        )
        
        # Analyze sentiment
        sentiment_results = await sentiment_analyzer.analyze_batch(news_data)
        
        # Calculate ESG scores
        esg_scores = esg_calculator.calculate_esg_score(
            financial_data, 
            sentiment_results, 
            request.symbol
        )
        
        # Store results
        await db_manager.store_analysis(request.symbol, esg_scores)
        
        # Broadcast real-time update
        await broadcast_update({
            "type": "analysis_complete",
            "symbol": request.symbol,
            "scores": esg_scores
        })
        
        return ESGResponse(
            symbol=request.symbol,
            company_name=financial_data.get("company_name", ""),
            esg_scores=esg_scores,
            financial_metrics=financial_data,
            sentiment_data=sentiment_results,
            analysis_timestamp=financial_data.get("timestamp")
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/companies/{symbol}/history")
async def get_company_history(symbol: str, days: int = 90):
    """Get historical ESG analysis for a company"""
    try:
        history = await db_manager.get_company_history(symbol, days)
        return {"symbol": symbol, "history": history}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/market/trending")
async def get_trending_esg():
    """Get trending ESG companies"""
    try:
        trending = await db_manager.get_trending_companies()
        return {"trending_companies": trending}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/market/sectors")
async def get_sector_analysis():
    """Get ESG analysis by sector"""
    try:
        sectors = await db_manager.get_sector_analysis()
        return {"sector_analysis": sectors}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Serve static files from frontend build
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
