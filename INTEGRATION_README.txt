
Integrated Civic Issues Project
=================================

This archive was produced automatically by the integrator. It contains:

- backend/: Flask backend that exposes:
    - GET /api/issue  -> returns latest output.json if present
    - POST /api/analyze -> accepts file under 'file' and returns analyze result
- analyze_image.py has been copied into backend/ and adjusted for local integration.
- src/components/IssueList.jsx -> React component that fetches /api/issue and displays it.

How to run (development):
1. Backend:
   cd backend
   python -m venv venv
   # Activate venv (Linux/Mac): source venv/bin/activate
   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py

2. Frontend:
   Run your frontend dev server as you normally do (e.g. npm install && npm run dev).
   Ensure the frontend runs on a different port than 5000 and that CORS is allowed (the backend enables CORS by default).

Notes:
- If your analyze_image.py used external APIs (Gemini), set environment variables as needed.
- If you want to test without running the backend, copy backend/output.json into your frontend's public/ directory and fetch it at /output.json.
