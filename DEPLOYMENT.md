# 🚀 Guía de Despliegue - GPX Rally Management

Esta guía detalla el proceso completo para desplegar la aplicación GPX Rally Management en producción usando **Vercel** para el frontend y **Render** para el backend.

## 📋 Pre-requisitos

- [ ] Cuenta en [Vercel](https://vercel.com)
- [ ] Cuenta en [Render](https://render.com)
- [ ] Proyecto Google Cloud con OAuth2 configurado
- [ ] Repositorio Git con el código del proyecto

## 🔧 1. Preparación del Backend (Render)

### Configuración de la Base de Datos

1. En Render Dashboard, crear un **PostgreSQL Database**:
   - Name: `gpx-rally-db`
   - User: `gpx_user`
   - Database Name: `gpx_rally`
2. Copiar la **Internal Database URL** (formato: `postgresql://user:pass@host:port/db`)

### Configuración del Web Service

1. Crear un **Web Service** en Render:

   - **Repository**: Conectar tu repositorio del backend
   - **Branch**: `main`
   - **Root Directory**: `backend` (si está en subdirectorio)
   - **Environment**: `Docker` o `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/gpx-rally-backend.jar`

2. **Variables de Entorno del Backend**:

   ```env
   # Base de datos
   DATABASE_URL=postgresql://user:pass@host:port/db

   # JWT y Seguridad
   JWT_SECRET=tu-jwt-secret-super-seguro-minimo-256-bits

   # Google OAuth2
   GOOGLE_CLIENT_ID=tu-google-client-id
   GOOGLE_CLIENT_SECRET=tu-google-client-secret

   # Spring Boot
   SPRING_PROFILES_ACTIVE=production
   SERVER_PORT=8080

   # CORS (importante)
   ALLOWED_ORIGINS=https://tu-app.vercel.app,https://tu-dominio.com
   ```

3. **Configurar Dominio Personalizado** (opcional):
   - Settings > Custom Domains
   - Agregar: `api.tu-dominio.com`

## 🌐 2. Preparación del Frontend (Vercel)

### Configuración Local

1. **Actualizar variables de entorno locales**:

   ```bash
   # .env.local
   NEXT_PUBLIC_BACKEND_URL=https://tu-backend.onrender.com
   BACKEND_URL=https://tu-backend.onrender.com
   ```

2. **Verificar configuración**:

   ```bash
   # Windows
   .\deploy-check.ps1

   # Unix/Mac
   ./deploy-check.sh
   ```

### Despliegue en Vercel

1. **Instalar Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Configurar variables de entorno**:

   ```bash
   vercel env add NEXT_PUBLIC_BACKEND_URL production
   # Valor: https://tu-backend.onrender.com

   vercel env add BACKEND_URL production
   # Valor: https://tu-backend.onrender.com
   ```

3. **Desplegar**:
   ```bash
   vercel --prod
   ```

## 🔐 3. Configuración de Google OAuth2

### Console de Google Cloud

1. **Ir a [Google Cloud Console](https://console.cloud.google.com/)**

2. **APIs & Services > Credentials**

3. **Configurar OAuth 2.0 Client**:

   - **Authorized JavaScript origins**:

     ```
     https://tu-app.vercel.app
     https://tu-dominio.com (si tienes dominio personalizado)
     ```

   - **Authorized redirect URIs**:
     ```
     https://tu-backend.onrender.com/api/oauth2/callback/google
     https://tu-app.vercel.app/api/auth/callback/google
     ```

## 🛡️ 4. Configuración de Seguridad (Backend)

### CORS Configuration

Actualizar el archivo `CorsConfig.java`:

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // URLs permitidas - ACTUALIZAR CON TUS DOMINIOS
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "https://*.vercel.app",              // Vercel deployments
            "https://tu-dominio.com",            // Tu dominio personalizado
            "https://api.tu-dominio.com",        // Backend personalizado
            "http://localhost:3000"              // Solo desarrollo
        ));

        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Security Headers

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .frameOptions().deny()
                .contentTypeOptions().and()
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubdomains(true)
                    .preload(true)
                )
                .addHeaderWriter(new StaticHeadersWriter("X-Content-Type-Options", "nosniff"))
                .addHeaderWriter(new StaticHeadersWriter("X-Frame-Options", "DENY"))
                .addHeaderWriter(new StaticHeadersWriter("X-XSS-Protection", "1; mode=block"))
            );

        return http.build();
    }
}
```

## 🔍 5. Verificación Post-Despliegue

### Checklist de Verificación

- [ ] **Backend en Render**:
  - [ ] Servicio ejecutándose sin errores
  - [ ] Base de datos conectada correctamente
  - [ ] Logs sin errores de CORS
  - [ ] Endpoint `/api/health` responde 200
- [ ] **Frontend en Vercel**:
  - [ ] Aplicación carga correctamente
  - [ ] Variables de entorno configuradas
  - [ ] Login con Google funciona
  - [ ] APIs del backend responden correctamente
- [ ] **OAuth2**:
  - [ ] Redirect URIs configurados en Google
  - [ ] Login/logout funciona en producción
  - [ ] Tokens JWT se generan correctamente

### URLs de Prueba

```bash
# Backend Health Check
curl https://tu-backend.onrender.com/api/health

# Frontend
curl https://tu-app.vercel.app

# API Test
curl https://tu-backend.onrender.com/api/events/current
```

## 🐛 6. Troubleshooting Común

### Error: No Next.js version detected

```
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies"
```

**Solución**:

1. Verificar que `package.json` tenga Next.js con versión específica:
   ```json
   {
     "dependencies": {
       "next": "^14.2.0" // No usar "latest"
     }
   }
   ```
2. Asegurar que no hay dependencias problemáticas como `"landing-page": "file:"`
3. Reinstalar dependencias:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

### Error de CORS

```
Access to fetch at 'https://backend...' from origin 'https://frontend...' has been blocked by CORS policy
```

**Solución**: Verificar configuración de `allowedOriginPatterns` en `CorsConfig.java`

### OAuth2 Redirect Mismatch

```
Error 400: redirect_uri_mismatch
```

**Solución**: Verificar URIs en Google Cloud Console

### Variables de Entorno No Disponibles

```
TypeError: Cannot read property 'NEXT_PUBLIC_BACKEND_URL' of undefined
```

**Solución**: Verificar que las variables estén configuradas en Vercel Dashboard

### Database Connection Error

```
Unable to acquire JDBC Connection
```

**Solución**: Verificar `DATABASE_URL` y conexión a PostgreSQL

### Build Failures

```
Module not found: Can't resolve '@/components/...'
```

**Solución**: Verificar `tsconfig.json` y paths configuration

## 📊 7. Monitoreo y Mantenimiento

### Vercel Analytics

- Habilitar en Vercel Dashboard > Analytics
- Monitorear Core Web Vitals
- Revisar errores de runtime

### Render Monitoring

- Configurar Health Checks
- Alertas por email/Slack
- Monitoreo de CPU/Memory

### Logs

```bash
# Vercel logs
vercel logs --follow

# Render logs
# Ver en Dashboard > Logs tab
```

## 🔄 8. Actualizaciones y CI/CD

### GitHub Actions (Automático)

El workflow `.github/workflows/deploy-vercel.yml` despliega automáticamente en cada push a `main`.

### Manual

```bash
# Actualizar frontend
vercel --prod

# Backend se actualiza automáticamente con git push
```

---

**⚠️ Importante**: Mantener todos los secrets y variables de entorno seguras. Nunca commitear archivos `.env` con valores reales.
