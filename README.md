# UK Power Networks Application System

A comprehensive web application for UK Power Networks that allows users to submit electrical connection applications through a multi-step form process. The application includes an interactive map-based "Click & Quote" feature for planning electrical connections.

## Features

- **Multi-step Application Form**: Complete application process from applicant details to submission
- **Interactive Map Interface**: Click & Quote page with map view for planning connections
- **Quotation System**: Sample quotations for TW3 postcode with clone functionality
- **Domestic Load Table**: Dynamic table for calculating electrical load requirements
- **Document Upload**: Support for uploading required documents
- **Real-time Progress Tracking**: Visual progress bar showing application steps
- **Responsive Design**: Works on desktop and mobile devices

## Application Flow

1. **Applicant Details** - Basic applicant information with toggle switches
2. **General Information** - Service type, property use, and requirements
3. **Site Address** - Complete address information
4. **Load Details** - Domestic load table with kVA calculations
5. **Other Contact** - Additional contact information
6. **Click & Quote** - Interactive map for planning connections
7. **Project Details** - Project-specific information
8. **Auto Quote Eligibility** - Eligibility assessment
9. **Upload Docs** - Document upload functionality
10. **Summary** - Review all application details
11. **Submitted** - Confirmation and next steps

## Quotation System

The application includes a sample quotation system for the TW3 postcode area:

- **Sample Quotations**: Three pre-configured quotations for different project types
- **Quote Details**: Complete breakdown including costs, terms, and contact information
- **Clone Functionality**: Users can clone existing quotations for their projects
- **Modal Interface**: Clean, responsive modal for viewing and managing quotations

### Available Sample Quotations (TW3)

1. **Sample Customer Ltd** - Three Phase New Connection (150 kVA) - £12,500
2. **Residential Development** - Single Phase Upgrade (25 kVA) - £3,200
3. **Industrial Complex** - Three Phase New Connection (500 kVA) - £45,000

To test the quotation feature:
1. Enter a TW3 postcode in the Site Address form
2. Navigate to the Click & Quote page
3. Click "View Available Quotes" to see sample quotations
4. Click on any quotation to view details
5. Use "Clone This Quote" to create a copy for your project

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Leaflet** - Interactive maps
- **CSS3** - Custom styling with responsive design
- **Axios** - HTTP client for API calls

### Backend
- **Python Flask** - Lightweight web framework
- **SQLite** - Embedded database
- **Flask-CORS** - Cross-origin resource sharing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:4321`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:1234`

## API Endpoints

### Applications
- `POST /api/applications` - Create new application
- `GET /api/applications/{id}` - Get application by ID
- `PUT /api/applications/{id}` - Update application

### Load Items
- `GET /api/load-items/{app_id}` - Get load items for application
- `POST /api/load-items/{app_id}` - Add load item
- `DELETE /api/load-items/{app_id}?item_id={id}` - Remove load item

## Database Schema

### Applications Table
- `id` - Primary key
- `applicant_details` - JSON field for applicant information
- `general_information` - JSON field for general information
- `site_address` - JSON field for site address
- `load_details` - JSON field for load details
- `other_contact` - JSON field for other contacts
- `click_quote_data` - JSON field for map data
- `project_details` - JSON field for project information
- `auto_quote_eligibility` - JSON field for eligibility data
- `upload_docs` - JSON field for document information
- `summary` - JSON field for summary data
- `status` - Application status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Load Items Table
- `id` - Primary key
- `application_id` - Foreign key to applications
- `connection_type` - Type of connection
- `phases` - Number of phases
- `heating_type` - Heating method
- `bedrooms` - Number of bedrooms
- `quantity` - Number of connections
- `load_per_installation` - Load per installation in kVA
- `summed_load` - Total load in kVA

## Map Features

The Click & Quote page includes:
- **Interactive Map**: OpenStreetMap integration with Leaflet
- **Site Boundary Drawing**: Draw site boundaries with distance measurements
- **Substation Placement**: Place substation premises with standard sizing
- **Cable Route Planning**: Draw cable routes between points
- **Existing Network Visualization**: Green lines showing existing infrastructure
- **Map Controls**: Zoom, fullscreen, layer toggle, and help controls
- **Legend**: Color-coded connection possibility indicators

## Development

### Project Structure
```
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── applications.db    # SQLite database (created on first run)
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   ├── App.js         # Main App component
│   │   ├── App.css        # App-specific styles
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Node.js dependencies
└── README.md              # This file
```

### Key Components

- **Header**: Navigation and branding
- **ProgressBar**: Visual step indicator
- **MapComponent**: Interactive map with drawing tools
- **ApplicationContext**: Global state management
- **Form Pages**: Individual step components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for UK Power Networks.

## Support

For technical support or questions, please contact the development team.
