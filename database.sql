-- ============================================================
-- CampusCare – Smart Complaint Management System
-- Database Schema (MySQL)
-- ============================================================
-- Run this file in MySQL to set up the database:
--   mysql -u root -p < database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS campuscare;
USE campuscare;

-- ============================================================
-- TABLE 1: admin
-- Stores admin login credentials
-- ============================================================
CREATE TABLE IF NOT EXISTS admin (
  id          VARCHAR(20) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,      -- Store hashed password in production!
  role        VARCHAR(50)  DEFAULT 'Super Admin',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 2: students
-- Stores registered student accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id              VARCHAR(30)  PRIMARY KEY,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  enrollment      VARCHAR(50)  UNIQUE NOT NULL,
  email           VARCHAR(150) UNIQUE NOT NULL,
  password        VARCHAR(255) NOT NULL,      -- Hash with bcrypt or sha256
  department      VARCHAR(100),
  year            VARCHAR(20),
  phone           VARCHAR(15),
  registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 3: complaints
-- Main complaints table
-- ============================================================
CREATE TABLE IF NOT EXISTS complaints (
  id                  VARCHAR(20)   PRIMARY KEY,
  student_id          VARCHAR(30),
  student_name        VARCHAR(200),
  student_enrollment  VARCHAR(50),
  title               VARCHAR(255)  NOT NULL,
  category            ENUM('Electrical','Water','Cleanliness','WiFi','Classroom','Hostel','Others') NOT NULL,
  priority            ENUM('Low','Medium','High','Urgent')     NOT NULL,
  location            VARCHAR(255),
  description         TEXT          NOT NULL,
  status              ENUM('Pending','In Progress','Resolved') DEFAULT 'Pending',
  submitted_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- ============================================================
-- INDEX for faster queries
-- ============================================================
CREATE INDEX idx_complaints_student   ON complaints(student_id);
CREATE INDEX idx_complaints_status    ON complaints(status);
CREATE INDEX idx_complaints_category  ON complaints(category);

-- ============================================================
-- SEED DATA – Sample Admin Account
-- ============================================================
INSERT INTO admin (id, name, email, password, role) VALUES
('admin-001', 'Administrator', 'admin@college.edu', 'admin123', 'Super Admin');

-- ============================================================
-- SEED DATA – Sample Students
-- ============================================================
INSERT INTO students (id, first_name, last_name, enrollment, email, password, department, year, phone) VALUES
('s1', 'Rahul',  'Sharma', '2024CS001', 'rahul@college.edu', 'student123', 'Computer Science', '3rd Year', '9876543210'),
('s2', 'Priya',  'Patel',  '2024EC002', 'priya@college.edu', 'student123', 'Electronics',      '2nd Year', '9123456789');

-- ============================================================
-- SEED DATA – Sample Complaints
-- ============================================================
INSERT INTO complaints (id, student_id, student_name, student_enrollment, title, category, priority, location, description, status) VALUES
('CC-2024-0001', 's1', 'Rahul Sharma', '2024CS001', 'WiFi not working in Computer Lab 3',
 'WiFi', 'High', 'Block A, Lab 3',
 'The WiFi connection in Computer Lab 3 has been down for the past 3 days. Students unable to complete online assignments.',
 'In Progress'),

('CC-2024-0002', 's2', 'Priya Patel', '2024EC002', 'Broken ceiling fan in Classroom 201',
 'Electrical', 'Medium', 'Block B, Room 201',
 'The ceiling fan in Classroom 201 is making loud noise and one blade is bent. Safety hazard.',
 'Pending'),

('CC-2024-0003', 's1', 'Rahul Sharma', '2024CS001', 'Water leakage near washroom corridor',
 'Water', 'Urgent', 'Block C, Ground Floor',
 'Water leakage near the washroom corridor on the ground floor. Floor is always wet and slippery.',
 'Resolved');

-- ============================================================
-- COMMON SQL QUERIES – CRUD Operations
-- ============================================================

-- --------  SELECT  --------

-- Get all complaints (newest first)
-- SELECT * FROM complaints ORDER BY submitted_at DESC;

-- Get complaints for a specific student
-- SELECT * FROM complaints WHERE student_id = 's1' ORDER BY submitted_at DESC;

-- Get complaints by status
-- SELECT * FROM complaints WHERE status = 'Pending' ORDER BY submitted_at DESC;

-- Get complaint count by status (for dashboard stats)
-- SELECT status, COUNT(*) AS total FROM complaints GROUP BY status;

-- Get complaint count by category (for reports)
-- SELECT category, COUNT(*) AS total FROM complaints GROUP BY category ORDER BY total DESC;

-- Get all complaints with full student info (JOIN)
-- SELECT
--   c.id, c.title, c.category, c.priority, c.status, c.submitted_at,
--   s.first_name, s.last_name, s.enrollment, s.email
-- FROM complaints c
-- LEFT JOIN students s ON c.student_id = s.id
-- ORDER BY c.submitted_at DESC;

-- Search complaints by keyword
-- SELECT * FROM complaints WHERE title LIKE '%WiFi%' OR description LIKE '%WiFi%';

-- --------  INSERT  --------

-- Register a new student
-- INSERT INTO students (id, first_name, last_name, enrollment, email, password, department, year, phone)
-- VALUES (UUID(), 'John', 'Doe', '2024ME003', 'john@college.edu', SHA2('mypassword', 256), 'Mechanical', '1st Year', '9999999999');

-- Submit a new complaint
-- INSERT INTO complaints (id, student_id, student_name, student_enrollment, title, category, priority, location, description)
-- VALUES (
--   CONCAT('CC-', YEAR(NOW()), '-', LPAD(AUTO_INCREMENT, 4, '0')),
--   's1', 'Rahul Sharma', '2024CS001',
--   'New complaint title', 'WiFi', 'High', 'Block D, Room 105',
--   'Detailed complaint description goes here...'
-- );

-- --------  UPDATE  --------

-- Update complaint status (Admin action)
-- UPDATE complaints
-- SET status = 'Resolved', updated_at = NOW()
-- WHERE id = 'CC-2024-0001';

-- Update student profile
-- UPDATE students SET phone = '8888888888', year = '4th Year' WHERE id = 's1';

-- --------  DELETE  --------

-- Delete a complaint (Admin action)
-- DELETE FROM complaints WHERE id = 'CC-2024-0001';

-- Delete a student account
-- DELETE FROM students WHERE id = 's1';

-- ============================================================
-- END OF SCHEMA
-- ============================================================
