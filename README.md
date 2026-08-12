# Proyecto La Martina 🏡✨

La Martina es una plataforma integral para la gestión de Peticiones, Quejas, Reclamos y Sugerencias (PQRS), así como la programación de servicios de mantenimiento (Rutas) para conjuntos residenciales. Está construida como un monorepo utilizando **Turborepo**, **Next.js**, **Express**, y **PostgreSQL**.

## Arquitectura del Proyecto (Monorepo)

El proyecto está dividido en aplicaciones (apps) y paquetes compartidos (packages):

- `apps/web`: Frontend construido con **Next.js**, React, y Tailwind CSS. Contiene:
  - Portal Administrativo (`/admin/*`)
  - App Móvil (PWA) para Operarios (`/operario/*`)
  - Landing Page Pública (`/` y `/trabaja-con-nosotros`)
- `apps/api`: Backend construido con **Node.js**, **Express**, y **TypeORM**.
- `packages/shared` (opcional): Lógica compartida, tipos y utilidades entre frontend y backend.

---

## 🚀 Requisitos Previos

1. **Node.js** (v18 o superior)
2. **pnpm** (Gestor de paquetes recomendado para Turborepo)
3. **PostgreSQL** (Base de datos)
4. Cuenta en **Cloudinary** (Para subida de imágenes y evidencias)

---

## 🛠️ Instalación y Configuración

1. **Clonar e instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example` (si existe), o configura las siguientes variables clave:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=lamartina

   # JWT
   JWT_SECRET=tu_secreto_super_seguro
   JWT_EXPIRES_IN=7d

   # Cloudinary (Para fotos)
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

---

## 🌱 Seeder (Población de Datos Base)

Para poder iniciar sesión por primera vez y tener datos de prueba (como Conjuntos y Operarios), hemos preparado un Seeder que crea los datos base necesarios.

### ¿Cómo ejecutar el Seeder?

Asegúrate de que tu base de datos PostgreSQL esté corriendo y el `.env` esté configurado.

1. Navega a la carpeta de la API:
   ```bash
   cd apps/api
   ```
2. Ejecuta el comando de seeding:
   ```bash
   pnpm seed
   ```

### ¿Qué hace el Seeder?
El seeder limpiará y creará:
- **Roles y Usuarios por defecto:**
  - **Administrador:** `admin@lamartina.com` (Contraseña: `admin123`)
  - **Operario de prueba:** `operario@lamartina.com` (Contraseña: `operario123`)
- **Conjuntos / Proyectos:**
  - "Reserva de la Colina"
  - "Bosques de San Juan"
  - "Torres del Parque"

Una vez ejecutado el seeder, podrás ir a `http://localhost:3000/login` e ingresar con las credenciales del administrador.

---

## 💻 Ejecución en Desarrollo

Para levantar tanto el Frontend como el Backend simultáneamente con Hot-Reloading:

Desde la raíz del proyecto (donde está el `package.json` principal), ejecuta:
```bash
pnpm dev
```

Esto iniciará:
- **Frontend (Web):** http://localhost:3000
- **Backend (API):** http://localhost:3001

## 🔒 Autenticación y Seguridad

El proyecto utiliza un modelo seguro de autenticación por **JWT almacenado en Cookies HttpOnly**.
- Esto previene ataques XSS, ya que las credenciales no son accesibles desde JavaScript en el navegador.
- Al hacer login, el servidor envía un encabezado `Set-Cookie`.
- Todas las peticiones subsecuentes de la app web a la API utilizan `credentials: 'include'` para enviar la cookie de manera silenciosa.

---

## 📱 Roles de Usuario

El sistema soporta distintos tipos de usuario:
1. **SUPER_ADMIN / ADMIN:** Tiene acceso al portal de escritorio (`/admin`) para gestionar conjuntos, asignar PQR's, programar rutas de mantenimiento y gestionar usuarios.
2. **OPERARIO:** Tiene acceso a la versión "Mobile-First" (`/operario`). Puede ver su ruta del día, registrar su ubicación, iniciar labores, subir fotos de evidencia mediante la cámara del celular y finalizar jornadas.
3. **CLIENTE:** Residentes de los conjuntos que pueden enviar sus peticiones (PQR) a través de los portales designados.
