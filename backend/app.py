from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('applications.db')
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
    conn = sqlite3.connect('applications.db')
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
    conn = sqlite3.connect('applications.db')
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
    conn = sqlite3.connect('applications.db')
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

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=4321)
