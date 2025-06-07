# 📊 Variables de Entorno por Servicio - GPX Rally Management

## 🌐 **FRONTEND (Vercel)**

### Variables Requeridas ✅

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-app.onrender.com
BACKEND_URL=https://your-backend-app.onrender.com
```

### Variables NO Requeridas ❌

```bash
# Estas NO van en Vercel porque el frontend no las usa
GOOGLE_CLIENT_ID=...          # Solo backend
GOOGLE_CLIENT_SECRET=...      # Solo backend
JWT_SECRET=...               # Solo backend
DATABASE_URL=...             # Solo backend
```

## ☁️ **BACKEND (Render)**

### Variables Requeridas ✅

```bash
# Base de datos
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT
JWT_SECRET=your-super-secure-256-bit-secret

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Spring Boot
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=8080

# CORS
ALLOWED_ORIGINS=https://your-app.vercel.app
```

## 🔄 **Flujo de Autenticación en tu App:**

1. **Usuario hace clic en "Login con Google"** → Frontend
2. **Frontend solicita URL de login** → `GET /api/users/oauth2/login-url`
3. **Backend genera URL con Client ID** → Spring Boot + Google OAuth2
4. **Usuario es redirigido a Google** → Google maneja todo
5. **Google redirige al backend** → `POST /api/oauth2/callback/google`
6. **Backend procesa y genera JWT** → Spring Security + JWT
7. **Backend redirige al frontend con token** → URL con parámetros
8. **Frontend guarda token** → localStorage

## 🎯 **¿Por qué el frontend NO necesita las credenciales de Google?**

- El **frontend nunca habla directamente con Google**
- Todo el OAuth2 flow lo maneja el **backend**
- El frontend solo:
  - Solicita la URL de login al backend
  - Recibe el JWT token del backend
  - Usa el token para hacer requests autenticados

## 📝 **Configuración Mínima para Despliegue:**

### Vercel (Frontend)

```bash
vercel env add NEXT_PUBLIC_BACKEND_URL production
# Valor: https://your-backend.onrender.com

vercel env add BACKEND_URL production
# Valor: https://your-backend.onrender.com
```

### Render (Backend)

```bash
# Todas las otras variables van aquí:
DATABASE_URL=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SPRING_PROFILES_ACTIVE=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

## 🔐 **Google Cloud Console Configuration:**

```
Authorized JavaScript origins:
- https://your-backend.onrender.com (NO el frontend)

Authorized redirect URIs:
- https://your-backend.onrender.com/api/oauth2/callback/google
```

**Nota importante:** Los redirect URIs apuntan al BACKEND, no al frontend.
