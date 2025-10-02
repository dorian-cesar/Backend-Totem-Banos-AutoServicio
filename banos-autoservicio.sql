-- ============================================
-- 1) Crear la base de datos (ejecutar solo desde un superusuario, si no existe)
-- ============================================
CREATE DATABASE banos_autoservicio;

-- ============================================
-- 2) Conectarse a la base de datos (en psql usar:  \c banos_autoservicio)
--    En DBeaver: cambiar la conexión activa a "banos_autoservicio"
-- ============================================

-- ============================================
-- 3) Crear un schema explícito (opcional, pero recomendado)
--    Todas las tablas estarán dentro de este schema
-- ============================================
CREATE SCHEMA IF NOT EXISTS bano_autoservicio;

-- Forzar a usar siempre este schema en las consultas
SET search_path TO banos_autoservicio;

-- ============================================
-- 4) Crear tablas
-- ============================================

-- Tabla de roles (controla los tipos de usuario)
CREATE TABLE IF NOT EXISTS banos_autoservicio.roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de servicios (ej: baño, ducha)
CREATE TABLE IF NOT EXISTS banos_autoservicio.servicios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL, -- Precio en pesos chilenos
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de usuarios (humanos y tótems)
CREATE TABLE IF NOT EXISTS banos_autoservicio.users (
  id SERIAL PRIMARY KEY,

  -- Identificación
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),

  -- Credenciales
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  -- Relación con roles
  role_id INT NOT NULL REFERENCES banos_autoservicio.roles(id) ON DELETE RESTRICT,

  -- Estado de la cuenta
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Auditoría
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de logs de API (auditoría de consumo de endpoints)
CREATE TABLE IF NOT EXISTS banos_autoservicio.api_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id INT NULL REFERENCES banos_autoservicio.users(id) ON DELETE SET NULL,
  user_email VARCHAR(100),
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  status_code INT NOT NULL,
  response_time_ms NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5) Crear índices para mejorar rendimiento
-- ============================================
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id     ON banos_autoservicio.api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_email       ON banos_autoservicio.api_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint    ON banos_autoservicio.api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at  ON banos_autoservicio.api_logs(created_at);

-- ============================================
-- 6) Inserts iniciales
-- ============================================

-- Insertar roles base
INSERT INTO banos_autoservicio.roles (name) VALUES
  ('admin'),
  ('totem'),
  ('user')
ON CONFLICT (name) DO NOTHING;

-- Insertar servicios iniciales
INSERT INTO banos_autoservicio.servicios (nombre, precio) VALUES
  ('Baño', 500),
  ('Ducha', 3500)
ON CONFLICT DO NOTHING;

-- Insertar usuario admin (password: 123456 hasheado con bcrypt)
INSERT INTO banos_autoservicio.users (name, last_name, email, password_hash, role_id)
VALUES (
  'Administrador',
  NULL,
  'admin@wit.la',
  '$2b$10$Z7W4vgtN1B5HVe1RInLVvuKYsxvlSnhxyL/mr.bLbKzLYuG9DChZ2',
  (SELECT id FROM banos_autoservicio.roles WHERE name='admin')
);

-- Insertar usuario tótem (password: 123456 hasheado con bcrypt)
INSERT INTO banos_autoservicio.users (name, last_name, email, password_hash, role_id)
VALUES (
  'Totem baño 1',
  NULL,
  'totem1@wit.la',
  '$2b$10$Z7W4vgtN1B5HVe1RInLVvuKYsxvlSnhxyL/mr.bLbKzLYuG9DChZ2',
  (SELECT id FROM banos_autoservicio.roles WHERE name='totem')
);