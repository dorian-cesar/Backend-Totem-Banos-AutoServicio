📄 Informe Técnico – Backend Totem Baños Autoservicio
🏗️ Arquitectura General

Framework: Node.js + Express

Base de datos: MySQL (usando mysql2 con pool de conexiones).

Seguridad:

Autenticación con JWT (JSON Web Token).

Middleware global requireAuth que protege todas las rutas privadas.

bcrypt para hash de contraseñas.

Logs de auditoría:

Middleware auditLogger que registra todas las llamadas a la API (usuario, endpoint, IP, tiempo de respuesta, estado HTTP).

Almacenamiento en tabla api_logs.

Limpieza automática de logs con cron (90 días).

📂 Estructura de Carpetas
src/
 ├── app.js              # Configuración principal de rutas y middlewares
 ├── server.js           # Punto de arranque del servidor
 ├── config/
 │    └── db.js          # Configuración conexión MySQL
 ├── controllers/        # Controladores de negocio
 │    ├── authController.js
 │    ├── userController.js
 │    ├── servicioController.js
 │    └── logController.js
 ├── models/             # Acceso a base de datos
 │    ├── userModel.js
 │    ├── servicioModel.js
 │    └── logModel.js
 ├── routes/             # Definición de endpoints
 │    ├── authRoutes.js
 │    ├── userRoutes.js
 │    ├── servicioRoutes.js
 │    └── logRoutes.js
 ├── middleware/         
 │    ├── auditLogger.js # Middleware de auditoría
 │    └── requireAuth.js # Middleware de autenticación con JWT
 └── cron/
      └── cleanLogs.js   # Tarea programada para limpieza de logs (cada 90 días)

📑 Endpoints Disponibles
🔐 Autenticación (/api/auth)

POST /login → Inicia sesión con email y password, retorna JWT.

POST /register → Crea nuevo usuario (solo accesible con admin si lo restringes).

GET /me → Retorna información del usuario autenticado.

👤 Usuarios (/api/users) (requiere JWT)

GET / → Lista todos los usuarios.

GET /:id → Obtiene un usuario por ID.

PUT /:id → Actualiza email, contraseña o rol de un usuario.

DELETE /:id → Elimina un usuario.

⚠️ Todos estos endpoints ya están protegidos globalmente en app.js con requireAuth.

🛁 Servicios (/api/servicios) (requiere JWT)

GET / → Lista todos los servicios.

GET /:id → Obtiene un servicio específico.

POST / → Crea un nuevo servicio (ej. baño, ducha).

PUT /:id → Modifica nombre o precio del servicio.

DELETE /:id → Elimina un servicio.

📊 Logs (/api/logs) (requiere JWT)

GET / → Listado paginado de logs.

Parámetros opcionales: ?page=1&limit=50

Incluye filtros por fecha, endpoint, usuario, etc. (según implementación).

🗄️ Base de Datos
Tabla users
id INT AUTO_INCREMENT PRIMARY KEY
email VARCHAR(100) UNIQUE
password_hash VARCHAR(255)
role VARCHAR(50) DEFAULT 'user'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


Roles sugeridos: admin, mantenedor, totem, user.

Tabla servicios
id INT AUTO_INCREMENT PRIMARY KEY
nombre VARCHAR(100) NOT NULL
precio INT NOT NULL COMMENT 'Precio en pesos chilenos'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


Ejemplo de seed:

Baño → 500

Ducha → 3500

Tabla api_logs
id BIGINT AUTO_INCREMENT PRIMARY KEY
user_id INT NULL
user_email VARCHAR(100) NULL
method VARCHAR(10) NOT NULL
endpoint VARCHAR(255) NOT NULL
ip VARCHAR(45) NOT NULL
status_code INT NOT NULL
response_time_ms DECIMAL(10,2) NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


Relación con users(id) con ON DELETE SET NULL.

Indexes para consultas rápidas: user_id, email, endpoint, created_at.

Cron job borra registros > 90 días automáticamente.

🔒 Seguridad

JWT:

Generado en login con duración configurable (JWT_EXPIRES_IN en .env).

Validado en requireAuth.

bcrypt: Hash seguro para contraseñas.

CORS dinámico:

