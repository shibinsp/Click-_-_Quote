@echo off
echo Starting UK Power Networks Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python app.py
pause
