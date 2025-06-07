#!/bin/bash

# Script de despliegue para GPX Rally Management
# Este script configura las variables de entorno para producción

echo "🚀 Configurando GPX Rally Management para despliegue..."

# Verificar que las variables requeridas estén definidas
required_vars=(
  "NEXT_PUBLIC_BACKEND_URL"
  "NEXT_PUBLIC_GOOGLE_CLIENT_ID"
  "NEXTAUTH_SECRET"
)

missing_vars=()

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
  echo "❌ Error: Las siguientes variables de entorno son requeridas:"
  printf '%s\n' "${missing_vars[@]}"
  echo ""
  echo "Por favor, configúralas antes de continuar:"
  echo "export NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com"
  echo "export NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id"
  echo "export NEXTAUTH_SECRET=your_secret_key"
  exit 1
fi

echo "✅ Variables de entorno verificadas"
echo "🔗 Backend URL: $NEXT_PUBLIC_BACKEND_URL"
echo "🔑 Google Client ID: $NEXT_PUBLIC_GOOGLE_CLIENT_ID"

# Construir la aplicación
echo "🏗️  Construyendo aplicación..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build completado exitosamente"
  echo "🚀 Listo para desplegar en Vercel"
else
  echo "❌ Error en el build"
  exit 1
fi
