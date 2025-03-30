CREATE DATABASE IF NOT EXISTS booking_system;
USE booking_system;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  verification_token VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  booking_date DATE NOT NULL,
  booking_type ENUM('Full Day', 'Half Day', 'Custom') NOT NULL,
  booking_slot ENUM('First Half', 'Second Half'),
  booking_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT unique_booking UNIQUE (booking_date, booking_type, booking_slot, booking_time)
);
