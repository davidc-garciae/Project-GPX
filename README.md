# 🏁 gpx Rally Management System

Sistema integral de gestión de rally raids y competencias off-road desarrollado con Next.js y Spring Boot. Plataforma completa para la organización, administración y seguimiento de eventos de rally, desde la inscripción de participantes hasta la gestión de resultados y clasificaciones.

## 🚀 Características Principales

### 🏛️ Panel de Administración

- **Gestión completa de eventos**: Creación, edición y administración de rally raids
- **Gestión de etapas**: Configuración detallada de cada etapa con distancias, dificultad y puntos de control
- **Sistema de resultados**: Registro y seguimiento de tiempos, posiciones y clasificaciones
- **Gestión de penalizaciones**: Sistema flexible de sanciones y descuentos por diversas infracciones
- **Administración de participantes**: Control total de inscripciones y datos de competidores

### 🏍️ Gestión de Vehículos

- **Categorías múltiples**: Soporte para motos, UTVs, carros y vehículos especializados
- **Registro detallado**: Información técnica completa de cada vehículo
- **Validación de elegibilidad**: Verificación automática de requisitos por categoría
- **Historial de participación**: Seguimiento del rendimiento histórico

### 👤 Perfil de Usuario

- **Información personal completa**: Datos del piloto y copiloto
- **Información médica**: Alergias, medicamentos y condiciones especiales
- **Contactos de emergencia**: Sistema completo de contactos para situaciones críticas
- **Gestión de documentos**: Carga y validación de licencias, seguros y documentación requerida

### 🏆 Sistema de Competencias

- **Clasificaciones en tiempo real**: Rankings actualizados por etapa y general
- **Sistema de puntuación**: Cálculo automático de puntos y posiciones
- **Gestión de premios**: Configuración de categorías ganadoras y reconocimientos
- **Reportes detallados**: Análisis completo de rendimiento y estadísticas

## 🛠️ Arquitectura Técnica

### Frontend (Next.js)

```
├── 🎨 UI/UX Moderno
│   ├── Next.js 14 con App Router
│   ├── TypeScript para tipado estático
│   ├── Tailwind CSS para estilos responsivos
│   └── Radix UI para componentes accesibles
│
├── 🔐 Autenticación & Seguridad
│   ├── JWT para sesiones seguras
│   ├── OAuth2 con Google
│   ├── Contextos de autenticación
│   └── Protección de rutas por roles
│
└── 🏗️ Atomic Design
    ├── Átomos: Botones, inputs, iconos
    ├── Moléculas: Cards, formularios, selectores
    └── Organismos: Tablas, headers, sidebars
```

### Backend (Spring Boot)

```
├── ☕ API REST Robusta
│   ├── Spring Boot 3.x
│   ├── Spring Security para autenticación
│   ├── JPA/Hibernate para ORM
│   └── PostgreSQL como base de datos
│
├── 🔒 Seguridad & Autorización
│   ├── JWT con refresh tokens
│   ├── OAuth2 integrado
│   ├── Roles y permisos granulares
│   └── Validación de entrada robusta
│
└── 📊 Gestión de Datos
    ├── Entidades relacionales complejas
    ├── Transacciones ACID
    ├── Auditoría de cambios
    └── Respaldos automáticos
```

## 🎯 Roles de Usuario

### 👨‍💼 Administrador

- Gestión completa de eventos y etapas
- Administración de participantes y vehículos
- Control de resultados y penalizaciones
- Generación de reportes y estadísticas
- Configuración del sistema

### 🏁 Participante

- Inscripción a eventos disponibles
- Gestión de perfil y vehículos
- Consulta de resultados y clasificaciones
- Carga de documentación requerida
- Seguimiento de historial competitivo

## 🔧 Instalación y Configuración

### Prerrequisitos

- **Node.js** v18 o superior
- **Java** 17 o superior
- **PostgreSQL** 13 o superior
- **pnpm** (recomendado) o npm

### Frontend

```bash
# Clonar el repositorio
git clone <repository-url>
cd gpx-rally-management

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar en desarrollo
pnpm dev
```

### Backend

```bash
# Navegar al directorio del backend
cd backend

# Configurar base de datos en application.yml
# Compilar y ejecutar
./mvnw spring-boot:run
```

### Variables de Entorno

