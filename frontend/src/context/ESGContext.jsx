import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ESGContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Initial state
const initialState = {
  companies: [],
  currentAnalysis: null,
  loading: false,
  error: null,
  marketData: null,
  portfolio: [],
  notifications: [],
  socket: null,
};

// Reducer
function esgReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload, loading: false };
    case 'ADD_COMPANY':
      return { 
        ...state, 
        companies: [...state.companies, action.payload],
        loading: false 
      };
    case 'UPDATE_MARKET_DATA':
      return { ...state, marketData: action.payload };
    case 'ADD_TO_PORTFOLIO':
      return {
        ...state,
        portfolio: [...state.portfolio, action.payload]
      };
    case 'REMOVE_FROM_PORTFOLIO':
      return {
        ...state,
        portfolio: state.portfolio.filter(item => item.symbol !== action.payload)
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 9)]
      };
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    default:
      return state;
  }
}

// Provider component
export function ESGProvider({ children }) {
  const [state, dispatch] = useReducer(esgReducer, initialState);

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = io(API_BASE_URL);
    dispatch({ type: 'SET_SOCKET', payload: socket });

    socket.on('connect', () => {
      console.log('Connected to ESG Analysis server');
    });

    socket.on('analysis_complete', (data) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          message: `Analysis complete for ${data.symbol}`,
          timestamp: new Date(),
          data: data
        }
      });
    });

    socket.on('market_update', (data) => {
      dispatch({ type: 'UPDATE_MARKET_DATA', payload: data });
    });

    return () => socket.close();
  }, []);

  // API functions
  const analyzeCompany = async (symbol, daysBack = 30) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        symbol,
        days_back: daysBack,
        include_competitors: false
      });
      
      dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: response.data });
      dispatch({ type: 'ADD_COMPANY', payload: response.data });
      
      return response.data;
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.detail || 'Failed to analyze company' 
      });
      throw error;
    }
  };

  const getCompanyHistory = async (symbol, days = 90) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies/${symbol}/history?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch company history:', error);
      return null;
    }
  };

  const getTrendingCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/market/trending`);
      return response.data.trending_companies;
    } catch (error) {
      console.error('Failed to fetch trending companies:', error);
      return [];
    }
  };

  const getSectorAnalysis = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/market/sectors`);
      return response.data.sector_analysis;
    } catch (error) {
      console.error('Failed to fetch sector analysis:', error);
      return [];
    }
  };

  const addToPortfolio = (company) => {
    dispatch({ type: 'ADD_TO_PORTFOLIO', payload: company });
  };

  const removeFromPortfolio = (symbol) => {
    dispatch({ type: 'REMOVE_FROM_PORTFOLIO', payload: symbol });
  };

  const value = {
    ...state,
    analyzeCompany,
    getCompanyHistory,
    getTrendingCompanies,
    getSectorAnalysis,
    addToPortfolio,
    removeFromPortfolio,
  };

  return (
    <ESGContext.Provider value={value}>
      {children}
    </ESGContext.Provider>
  );
}

// Hook to use the context
export function useESG() {
  const context = useContext(ESGContext);
  if (context === undefined) {
    throw new Error('useESG must be used within an ESGProvider');
  }
  return context;
}
