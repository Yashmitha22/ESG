@echo off
echo 🚀 Starting ESG Equity Analysis Tool...

echo 📊 Starting backend server...
cd /d d:\ESG
start cmd /k "python main.py"

timeout /t 5

echo 🌐 Starting frontend development server...
cd frontend
start cmd /k "npm run dev"

echo ✅ ESG Analysis Tool is starting...
echo 📊 Backend API: http://localhost:8000
echo 🌐 Frontend: http://localhost:3000
echo 📖 API Docs: http://localhost:8000/docs

pause
