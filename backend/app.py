import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'fixmate.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/services', methods=['GET'])
def get_services():
    try:
        conn = get_db_connection()
        services = conn.execute('SELECT * FROM services').fetchall()
        conn.close()
        return jsonify([dict(ix) for ix in services]), 200
    except Exception as e:
        print(f"Error fetching services: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    try:
        conn = get_db_connection()
        bookings = conn.execute('SELECT * FROM bookings ORDER BY created_at DESC').fetchall()
        conn.close()
        return jsonify([dict(ix) for ix in bookings]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Name, email, and password are required'}), 400
        
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            (data['name'], data['email'], hashed_password)
        )
        conn.commit()
        
        user_record = conn.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', (cursor.lastrowid,)).fetchone()
        conn.close()
        
        return jsonify({'message': 'Registration successful', 'user': dict(user_record)}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email address already registered'}), 409
    except Exception as e:
        print(f"Register DB error: {str(e)}")
        return jsonify({'error': 'Failed to register account'}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
        
    try:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (data['email'],)).fetchone()
        
        if not user:
            # Auto-create account if it doesn't exist (helpful for smooth demos)
            cursor = conn.cursor()
            hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
            # Use the part before @ in email as a default name
            default_name = data['email'].split('@')[0].capitalize()
            cursor.execute(
                'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
                (default_name, data['email'], hashed_password)
            )
            conn.commit()
            
            user_id = cursor.lastrowid
            conn.close()
            
            return jsonify({
                'message': 'Account automatically created and logged in!',
                'user': {
                    'id': user_id,
                    'name': default_name,
                    'email': data['email']
                }
            }), 201
            
        conn.close()
        
        if check_password_hash(user['password_hash'], data['password']):
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user['id'],
                    'name': user['name'],
                    'email': user['email']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid password'}), 401
    except Exception as e:
        print(f"Login DB error: {str(e)}")
        return jsonify({'error': 'An internal error occurred during login'}), 500

@app.route('/api/social-login', methods=['POST'])
def social_login():
    data = request.get_json()
    provider = data.get('provider', 'Google')
    
    # Mock standard OAuth profile info that Google/Apple would provide
    dummy_email = f"demo_{provider.lower()}@example.com"
    dummy_name = f"{provider} Demo User"
    
    try:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (dummy_email,)).fetchone()
        
        if not user:
            # Auto-register mock social user
            cursor = conn.cursor()
            hashed_password = generate_password_hash("social_login_dummy_password", method='pbkdf2:sha256')
            cursor.execute(
                'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
                (dummy_name, dummy_email, hashed_password)
            )
            conn.commit()
            user_id = cursor.lastrowid
        else:
            user_id = user['id']
            
        conn.close()
        
        return jsonify({
            'message': f'Successfully verified via {provider}',
            'user': {
                'id': user_id,
                'name': dummy_name,
                'email': dummy_email
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    
    # Required fields validation
    required_fields = ['full_name', 'phone_number', 'full_address', 'preferred_date', 'preferred_time', 'payment_option']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'Missing or empty required field: {field}'}), 400
            
    # Basic Time Validation (9 AM to 9 PM)
    time_str = data['preferred_time']
    try:
        hours, minutes = map(int, time_str.split(':'))
        if hours < 9 or hours > 21:
            return jsonify({'error': 'Time must be between 9:00 AM and 9:00 PM'}), 400
        if hours == 21 and minutes > 0:
            return jsonify({'error': 'Time must be between 9:00 AM and 9:00 PM'}), 400
    except Exception as e:
        return jsonify({'error': 'Invalid time format'}), 400

    service_category = data.get('service_category', 'General')

    # Assign Service Provider Logic
    provider_id = None
    provider_name = None
    
    try:
        conn = get_db_connection()
        provider = conn.execute('SELECT * FROM service_providers WHERE category = ? AND is_available = 1 LIMIT 1', (service_category,)).fetchone()
        
        if provider:
            provider_id = provider['id']
            provider_name = provider['name']
            
            # --- SIMULATE PROVIDER NOTIFICATION ---
            print(f"\\n==============================================")
            print(f"NOTIFICATION SENT TO SERVICE PROVIDER:")
            print(f"Name: {provider_name}")
            print(f"Phone: {provider['phone_number']}")
            print(f"Message: You have been assigned a new task at {data['full_address']} for {data['full_name']} on {data['preferred_date']} at {data['preferred_time']}.")
            print(f"==============================================\\n")
        else:
            print(f"WARNING: No available providers found for category '{service_category}'. Booking will be Unassigned.")
            
        new_booking = (
            data['full_name'],
            data['phone_number'],
            data['full_address'],
            data['preferred_date'],
            data['preferred_time'],
            data['payment_option'],
            service_category,
            provider_id,
            provider_name
        )
        
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO bookings (full_name, phone_number, full_address, preferred_date, preferred_time, payment_option, service_category, provider_id, provider_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', new_booking)
        
        inserted_id = cursor.lastrowid
        conn.commit()
        
        # Fetch the newly created booking to return it
        booking_record = conn.execute('SELECT * FROM bookings WHERE id = ?', (inserted_id,)).fetchone()
        conn.close()
        
        return jsonify({'message': 'Booking successful!', 'booking': dict(booking_record) if booking_record else {}}), 201
        
    except Exception as e:
        print(f"Insert DB error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
