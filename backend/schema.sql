-- MySQL Initial Schema Setup

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Services Table
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price_range VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(255)
);

-- 2. Create Service Providers Table
CREATE TABLE IF NOT EXISTS service_providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    full_address TEXT NOT NULL,
    preferred_date VARCHAR(20) NOT NULL,
    preferred_time VARCHAR(20) NOT NULL,
    payment_option VARCHAR(50) NOT NULL,
    service_category VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Pending',
    provider_id INT,
    provider_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES service_providers(id)
);

-- 4. Seed Services
INSERT IGNORE INTO services (id, name, description, price_range, category, image_url) VALUES 
(1, 'AC Cleaning & Servicing', 'Professional AC servicing, filter cleaning, gas refill, and maintenance for peak cooling.', '₹499 - ₹1499', 'Appliance Repair', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1469&auto=format&fit=crop'),
(2, 'Plumbing Services', 'Fixing leaks, blockages, pipe installations, and complete bathroom fittings.', '₹299 - ₹1999', 'Plumbing', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1470&auto=format&fit=crop'),
(3, 'Electrician', 'Wiring, switchboard repair, appliance installation, and fault finding.', '₹199 - ₹1299', 'Electrical', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1469&auto=format&fit=crop'),
(4, 'Carpenter', 'Furniture assembly, door lock repair, custom woodwork, and general carpentry.', '₹399 - ₹2499', 'Carpentry', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1470&auto=format&fit=crop'),
(5, 'RO Filter Cleaning & Service', 'Comprehensive RO water purifier servicing, filter replacement, and TDS level check.', '₹299 - ₹1299', 'Appliance Repair', '/images/ro_filter.png'),
(6, 'Pest Control', 'Effective treatments for cockroaches, termites, bed bugs, and general pest control.', '₹899 - ₹2999', 'Cleaning & Pest Control', '/images/pest_control.png');

-- 5. Seed Mock Service Providers
INSERT IGNORE INTO service_providers (id, name, phone_number, category, is_available) VALUES 
(1, 'Ramesh Kumar', '+91 9876543210', 'Appliance Repair', TRUE),
(2, 'Suresh Singh', '+91 8765432109', 'Plumbing', TRUE),
(3, 'Vikram Das', '+91 7654321098', 'Electrical', TRUE),
(4, 'Amit Patel', '+91 6543210987', 'Carpentry', TRUE),
(5, 'Manoz Sharma', '+91 5432109876', 'Cleaning & Pest Control', TRUE);
