from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime, timedelta
import os
import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email_validator import validate_email, EmailNotValidError

app = Flask(__name__)
CORS(app, origins=["http://localhost:1234", "http://127.0.0.1:1234"], 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# Email configuration
EMAIL_ADDRESS = "alphanxzen@gmail.com"
EMAIL_PASSWORD = "rewn cxqu eiuz fgmd"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# In-memory storage for OTPs (in production, use Redis or database)
otp_storage = {}

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(email, otp):
    """Send OTP via email"""
    try:
        # For development/testing purposes, we'll log the OTP instead of sending email
        # In production, uncomment the email sending code below
        print(f"OTP for {email}: {otp}")
        print(f"Email would be sent to: {email}")
        print(f"OTP expires in 10 minutes")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = email
        msg['Subject'] = "UK Power Networks - One-Time Password"
        
        # Email body
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #007bff; margin: 0;">UK Power Networks</h1>
                    <p style="color: #666; margin: 5px 0;">Application Portal</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #333; margin-top: 0;">Your One-Time Password</h2>
                    <p>You have requested to sign in to the UK Power Networks Application Portal.</p>
                    <p>Please use the following one-time password to complete your login:</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; font-size: 2.5em; letter-spacing: 0.2em; margin: 0; font-family: monospace;">{otp}</h1>
                    </div>
                    
                    <p><strong>This OTP will expire in 10 minutes.</strong></p>
                    <p>If you did not request this login, please ignore this email.</p>
                </div>
                
                <div style="text-align: center; color: #666; font-size: 0.9em;">
                    <p>Need help? Contact support at support@ukpowernetworks.co.uk</p>
                    <p>&copy; 2025 UK Power Networks. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_ADDRESS, email, text)
        server.quit()
        
        print(f"Email sent successfully to {email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        if "AuthenticationError" in str(e) or "BadCredentials" in str(e):
            print("Gmail authentication failed. Please check:")
            print("1. Gmail account has 'Less secure app access' enabled")
            print("2. App password is correct")
            print("3. 2-factor authentication is properly configured")
        return False

# Database initialization
def init_db():
    # Create data directory if it doesn't exist
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(data_dir, exist_ok=True)
    conn = sqlite3.connect(os.path.join(data_dir, 'applications.db'))
    cursor = conn.cursor()
    
    # Create applications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            applicant_details TEXT,
            general_information TEXT,
            site_address TEXT,
            load_details TEXT,
            other_contact TEXT,
            click_quote_data TEXT,
            project_details TEXT,
            auto_quote_eligibility TEXT,
            upload_docs TEXT,
            summary TEXT,
            status TEXT DEFAULT 'draft',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create load_items table for domestic load table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS load_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            application_id INTEGER,
            connection_type TEXT,
            phases TEXT,
            heating_type TEXT,
            bedrooms TEXT,
            quantity INTEGER,
            load_per_installation REAL,
            summed_load REAL,
            FOREIGN KEY (application_id) REFERENCES applications (id)
        )
    ''')
    
    conn.commit()
    conn.close()

@app.route('/api/applications', methods=['POST'])
def create_application():
    data = request.json
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    conn = sqlite3.connect(os.path.join(data_dir, 'applications.db'))
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO applications (applicant_details, general_information, site_address, 
                                load_details, other_contact, click_quote_data, 
                                project_details, auto_quote_eligibility, upload_docs, summary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        json.dumps(data.get('applicant_details', {})),
        json.dumps(data.get('general_information', {})),
        json.dumps(data.get('site_address', {})),
        json.dumps(data.get('load_details', {})),
        json.dumps(data.get('other_contact', {})),
        json.dumps(data.get('click_quote_data', {})),
        json.dumps(data.get('project_details', {})),
        json.dumps(data.get('auto_quote_eligibility', {})),
        json.dumps(data.get('upload_docs', {})),
        json.dumps(data.get('summary', {}))
    ))
    
    application_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': application_id, 'message': 'Application created successfully'})

@app.route('/api/applications/<int:app_id>', methods=['GET', 'PUT'])
def handle_application(app_id):
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    conn = sqlite3.connect(os.path.join(data_dir, 'applications.db'))
    cursor = conn.cursor()
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM applications WHERE id = ?', (app_id,))
        app = cursor.fetchone()
        
        if not app:
            return jsonify({'error': 'Application not found'}), 404
        
        # Convert to dict
        columns = [description[0] for description in cursor.description]
        app_dict = dict(zip(columns, app))
        
        # Parse JSON fields
        for field in ['applicant_details', 'general_information', 'site_address', 
                     'load_details', 'other_contact', 'click_quote_data',
                     'project_details', 'auto_quote_eligibility', 'upload_docs', 'summary']:
            if app_dict[field]:
                app_dict[field] = json.loads(app_dict[field])
            else:
                app_dict[field] = {}
        
        conn.close()
        return jsonify(app_dict)
    
    elif request.method == 'PUT':
        data = request.json
        cursor.execute('''
            UPDATE applications SET 
                applicant_details = ?, general_information = ?, site_address = ?,
                load_details = ?, other_contact = ?, click_quote_data = ?,
                project_details = ?, auto_quote_eligibility = ?, upload_docs = ?,
                summary = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            json.dumps(data.get('applicant_details', {})),
            json.dumps(data.get('general_information', {})),
            json.dumps(data.get('site_address', {})),
            json.dumps(data.get('load_details', {})),
            json.dumps(data.get('other_contact', {})),
            json.dumps(data.get('click_quote_data', {})),
            json.dumps(data.get('project_details', {})),
            json.dumps(data.get('auto_quote_eligibility', {})),
            json.dumps(data.get('upload_docs', {})),
            json.dumps(data.get('summary', {})),
            app_id
        ))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Application updated successfully'})

