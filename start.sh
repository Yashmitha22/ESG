#!/bin/bash
# Development startup script

echo "🚀 Starting ESG Equity Analysis Tool..."

# Start backend server
echo "📊 Starting backend server..."
cd d:\ESG
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend development server
echo "🌐 Starting frontend development server..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ ESG Analysis Tool is starting..."
echo "📊 Backend API: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo "📖 API Docs: http://localhost:8000/docs"

# Keep script running
wait
