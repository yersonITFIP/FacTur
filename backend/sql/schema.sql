-- ============================================
-- FacTur - Database Schema
-- Base de datos para gestión de facturas y gastos
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS factur_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE factur_db;

-- ============================================
-- Tabla de usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla de gastos/facturas
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    value DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Vista para gastos de hoy
-- ============================================
CREATE OR REPLACE VIEW v_today_expenses AS
SELECT
    e.id,
    e.user_id,
    e.name,
    e.description,
    e.value,
    e.created_at,
    u.name AS user_name
FROM expenses e
INNER JOIN users u ON e.user_id = u.id
WHERE DATE(e.created_at) = CURDATE();

-- ============================================
-- Vista para gastos de la semana actual
-- ============================================
CREATE OR REPLACE VIEW v_week_expenses AS
SELECT
    e.id,
    e.user_id,
    e.name,
    e.description,
    e.value,
    e.created_at,
    u.name AS user_name,
    WEEK(e.created_at, 1) AS week_number,
    YEAR(e.created_at) AS year
FROM expenses e
INNER JOIN users u ON e.user_id = u.id
WHERE YEARWEEK(e.created_at, 1) = YEARWEEK(CURDATE(), 1);

-- ============================================
-- Datos de prueba (opcional)
-- ============================================
-- INSERT INTO users (name, email, password) VALUES
-- ('Test User', 'test@example.com', '$2a$10$...'); -- Password: test123
