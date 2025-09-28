# UK Power Networks Application System - Setup Guide

## Quick Start

### Windows Users

1. **Start the Backend:**
   - Double-click `start_backend.bat`
   - Wait for the backend to start (you'll see "Running on http://127.0.0.1:5000")

2. **Start the Frontend:**
   - Double-click `start_frontend.bat`
   - Wait for the frontend to start (you'll see "Local: http://localhost:3000")

3. **Access the Application:**
   - Open your browser and go to `http://localhost:3000`

### macOS/Linux Users

1. **Start the Backend:**
   ```bash
   ./start_backend.sh
   ```

2. **Start the Frontend:**
   ```bash
   ./start_frontend.sh
   ```

3. **Access the Application:**
   - Open your browser and go to `http://localhost:3000`

## Manual Setup

### Prerequisites

- **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Python** (v3.8 or higher) - Download from [python.org](https://python.org/)

### Backend Setup

1. Open Command Prompt/Terminal and navigate to the project directory
2. Go to the backend folder:
   ```bash
   cd backend
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

5. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

6. Start the Flask server:
   ```bash
   python app.py
   ```

   You should see:
   ```
   * Running on http://127.0.0.1:5000
   * Debug mode: on
   ```

### Frontend Setup

1. Open a new Command Prompt/Terminal window
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

   You should see:
   ```
   Local:            http://localhost:3000
   On Your Network:  http://192.168.x.x:3000
   ```

## Troubleshooting

### Common Issues

1. **Port Already in Use:**
   - Backend (port 5000): Change the port in `backend/app.py`
   - Frontend (port 3000): The terminal will ask if you want to use a different port

2. **Python Not Found:**
   - Make sure Python is installed and added to your PATH
   - Try using `python3` instead of `python`

3. **Node.js Not Found:**
   - Make sure Node.js is installed
   - Try using `npm` or `yarn` depending on what you have installed

4. **Database Issues:**
   - The SQLite database will be created automatically on first run
   - If you encounter database errors, delete `backend/applications.db` and restart

5. **CORS Errors:**
   - Make sure the backend is running on port 5000
   - Check that Flask-CORS is properly installed

### Development Tips

1. **Hot Reloading:**
   - Frontend changes will automatically reload the browser
   - Backend changes require restarting the Flask server

2. **Database Reset:**
   - To reset the database, delete `backend/applications.db`
   - The database will be recreated with fresh tables on next startup

3. **API Testing:**
   - Backend API is available at `http://localhost:5000/api/`
   - Use tools like Postman or curl to test endpoints

## Application Features

### Multi-Step Form
- Complete application process with 11 steps
- Progress bar showing current position
- Data persistence between steps
- Form validation and error handling

### Interactive Map (Click & Quote)
- OpenStreetMap integration
- Draw site boundaries
- Place substation premises
- Plan cable routes
- Distance measurements
- Existing network visualization

### Load Calculation
- Dynamic domestic load table
- Automatic kVA calculations
- Add/remove load items
- Total load computation

### Document Upload
- Required and optional documents
- File type validation
- Upload progress tracking

## File Structure

```
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── applications.db    # SQLite database (auto-created)
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # State management
│   │   └── ...
│   └── package.json        # Node.js dependencies
├── start_backend.bat      # Windows backend starter
├── start_frontend.bat     # Windows frontend starter
├── start_backend.sh       # Unix backend starter
├── start_frontend.sh      # Unix frontend starter
└── README.md              # Main documentation
```

## Support

If you encounter any issues:

1. Check the console/terminal for error messages
2. Ensure all dependencies are installed
3. Verify that both frontend and backend are running
4. Check that ports 3000 and 5000 are available

For additional help, refer to the main README.md file or contact the development team.