```env
# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_google_client_id
NEXTAUTH_SECRET=tu_secret_key
NEXTAUTH_URL=http://localhost:3000

# Backend
DATABASE_URL=postgresql://localhost:5432/gpx_rally
JWT_SECRET=tu_jwt_secret
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

## 🚀 Despliegue en Producción

### Vercel (Frontend) + Render (Backend)

Esta es la configuración recomendada para el despliegue del sistema gpx Rally Management.

#### 📦 Preparación del Backend (Render)

1. **Crear servicio en Render**:

   - Conecta tu repositorio del backend
   - Selecciona "Web Service"
   - Configura el build command: `./mvnw clean package -DskipTests`
   - Configura el start command: `java -jar target/gpx-rally-backend.jar`

2. **Variables de entorno en Render**:

   ```env
   DATABASE_URL=postgresql://your-db-host:5432/your-db-name
   JWT_SECRET=your-super-secure-jwt-secret
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   SPRING_PROFILES_ACTIVE=production
   ```

3. **Base de datos PostgreSQL**:
   - Crear una base de datos PostgreSQL en Render
   - Copiar la URL de conexión interna
   - Configurar en `DATABASE_URL`

#### 🌐 Preparación del Frontend (Vercel)

1. **Instalar Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Configurar variables de entorno en Vercel**:

   ```bash
   vercel env add NEXT_PUBLIC_BACKEND_URL
   # Valor: https://gpx-back.onrender.com

   vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID
   # Valor: tu_google_client_id

   vercel env add NEXTAUTH_SECRET
   # Valor: tu_secret_super_seguro

   vercel env add NEXTAUTH_URL
   # Valor: https://your-app.vercel.app
   ```

3. **Desplegar**:
   ```bash
   vercel --prod
   ```

#### 🔧 Script de Verificación Pre-Despliegue

Ejecuta este script antes del despliegue para verificar la configuración:

```bash
# En Windows (PowerShell)
.\deploy-check.ps1

# En Unix/Mac
./deploy-check.sh
```

#### ⚠️ Consideraciones Importantes

**CORS Configuration (Backend)**:

```java
@Configuration
@EnableWebSecurity
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "https://*.vercel.app",
            "https://your-domain.com",
            "http://localhost:3000" // Solo para desarrollo
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

**OAuth2 Redirect URIs**:
Configurar en Google Cloud Console:

```
https://gpx-back.onrender.com/api/oauth2/callback/google
https://your-app.vercel.app/api/auth/callback/google
```

**Environment Variables Security**:

- Nunca commitear archivos `.env` con valores reales
- Usar secrets seguros para JWT y OAuth2
- Rotar secrets regularmente

#### 🔍 Monitoreo y Logs

**Vercel**:

```bash
vercel logs --follow
```

**Render**:

- Ver logs en tiempo real desde el dashboard
- Configurar alertas de salud del servicio

#### 🐛 Troubleshooting Común

1. **Error de CORS**: Verificar configuración de dominios permitidos
2. **OAuth2 Redirect Mismatch**: Validar URIs en Google Console
3. **Database Connection**: Verificar URL y credenciales de PostgreSQL
4. **Environment Variables**: Confirmar que todas las vars estén configuradas
5. **Build Failures**: Revisar dependencias y versiones de Node.js/Java

## 📱 Uso del Sistema

### Para Administradores

1. **Acceso**: Iniciar sesión con credenciales de administrador
2. **Crear Evento**: Configurar nuevo rally con etapas y requisitos
3. **Gestionar Inscripciones**: Aprobar participantes y verificar documentación
4. **Seguimiento en Vivo**: Actualizar resultados y gestionar penalizaciones
5. **Generar Reportes**: Exportar clasificaciones y estadísticas

### Para Participantes

1. **Registro**: Crear cuenta y completar perfil
2. **Inscripción**: Seleccionar evento y categoría de vehículo
3. **Documentación**: Cargar licencias, seguros y documentos requeridos
4. **Competencia**: Seguir resultados y clasificaciones en tiempo real
5. **Historial**: Consultar participaciones anteriores y estadísticas

## 📊 Características Técnicas Avanzadas

### 🔍 Monitoreo y Análisis

- Dashboard de métricas en tiempo real
- Análisis de rendimiento por etapa
- Estadísticas históricas de participantes
- Reportes personalizables en PDF/Excel

### 🌐 Escalabilidad

- Arquitectura de microservicios preparada
- Cache inteligente con Redis
- Optimización de consultas SQL
- CDN para contenido estático

### 📱 Responsive Design

- Interfaz adaptativa para móviles y tablets
- PWA (Progressive Web App) ready
- Modo offline para consultas básicas
- Sincronización automática

## 🛡️ Seguridad

- **Autenticación multifactor** opcional
- **Encriptación** de datos sensibles
- **Auditoría completa** de acciones
- **Backup automático** de base de datos
- **Validación estricta** de entrada de datos

## 🎨 Diseño y UX

