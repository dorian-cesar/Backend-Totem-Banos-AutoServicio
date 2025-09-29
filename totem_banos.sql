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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar registros en servicios
INSERT INTO servicios (nombre, precio) VALUES
  ('Baño', 500),
  ('Ducha', 3500);

-- Insertar usuario admin (password: 123456 hasheado con bcrypt)
INSERT INTO users (email, password_hash) VALUES
  ('admin@wit.la', '$2b$10$ZLDbL8Nf5cYhdzQ9Pa99Pu9glTfJniH1TOdEh0QKnwClK9xB0iRUm');
