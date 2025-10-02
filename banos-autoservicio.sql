-- Crear base de datos (se hace fuera de psql si no existe)
CREATE DATABASE banos_autoservicio;

-- Conectar a la base
\c banos_autoservicio;

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL, -- Precio en pesos chilenos
  created_at TIMESTAMP NOT NULL
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,

  -- Identificación
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),

  -- Credenciales
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  -- Clasificación
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','totem','user')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Auditoría
  created_at TIMESTAMP NOT NULL
);

-- Tabla de logs de API
CREATE TABLE IF NOT EXISTS api_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id INT NULL,
  user_email VARCHAR(100),
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  status_code INT NOT NULL,
  response_time_ms NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para optimizar consultas
CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_email ON api_logs(user_email);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);

-- Insertar registros en servicios
INSERT INTO servicios (nombre, precio, created_at) VALUES
  ('Baño', 500, NOW()),
  ('Ducha', 3500, NOW());

-- Insertar usuario admin (password: 123456 hasheado con bcrypt)
INSERT INTO users (name, last_name, email, password_hash, role, created_at) VALUES
  ('Administrador', NULL, 'admin@wit.la', '$2b$10$Z7W4vgtN1B5HVe1RInLVvuKYsxvlSnhxyL/mr.bLbKzLYuG9DChZ2', 'admin', NOW());

-- Insertar usuario totem (password: 123456 hasheado con bcrypt)
INSERT INTO users (name, last_name, email, password_hash, role, created_at) VALUES
  ('Totem baño 1', NULL, 'totem1@wit.la', '$2b$10$Z7W4vgtN1B5HVe1RInLVvuKYsxvlSnhxyL/mr.bLbKzLYuG9DChZ2', 'totem', NOW());
