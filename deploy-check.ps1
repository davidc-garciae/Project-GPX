# PowerShell script para verificar configuración de despliegue
# GPX Rally Management - Deploy Check

Write-Host "🚀 Verificando configuración para despliegue..." -ForegroundColor Green

# Variables requeridas para producción
$requiredVars = @(
    "NEXT_PUBLIC_BACKEND_URL",
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID", 
    "NEXTAUTH_SECRET"
)

$missingVars = @()

Write-Host "🔍 Verificando variables de entorno..." -ForegroundColor Yellow

foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if ([string]::IsNullOrEmpty($value)) {
        $missingVars += $var
        Write-Host "❌ $var - NO CONFIGURADA" -ForegroundColor Red
    } else {
        Write-Host "✅ $var - CONFIGURADA" -ForegroundColor Green
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "`n❌ Error: Variables de entorno faltantes:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    
    Write-Host "`n💡 Configurar con:" -ForegroundColor Yellow
    Write-Host 'Set-Item -Path "env:NEXT_PUBLIC_BACKEND_URL" -Value "https://your-backend.onrender.com"' -ForegroundColor Cyan
    Write-Host 'Set-Item -Path "env:NEXT_PUBLIC_GOOGLE_CLIENT_ID" -Value "your_google_client_id"' -ForegroundColor Cyan
    Write-Host 'Set-Item -Path "env:NEXTAUTH_SECRET" -Value "your_secret_key"' -ForegroundColor Cyan
    
    exit 1
}

Write-Host "`n🔗 Verificando URLs..." -ForegroundColor Yellow

# Verificar que no sean localhost
$backendUrl = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_BACKEND_URL")
if ($backendUrl -like "*localhost*") {
    Write-Host "⚠️  ADVERTENCIA: Backend URL contiene 'localhost'" -ForegroundColor Yellow
    Write-Host "   Actual: $backendUrl" -ForegroundColor Yellow
    Write-Host "   Debe ser: https://your-backend.onrender.com" -ForegroundColor Cyan
}

# Verificar archivos críticos
Write-Host "`n📁 Verificando archivos..." -ForegroundColor Yellow

$criticalFiles = @(
    "package.json",
    "next.config.js", 
    "vercel.json",
    ".env.example"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file - EXISTE" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - NO ENCONTRADO" -ForegroundColor Red
    }
}

# Verificar dependencias
Write-Host "`n📦 Verificando dependencias..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "✅ node_modules - EXISTE" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules no encontrado. Ejecutar: pnpm install" -ForegroundColor Yellow
}

# Intentar build
Write-Host "`n🏗️  Intentando build..." -ForegroundColor Yellow

try {
    $buildResult = & pnpm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build exitoso" -ForegroundColor Green
        Write-Host "🚀 Listo para desplegar en Vercel" -ForegroundColor Green
    } else {
        Write-Host "❌ Error en build:" -ForegroundColor Red
        Write-Host $buildResult -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error ejecutando build: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📋 Siguiente pasos para despliegue:" -ForegroundColor Cyan
Write-Host "1. Subir backend a Render con PostgreSQL" -ForegroundColor White
Write-Host "2. Configurar variables de entorno en Vercel" -ForegroundColor White  
Write-Host "3. Conectar repositorio a Vercel" -ForegroundColor White
Write-Host "4. Verificar CORS en backend para dominio de Vercel" -ForegroundColor White
Write-Host "5. Configurar Google OAuth2 con URLs de producción" -ForegroundColor White
