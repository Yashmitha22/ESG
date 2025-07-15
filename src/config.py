"""
Development configuration and utilities
"""

import os
from pathlib import Path

# Project root directory
PROJECT_ROOT = Path(__file__).parent.parent

# Data directories
DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = PROJECT_ROOT / "models"
LOGS_DIR = PROJECT_ROOT / "logs"

# Create directories if they don't exist
for directory in [DATA_DIR, MODELS_DIR, LOGS_DIR]:
    directory.mkdir(exist_ok=True)

# API Configuration
API_CONFIG = {
    "NEWS_API_BASE_URL": "https://newsapi.org/v2",
    "ALPHA_VANTAGE_BASE_URL": "https://www.alphavantage.co/query",
    "REQUEST_TIMEOUT": 30,
    "MAX_RETRIES": 3
}

# ESG Scoring Configuration
ESG_CONFIG = {
    "SCORE_WEIGHTS": {
        "environmental": 0.35,
        "social": 0.35,
        "governance": 0.30
    },
    "RISK_THRESHOLDS": {
        "low": 80,
        "medium_low": 65,
        "medium": 50,
        "medium_high": 35
    }
}

# ML Model Configuration
ML_CONFIG = {
    "SENTIMENT_MODELS": {
        "financial": "ProsusAI/finbert",
        "general": "cardiffnlp/twitter-roberta-base-sentiment-latest",
        "esg": "nlptown/bert-base-multilingual-uncased-sentiment"
    },
    "MAX_SEQUENCE_LENGTH": 512,
    "BATCH_SIZE": 16
}
