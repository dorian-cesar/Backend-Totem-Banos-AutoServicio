-- Crear base de datos
CREATE SCHEMA IF NOT EXISTS totem_banos;

USE totem_banos;

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL COMMENT 'Precio en pesos chilenos',
  created_at TIMESTAMP NOT NULL -- Será insertado desde Node.js con Luxon
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Identificación
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NULL,

  -- Credenciales
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  -- Clasificación
  role ENUM('admin','totem','user') NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Auditoría
  created_at TIMESTAMP NOT NULL -- Será insertado desde Node.js con Luxon
);

-- Tabla de logs de API
CREATE TABLE IF NOT EXISTS api_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  user_email VARCHAR(100) NULL,
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  status_code INT NOT NULL,
  response_time_ms DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL, -- Será insertado desde Node.js con Luxon
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para optimizar consultas
CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_email ON api_logs(user_email);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);

-- Insertar registros en servicios (created_at se asigna desde Node.js)
INSERT INTO servicios (nombre, precio, created_at) VALUES
  ('Baño', 500, NOW()),
  ('Ducha', 3500, NOW());

-- Insertar usuario admin (password: 123456 hasheado con bcrypt)
INSERT INTO users (name, last_name, email, password_hash, role, created_at) VALUES
  ('Administrador', NULL, 'admin@wit.la', '$2b$10$Z7W4vgtN1B5HVe1RInLVvuKYsxvlSnhxyL/mr.bLbKzLYuG9DChZ2', 'admin', NOW());

-- Insertar usuario totem (password: 123456 hasheado con bcrypt)
INSERT INTO users (name, last_name, email, password_hash, role, created_at) VALUES
  ('Totem baño 1', NULL, 'totem1@wit.la', '$2b$10$Z7W4vgtN1B5HVe1RInLVvuKYsxvlSnhxyL/mr.bLbKzLYuG9DChZ2', 'totem', NOW());