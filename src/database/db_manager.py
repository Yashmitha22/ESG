"""
Database manager for storing and retrieving ESG analysis data
"""

import sqlite3
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import pandas as pd

class DatabaseManager:
    """Manage ESG analysis data storage and retrieval"""
    
    def __init__(self, db_path: str = "esg_analysis.db"):
        self.db_path = db_path
        
    async def initialize(self):
        """Initialize database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT UNIQUE NOT NULL,
            name TEXT,
            sector TEXT,
            industry TEXT,
            market_cap REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS esg_analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            environmental_score REAL,
            social_score REAL,
            governance_score REAL,
            overall_score REAL,
            risk_rating TEXT,
            sentiment_data TEXT,
            financial_data TEXT,
            analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (symbol) REFERENCES companies (symbol)
        )
        ''')
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS market_indices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            index_symbol TEXT NOT NULL,
            index_name TEXT,
            price REAL,
            change_amount REAL,
            change_percent REAL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS news_sentiment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            article_title TEXT,
            article_url TEXT,
            source TEXT,
            sentiment_score REAL,
            sentiment_label TEXT,
            published_at TIMESTAMP,
            analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create indices for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_symbol_date ON esg_analyses (symbol, analysis_date)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_sentiment_symbol ON news_sentiment (symbol, analyzed_at)')
        
        conn.commit()
        conn.close()
        
        print("Database initialized successfully!")
    
    async def store_analysis(self, symbol: str, esg_scores: Dict[str, Any], 
                           financial_data: Dict = None, sentiment_data: Dict = None):
        """Store ESG analysis results"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Insert or update company information
            if financial_data:
                cursor.execute('''
                INSERT OR REPLACE INTO companies (symbol, name, sector, industry, market_cap, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    symbol,
                    financial_data.get('company_name', ''),
                    financial_data.get('sector', ''),
                    financial_data.get('industry', ''),
                    financial_data.get('market_cap'),
                    datetime.now()
                ))
            
            # Store ESG analysis
            cursor.execute('''
            INSERT INTO esg_analyses 
            (symbol, environmental_score, social_score, governance_score, overall_score, 
             risk_rating, sentiment_data, financial_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                symbol,
                esg_scores.get('environmental'),
                esg_scores.get('social'),
                esg_scores.get('governance'),
                esg_scores.get('overall'),
                esg_scores.get('risk_rating'),
                json.dumps(sentiment_data) if sentiment_data else None,
                json.dumps(financial_data) if financial_data else None
            ))
            
            conn.commit()
            
        except Exception as e:
            print(f"Error storing analysis: {e}")
            conn.rollback()
        finally:
            conn.close()
    
    async def get_company_history(self, symbol: str, days: int = 90) -> List[Dict[str, Any]]:
        """Get historical ESG analysis for a company"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            
            cursor.execute('''
            SELECT environmental_score, social_score, governance_score, overall_score,
                   risk_rating, analysis_date
            FROM esg_analyses
            WHERE symbol = ? AND analysis_date >= ?
            ORDER BY analysis_date DESC
            ''', (symbol, cutoff_date))
            
            results = cursor.fetchall()
            
            history = []
            for row in results:
                history.append({
                    'environmental_score': row[0],
                    'social_score': row[1],
                    'governance_score': row[2],
                    'overall_score': row[3],
                    'risk_rating': row[4],
                    'analysis_date': row[5]
                })
            
            return history
            
        except Exception as e:
            print(f"Error fetching company history: {e}")
            return []
        finally:
            conn.close()
    
    async def get_trending_companies(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get trending companies based on recent ESG score changes"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Get companies with multiple analyses in the last 30 days
            cursor.execute('''
            WITH recent_analyses AS (
                SELECT symbol, overall_score, analysis_date,
                       ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY analysis_date DESC) as rn
                FROM esg_analyses
                WHERE analysis_date >= date('now', '-30 days')
            ),
            score_changes AS (
                SELECT 
                    r1.symbol,
                    r1.overall_score as latest_score,
                    r2.overall_score as previous_score,
                    (r1.overall_score - r2.overall_score) as score_change
                FROM recent_analyses r1
                LEFT JOIN recent_analyses r2 ON r1.symbol = r2.symbol AND r2.rn = 2
                WHERE r1.rn = 1 AND r2.overall_score IS NOT NULL
            )
            SELECT 
                sc.symbol,
                c.name,
                sc.latest_score,
                sc.score_change,
                c.sector
            FROM score_changes sc
            JOIN companies c ON sc.symbol = c.symbol
            ORDER BY ABS(sc.score_change) DESC
            LIMIT ?
            ''', (limit,))
            
            results = cursor.fetchall()
            
            trending = []
            for row in results:
                trending.append({
                    'symbol': row[0],
                    'name': row[1],
                    'latest_score': row[2],
                    'score_change': row[3],
                    'sector': row[4]
                })
            
            return trending
            
        except Exception as e:
            print(f"Error fetching trending companies: {e}")
            return []
        finally:
            conn.close()
    
    async def get_sector_analysis(self) -> List[Dict[str, Any]]:
        """Get ESG analysis aggregated by sector"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
            WITH latest_analyses AS (
                SELECT 
                    e.symbol,
                    e.environmental_score,
                    e.social_score,
                    e.governance_score,
                    e.overall_score,
                    c.sector,
                    ROW_NUMBER() OVER (PARTITION BY e.symbol ORDER BY e.analysis_date DESC) as rn
                FROM esg_analyses e
                JOIN companies c ON e.symbol = c.symbol
                WHERE e.analysis_date >= date('now', '-30 days')
            )
            SELECT 
                sector,
                COUNT(*) as company_count,
                AVG(environmental_score) as avg_environmental,
                AVG(social_score) as avg_social,
                AVG(governance_score) as avg_governance,
                AVG(overall_score) as avg_overall
            FROM latest_analyses
            WHERE rn = 1 AND sector IS NOT NULL
            GROUP BY sector
            ORDER BY avg_overall DESC
            ''')
            
            results = cursor.fetchall()
            
            sectors = []
            for row in results:
                sectors.append({
                    'sector': row[0],
                    'company_count': row[1],
                    'avg_environmental': round(row[2], 2) if row[2] else 0,
                    'avg_social': round(row[3], 2) if row[3] else 0,
                    'avg_governance': round(row[4], 2) if row[4] else 0,
                    'avg_overall': round(row[5], 2) if row[5] else 0
                })
            
            return sectors
            
        except Exception as e:
            print(f"Error fetching sector analysis: {e}")
            return []
        finally:
            conn.close()
    
    async def store_market_indices(self, indices_data: Dict[str, Any]):
        """Store market indices data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            for index_name, data in indices_data.items():
                cursor.execute('''
                INSERT INTO market_indices 
                (index_symbol, index_name, price, change_amount, change_percent)
                VALUES (?, ?, ?, ?, ?)
                ''', (
                    data.get('symbol', ''),
                    index_name,
                    data.get('price'),
                    data.get('change'),
                    data.get('change_percent')
                ))
            
            conn.commit()
            
        except Exception as e:
            print(f"Error storing market indices: {e}")
            conn.rollback()
        finally:
            conn.close()
    
    async def get_portfolio_analysis(self, symbols: List[str]) -> Dict[str, Any]:
        """Get aggregated ESG analysis for a portfolio of companies"""
        if not symbols:
            return {}
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            placeholders = ','.join(['?' for _ in symbols])
            cursor.execute(f'''
            WITH latest_analyses AS (
                SELECT 
                    e.symbol,
                    e.environmental_score,
                    e.social_score,
                    e.governance_score,
                    e.overall_score,
                    e.risk_rating,
                    c.name,
                    c.sector,
                    ROW_NUMBER() OVER (PARTITION BY e.symbol ORDER BY e.analysis_date DESC) as rn
                FROM esg_analyses e
                JOIN companies c ON e.symbol = c.symbol
                WHERE e.symbol IN ({placeholders})
            )
            SELECT 
                symbol, name, sector, environmental_score, social_score, 
                governance_score, overall_score, risk_rating
            FROM latest_analyses
            WHERE rn = 1
            ''', symbols)
            
            results = cursor.fetchall()
            
            if not results:
                return {}
            
            companies = []
            total_env = total_soc = total_gov = total_overall = 0
            
            for row in results:
                company_data = {
                    'symbol': row[0],
                    'name': row[1],
                    'sector': row[2],
                    'environmental_score': row[3],
                    'social_score': row[4],
                    'governance_score': row[5],
                    'overall_score': row[6],
                    'risk_rating': row[7]
                }
                companies.append(company_data)
                
                total_env += row[3] or 0
                total_soc += row[4] or 0
                total_gov += row[5] or 0
                total_overall += row[6] or 0
            
            count = len(companies)
            
            return {
                'companies': companies,
                'portfolio_summary': {
                    'avg_environmental': round(total_env / count, 2),
                    'avg_social': round(total_soc / count, 2),
                    'avg_governance': round(total_gov / count, 2),
                    'avg_overall': round(total_overall / count, 2),
                    'company_count': count
                }
            }
            
        except Exception as e:
            print(f"Error fetching portfolio analysis: {e}")
            return {}
        finally:
            conn.close()