- **Tema claro/oscuro** automático
- **Animaciones fluidas** con Framer Motion
- **Feedback visual** inmediato en todas las acciones
- **Navegación intuitiva** con breadcrumbs
- **Accesibilidad WCAG 2.1** compliant

## 📈 Roadmap Futuro

- [ ] Integración con dispositivos GPS en tiempo real
- [ ] Sistema de notificaciones push
- [ ] API pública para terceros
- [ ] Aplicación móvil nativa
- [ ] Integración con redes sociales
- [ ] Sistema de streaming en vivo

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:

- 📧 Email: soporte@gpxrally.com
- 📱 WhatsApp: +XX XXX XXX XXXX
- 🌐 Web: [www.gpxrally.com](https://gpxrally.com)

## 🚀 Despliegue en Producción

### 🌐 Frontend en Vercel

#### Configuración Inicial

1. **Conectar repositorio** en [Vercel Dashboard](https://vercel.com/dashboard)
2. **Configurar variables de entorno** en Vercel:

```bash
# Variables requeridas en Vercel
NEXT_PUBLIC_BACKEND_URL=https://gpx-back.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://your-app.vercel.app
BACKEND_URL=https://gpx-back.onrender.com
```

#### Comandos de Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y configurar proyecto
vercel login
vercel --prod

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_BACKEND_URL
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add BACKEND_URL
```

### ☁️ Backend en Render

#### Configuración del Servicio

1. **Crear nuevo Web Service** en [Render Dashboard](https://dashboard.render.com)
2. **Conectar repositorio** del backend Spring Boot
3. **Configurar Build Command**: `./mvnw clean package -DskipTests`
4. **Configurar Start Command**: `java -jar target/gpx-rally-backend.jar`

#### Variables de Entorno para Render

```bash
# Base de datos PostgreSQL
DATABASE_URL=postgresql://user:password@hostname:port/database
SPRING_DATASOURCE_URL=${DATABASE_URL}
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password

# JWT y Seguridad
JWT_SECRET=your_jwt_secret_256_bits
JWT_EXPIRATION=86400000

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://gpx-back.onrender.com/oauth2/callback/google

# Configuración de aplicación
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
ALLOWED_ORIGINS=https://your-frontend-app.vercel.app

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-frontend-app.vercel.app
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=*
```

### 🗄️ Base de Datos PostgreSQL

#### Opción 1: Render PostgreSQL

```bash
# Crear base de datos en Render
# 1. New > PostgreSQL
# 2. Configurar nombre: gpx-rally-db
# 3. Copiar DATABASE_URL generada
```

#### Opción 2: Railway PostgreSQL

```bash
# Alternativa más económica
# 1. Crear proyecto en Railway
# 2. Add PostgreSQL
# 3. Configurar variables de entorno
```

### 🔧 Checklist de Despliegue

#### ✅ Pre-despliegue

- [ ] **Variables hardcodeadas eliminadas** (localhost:8080)
- [ ] **Variables de entorno configuradas** (.env.example como referencia)
- [ ] **Google OAuth2 configurado** con dominios de producción
- [ ] **CORS configurado** en backend para dominio de Vercel
- [ ] **Base de datos PostgreSQL** creada y configurada

#### ✅ Verificación Post-despliegue

- [ ] **Frontend carga correctamente** en dominio de Vercel
- [ ] **API responde** desde dominio de Render
- [ ] **Autenticación Google funciona** con URLs de producción
- [ ] **Base de datos conecta** y migraciones aplicadas
- [ ] **Subida de archivos funciona** (imágenes de perfil/eventos)

### 🔍 Troubleshooting Común

#### Error de CORS

```javascript
// En backend Spring Boot - CorsConfig.java
@CrossOrigin(origins = {"https://your-app.vercel.app"})
```

#### Error OAuth2 Redirect

```bash
# Verificar en Google Console:
# Authorized redirect URIs:
# https://your-backend.onrender.com/oauth2/callback/google
```

#### Error de Variables de Entorno

```bash
# Verificar en Vercel
vercel env ls

# Verificar en Render
# Dashboard > Service > Environment
```

#### Error de Base de Datos

```bash
# Verificar conexión
# En Render logs buscar:
# "Connected to PostgreSQL database"
```

### 📊 Monitoreo de Producción

#### Logs de Vercel

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de build
vercel logs --build
```

#### Logs de Render

```bash
# En Render Dashboard:
# Service > Logs (tiempo real)
# Events > Deploy logs
```

### 🔄 CI/CD Automático

#### GitHub Actions para Vercel

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

---

**Desarrollado con ❤️ para la comunidad de rally raids y competencias off-road**
