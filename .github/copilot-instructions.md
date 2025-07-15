<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ESG Equity Analysis Tool - Copilot Instructions

## Project Overview
This is a Real-Time ESG (Environmental, Social, Governance) Equity Analysis Tool that combines financial data analysis with sentiment analysis for sustainable investing. The application uses FastAPI for the backend and React for the frontend.

## Technology Stack
- **Backend**: FastAPI, Python, SQLite, HuggingFace Transformers, yfinance
- **Frontend**: React, Vite, TailwindCSS, Plotly.js, Framer Motion
- **ML/NLP**: HuggingFace Transformers (FinBERT, BERT), TextBlob
- **APIs**: News API, Alpha Vantage, Yahoo Finance

## Code Style Guidelines

### Python (Backend)
- Use FastAPI best practices with proper async/await
- Follow PEP 8 style guidelines
- Use type hints for all function parameters and return values
- Implement proper error handling with HTTPException
- Use Pydantic models for request/response validation
- Document all functions with docstrings

### JavaScript/React (Frontend)
- Use functional components with React hooks
- Follow React best practices and patterns
- Use modern ES6+ syntax
- Implement proper prop types validation
- Use TailwindCSS for styling (utility-first approach)
- Follow component composition patterns

## Key Features to Remember
1. **ESG Scoring**: Environmental, Social, Governance metrics calculation
2. **Sentiment Analysis**: Real-time news sentiment using NLP models
3. **Financial Analysis**: Integration with financial APIs for market data
4. **Real-time Updates**: WebSocket connections for live data
5. **Portfolio Management**: Track and analyze ESG portfolios
6. **Interactive Visualizations**: Plotly charts and dashboards

## API Integration
- **News API**: For fetching company-related news articles
- **Alpha Vantage**: For financial and market data
- **Yahoo Finance**: For stock prices and company information

## Database Schema
- **companies**: Company information and metadata
- **esg_analyses**: Historical ESG analysis results
- **news_sentiment**: Sentiment analysis results from news
- **market_indices**: Market indices data

## Component Structure
- **Pages**: Dashboard, Analysis, Portfolio, Market, Settings
- **Components**: ESGScoreCard, SentimentChart, FinancialMetrics, etc.
- **Context**: ESGContext for global state management
- **Utils**: Helper functions for calculations and formatting

## Security Considerations
- API keys should be stored in environment variables
- Implement proper input validation and sanitization
- Use CORS appropriately for frontend-backend communication
- Implement rate limiting for API calls

## Performance Optimizations
- Use React.memo for expensive components
- Implement proper loading states and error handling
- Cache API responses where appropriate
- Use efficient data structures for large datasets

When generating code, please:
1. Follow the established patterns in the codebase
2. Implement proper error handling
3. Add loading states for async operations
4. Use consistent naming conventions
5. Include proper TypeScript/PropTypes where applicable
6. Consider accessibility in UI components
7. Implement responsive design for mobile compatibility
