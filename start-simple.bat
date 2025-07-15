@echo off
echo 🚀 Starting ESG Analysis Tool (Python 3.12 Compatible Version)
echo.
echo Installing/updating essential packages...
pip install --upgrade pip setuptools wheel
pip install -r requirements-simple.txt

echo.
echo Starting backend server...
start "ESG Backend" python main-simple.py

echo.
echo Starting frontend...
cd frontend
start "ESG Frontend" npm run dev

echo.
echo ✅ ESG Analysis Tool is starting!
echo 📊 Backend: http://localhost:8000
echo 🌐 Frontend: http://localhost:3000
echo 📚 API Docs: http://localhost:8000/docs
echo.
pause