@app.route('/api/load-items/<int:app_id>', methods=['GET', 'POST', 'DELETE'])
def handle_load_items(app_id):
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    conn = sqlite3.connect(os.path.join(data_dir, 'applications.db'))
    cursor = conn.cursor()
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM load_items WHERE application_id = ?', (app_id,))
        items = cursor.fetchall()
        
        columns = [description[0] for description in cursor.description]
        items_list = [dict(zip(columns, item)) for item in items]
        
        conn.close()
        return jsonify(items_list)
    
    elif request.method == 'POST':
        data = request.json
        cursor.execute('''
            INSERT INTO load_items (application_id, connection_type, phases, heating_type,
                                  bedrooms, quantity, load_per_installation, summed_load)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            app_id, data.get('connection_type'), data.get('phases'),
            data.get('heating_type'), data.get('bedrooms'), data.get('quantity'),
            data.get('load_per_installation'), data.get('summed_load')
        ))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Load item added successfully'})
    
    elif request.method == 'DELETE':
        item_id = request.args.get('item_id')
        cursor.execute('DELETE FROM load_items WHERE id = ? AND application_id = ?', (item_id, app_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Load item deleted successfully'})

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({'message': 'Backend is working!', 'status': 'success'})

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to user's email"""
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Validate email
        try:
            valid = validate_email(email)
            email = valid.email
        except EmailNotValidError:
            return jsonify({'error': 'Invalid email address'}), 400
        
        # Generate OTP
        otp = generate_otp()
        
        # Store OTP with expiration time (10 minutes)
        otp_storage[email] = {
            'otp': otp,
            'expires_at': datetime.now() + timedelta(minutes=10),
            'attempts': 0
        }
        
        # Send email
        if send_otp_email(email, otp):
            return jsonify({'message': 'OTP sent successfully'})
        else:
            return jsonify({'error': 'Failed to send OTP email'}), 500
            
    except Exception as e:
        print(f"Error in send_otp: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP and authenticate user"""
    try:
        data = request.json
        email = data.get('email', '').strip().lower()
        otp = data.get('otp', '').strip()
        
        if not email or not otp:
            return jsonify({'error': 'Email and OTP are required'}), 400
        
        # Check if OTP exists for this email
        if email not in otp_storage:
            return jsonify({'error': 'OTP not found or expired'}), 400
        
        otp_data = otp_storage[email]
        
        # Check if OTP has expired
        if datetime.now() > otp_data['expires_at']:
            del otp_storage[email]
            return jsonify({'error': 'OTP has expired'}), 400
        
        # Check attempt limit (max 3 attempts)
        if otp_data['attempts'] >= 3:
            del otp_storage[email]
            return jsonify({'error': 'Too many failed attempts'}), 400
        
        # Verify OTP
        if otp_data['otp'] != otp:
            otp_data['attempts'] += 1
            return jsonify({'error': 'Invalid OTP'}), 400
        
        # OTP is valid - generate token and clean up
        del otp_storage[email]
        
        # Generate a simple token (in production, use JWT)
        token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        
        return jsonify({
            'message': 'Authentication successful',
            'token': token,
            'email': email
        })
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    init_db()
    # Use 0.0.0.0 to allow external connections in Docker
    app.run(host='127.0.0.1', port=5000, debug=True, threaded=True)
