-- Crear base de datos
CREATE SCHEMA IF NOT EXISTS totem_banos;

USE totem_banos;

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL COMMENT 'Precio en pesos chilenos',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para optimizar consultas
CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_email ON api_logs(user_email);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);

-- Insertar registros en servicios
INSERT INTO servicios (nombre, precio) VALUES
  ('Baño', 500),
  ('Ducha', 3500);

-- Insertar usuario admin (password: 123456 hasheado con bcrypt)
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@wit.la', '$2b$10$ZLDbL8Nf5cYhdzQ9Pa99Pu9glTfJniH1TOdEh0QKnwClK9xB0iRUm', 'admin');
