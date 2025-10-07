-- ============================================
-- Crear base de datos (ejecutar solo desde un superusuario si no existe)
-- ============================================
CREATE DATABASE banos_autoservicio;

-- ============================================
-- Crear schema explícito
-- ============================================
CREATE SCHEMA IF NOT EXISTS bano_autoservicio;

-- ============================================
-- Tabla de roles
-- ============================================
CREATE TABLE IF NOT EXISTS bano_autoservicio.roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabla de servicios
-- ============================================
CREATE TABLE IF NOT EXISTS bano_autoservicio.servicios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL, -- Precio en pesos chilenos
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabla de usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS bano_autoservicio.users (
  id SERIAL PRIMARY KEY,

  -- Identificación
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),

  -- Credenciales
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,

  -- Clasificación
  role_id INT NOT NULL REFERENCES bano_autoservicio.roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Auditoría
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabla de logs de API
-- ============================================
CREATE TABLE IF NOT EXISTS bano_autoservicio.api_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id INT NULL REFERENCES bano_autoservicio.users(id) ON DELETE SET NULL,
  user_email VARCHAR(100),
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  status_code INT NOT NULL,
  response_time_ms NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para optimizar consultas de logs
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id     ON bano_autoservicio.api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_email       ON bano_autoservicio.api_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint    ON bano_autoservicio.api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at  ON bano_autoservicio.api_logs(created_at);

-- ============================================
-- Tabla de ventas
-- ============================================
CREATE TABLE IF NOT EXISTS bano_autoservicio.ventas (
  id BIGSERIAL PRIMARY KEY,

  -- Relaciones
  usuario_id INT NOT NULL REFERENCES bano_autoservicio.users(id) ON DELETE CASCADE,
  servicio_id INT NOT NULL REFERENCES bano_autoservicio.servicios(id) ON DELETE RESTRICT,

  -- Datos de la venta
  monto INT NOT NULL,                              -- Monto en pesos
  metodo_pago VARCHAR(50) NOT NULL,                -- Método de pago enviado por el front
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- Estado de la transacción

  -- Datos de la transacción POS/Transbank
  id_transaccion VARCHAR(100),     -- ID transacción de Transbank
  codigo_autorizacion VARCHAR(50), -- Código de autorización
  codigo_comercio VARCHAR(50),     -- Código de comercio (entregado por Transbank)

  -- Datos del tótem / AMOS
  ip_amos VARCHAR(45) NOT NULL,        -- IP del AMOS (IPv4/IPv6 soportado)
  ubicacion VARCHAR(100) NOT NULL,     -- Ubicación física (ej: "Terminal Sur")

  -- Auditoría
  creado_en TIMESTAMP NOT NULL          -- 🔹 ahora lo envía el backend
);

-- ============================================
-- Índices para optimizar consultas de ventas
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ventas_usuario_id       ON bano_autoservicio.ventas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ventas_servicio_id      ON bano_autoservicio.ventas(servicio_id);
CREATE INDEX IF NOT EXISTS idx_ventas_estado           ON bano_autoservicio.ventas(estado);
CREATE INDEX IF NOT EXISTS idx_ventas_creado_en        ON bano_autoservicio.ventas(creado_en);
CREATE INDEX IF NOT EXISTS idx_ventas_id_transaccion   ON bano_autoservicio.ventas(id_transaccion);
CREATE INDEX IF NOT EXISTS idx_ventas_codigo_comercio  ON bano_autoservicio.ventas(codigo_comercio);
CREATE INDEX IF NOT EXISTS idx_ventas_ip_amos          ON bano_autoservicio.ventas(ip_amos);
CREATE INDEX IF NOT EXISTS idx_ventas_ubicacion        ON bano_autoservicio.ventas(ubicacion);

-- ============================================
-- Inserts iniciales
-- ============================================

-- Roles
INSERT INTO bano_autoservicio.roles (name) VALUES
  ('admin'),
  ('totem'),
  ('user')
ON CONFLICT (name) DO NOTHING;

-- Servicios
INSERT INTO bano_autoservicio.servicios (nombre, precio) VALUES
  ('Baño', 500),
  ('Ducha', 3500)
ON CONFLICT DO NOTHING;

-- Usuario admin (password: 123456 hasheado con bcrypt)
INSERT INTO bano_autoservicio.users (name, last_name, email, password_hash, role_id)
VALUES (
  'Administrador',
  NULL,
  'admin@wit.la',
  '$2b$10$Z7W4vgtN1B5HVe1RInLVvuKYsxvlSnhxyL/mr.bLbKzLYuG9DChZ2',
  (SELECT id FROM bano_autoservicio.roles WHERE name='admin')
);

-- Usuario tótem (password: 123456 hasheado con bcrypt)
INSERT INTO bano_autoservicio.users (name, last_name, email, password_hash, role_id)
VALUES (
  'Totem baño 1',
  NULL,
  'totem1@wit.la',
  '$2b$10$Z7W4vgtN1B5HVe1RInLVvuKYsxvlSnhxyL/mr.bLbKzLYuG9DChZ2',
  (SELECT id FROM bano_autoservicio.roles WHERE name='totem')
);