Configurable en .env (CORS_ORIGIN=http://dominio1.com,http://dominio2.com).

Permite llamadas desde orígenes autorizados.

AuditLogger:

Traza cada request (usuario, endpoint, IP, tiempo).

Diferencia entre llamadas públicas (public/anon) y autenticadas.

⚙️ Configuración .env
PORT=3000

# MySQL
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=clave
DB_NAME=totem_banos

# JWT
JWT_SECRET=una_clave_super_segura
JWT_EXPIRES_IN=60m

# CORS
CORS_ORIGIN=http://localhost:3001,http://mantenedor.wit.la

🚀 Flujo de Consumo

Login (/api/auth/login) → Devuelve token JWT.

Frontend guarda el token en sessionStorage o cookie.

Para consumir /api/users o /api/servicios, debe enviarse en headers:

Authorization: Bearer <token>


Todas las llamadas quedan registradas en api_logs.

Los logs se purgan automáticamente cada 90 días vía cron/cleanLogs.js.
# Hi, I'm Katherine! 👋


## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    📄 Informe Técnico – Backend Totem Baños Autoservicio
🏗️ Arquitectura General

Framework: Node.js + Express

Base de datos: MySQL (usando mysql2 con pool de conexiones).

Seguridad:

Autenticación con JWT (JSON Web Token).

Middleware global requireAuth que protege todas las rutas privadas.

bcrypt para hash de contraseñas.

Logs de auditoría:

Middleware auditLogger que registra todas las llamadas a la API (usuario, endpoint, IP, tiempo de respuesta, estado HTTP).

Almacenamiento en tabla api_logs.

Limpieza automática de logs con cron (90 días).

📂 Estructura de Carpetas
src/
 ├── app.js              # Configuración principal de rutas y middlewares
 ├── server.js           # Punto de arranque del servidor
 ├── config/
 │    └── db.js          # Configuración conexión MySQL
 ├── controllers/        # Controladores de negocio
 │    ├── authController.js
 │    ├── userController.js
 │    ├── servicioController.js
 │    └── logController.js
 ├── models/             # Acceso a base de datos
 │    ├── userModel.js
 │    ├── servicioModel.js
 │    └── logModel.js
 ├── routes/             # Definición de endpoints
 │    ├── authRoutes.js
 │    ├── userRoutes.js
 │    ├── servicioRoutes.js
 │    └── logRoutes.js
 ├── middleware/         
 │    ├── auditLogger.js # Middleware de auditoría
 │    └── requireAuth.js # Middleware de autenticación con JWT
 └── cron/
      └── cleanLogs.js   # Tarea programada para limpieza de logs (cada 90 días)

📑 Endpoints Disponibles
🔐 Autenticación (/api/auth)

POST /login → Inicia sesión con email y password, retorna JWT.

POST /register → Crea nuevo usuario (solo accesible con admin si lo restringes).

GET /me → Retorna información del usuario autenticado.

👤 Usuarios (/api/users) (requiere JWT)

GET / → Lista todos los usuarios.

GET /:id → Obtiene un usuario por ID.

PUT /:id → Actualiza email, contraseña o rol de un usuario.

DELETE /:id → Elimina un usuario.

⚠️ Todos estos endpoints ya están protegidos globalmente en app.js con requireAuth.

🛁 Servicios (/api/servicios) (requiere JWT)

GET / → Lista todos los servicios.

GET /:id → Obtiene un servicio específico.

POST / → Crea un nuevo servicio (ej. baño, ducha).

PUT /:id → Modifica nombre o precio del servicio.

DELETE /:id → Elimina un servicio.

📊 Logs (/api/logs) (requiere JWT)

GET / → Listado paginado de logs.

Parámetros opcionales: ?page=1&limit=50

Incluye filtros por fecha, endpoint, usuario, etc. (según implementación).


Cron job borra registros > 90 días automáticamente.

🔒 Seguridad

JWT:

Generado en login con duración configurable (JWT_EXPIRES_IN en .env).

Validado en requireAuth.

bcrypt: Hash seguro para contraseñas.

CORS dinámico:

Configurable en .env (CORS_ORIGIN=http://dominio1.com,http://dominio2.com).

Permite llamadas desde orígenes autorizados.

AuditLogger:

Traza cada request (usuario, endpoint, IP, tiempo).

Diferencia entre llamadas públicas (public/anon) y autenticadas.

⚙️ Configuración .env
PORT=3000

# MySQL
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=clave
DB_NAME=totem_banos

# JWT
JWT_SECRET=una_clave_super_segura
JWT_EXPIRES_IN=60m

# CORS
CORS_ORIGIN=http://localhost:3001,http://mantenedor.wit.la

🚀 Flujo de Consumo

Login (/api/auth/login) → Devuelve token JWT.

Frontend guarda el token en sessionStorage o cookie.

Para consumir /api/users o /api/servicios, debe enviarse en headers:

Authorization: Bearer <token>


Todas las llamadas quedan registradas en api_logs.

Los logs se purgan automáticamente cada 90 días vía cron/cleanLogs.js.