# FacTur - Expense Tracking App

Aplicación fullstack para control de gastos y facturación.

## Tecnologías

### Backend
- **Node.js** con **Express v5**
- **MySQL** con mysql2
- **JWT** para autenticación
- **bcryptjs** para hashing de contraseñas

### Frontend
- **React Native** (Expo SDK 54)
- **React Navigation v7**
- **Axios** para peticiones HTTP
- **AsyncStorage** para persistencia local

## Estructura del Proyecto

```
esteban/
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── config/       # Configuración de base de datos
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/    # Autenticación JWT
│   │   ├── models/       # Modelos User y Expense
│   │   ├── routes/       # Rutas de API
│   │   └── index.js      # Entry point
│   ├── .env              # Variables de entorno (no subir a git)
│   └── package.json
├── frontend/             # App React Native (Expo)
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── navigation/   # Configuración de navegación
│   │   ├── screens/      # Pantallas de la app
│   │   └── services/     # Servicios API
│   ├── app.json
│   └── package.json
├── .gitignore
├── CLAUDE.md
└── README.md
```

## Requisitos Previos

- Node.js 18+
- MySQL 8+
- Expo Go (para probar en móvil)
- npm o yarn

## Instalación y Ejecución

### 1. Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en `backend/` con las variables:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=factur_db
JWT_SECRET=tu_secret_jwt
JWT_EXPIRES_IN=7d
```

Iniciar el servidor:

```bash
npm start
```

### 2. Frontend

```bash
cd frontend
npm install
```

Ejecutar en desarrollo:

```bash
npm start
```

### 3. Base de Datos

Crear la base de datos MySQL:

```sql
CREATE DATABASE factur_db;
```

Las tablas se crean automáticamente via los modelos.

## Comandos Disponibles

### Backend
```bash
cd backend
npm start          # Ejecutar servidor
```

### Frontend
```bash
cd frontend
npm start          # Servidor Expo (muestra QR)
npm run android     # Abrir en Android
npm run ios         # Abrir en iOS
npm run web         # Versión web
```

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión (retorna JWT) |
| GET | /api/expenses | Listar gastos (protegido) |
| POST | /api/expenses | Crear gasto (protegido) |

## Notas

- El backend corre en `http://localhost:3000`
- El frontend se conecta automáticamente al backend
- JWT se guarda en AsyncStorage del dispositivo

## Schema de Base de Datos

El archivo `backend/sql/schema.sql` contiene las tablas necesarias:

```sql
CREATE DATABASE factur_db;
USE factur_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## Autor

Desarrollado por **yersonITFIP**
