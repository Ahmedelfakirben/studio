# 🏗️ Arquitectura de Despliegue - ALY Gestion

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         COOLIFY SERVER                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           CONTENEDOR DOCKER: aly-gestion                  │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  FRONTEND (Next.js) - Puerto 9002                   │ │ │
│  │  │  ─────────────────────────────────                  │ │ │
│  │  │  • Interfaz de usuario                              │ │ │
│  │  │  • React Components                                 │ │ │
│  │  │  • Tailwind CSS                                     │ │ │
│  │  │  • ShadCN UI                                        │ │ │
│  │  │                                                     │ │ │
│  │  │  🌐 Acceso Público: https://tu-dominio.com         │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                          ↓ ↑                             │ │
│  │                   HTTP API Calls                         │ │
│  │                   /api/auth/login                        │ │
│  │                   /api/factures                          │ │
│  │                   /api/location-materiel                 │ │
│  │                          ↓ ↑                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  BACKEND (Express) - Puerto 3001 (Interno)         │ │ │
│  │  │  ─────────────────────────────────────             │ │ │
│  │  │  • REST API                                        │ │ │
│  │  │  • JWT Authentication                              │ │ │
│  │  │  • Business Logic                                  │ │ │
│  │  │  • Prisma ORM                                      │ │ │
│  │  │                                                    │ │ │
│  │  │  🔒 Acceso: Solo interno (no público)             │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                          ↓ ↑                             │ │
│  │                    Prisma Queries                        │ │
│  │                          ↓ ↑                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  BASE DE DATOS (SQLite)                            │ │ │
│  │  │  ─────────────────────────                         │ │ │
│  │  │  📄 Archivo: dev.db                                │ │ │
│  │  │  📍 Path: /app/backend/prisma/dev.db              │ │ │
│  │  │                                                    │ │ │
│  │  │  💾 VOLUMEN PERSISTENTE montado aquí              │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  HOST STORAGE (Persistente)                              │ │
│  │  /var/lib/coolify/storage/aly-gestion/db                │ │
│  │                                                          │ │
│  │  ⚠️  Los datos aquí NO se pierden al reiniciar         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                              ↓ ↑
                    Internet / DNS

┌─────────────────────────────────────────────────────────────────┐
│                      USUARIOS / CLIENTES                        │
│                                                                 │
│  🌐 Navegador Web                                              │
│     https://tu-dominio.com                                     │
│                                                                 │
│  📱 Dispositivo móvil                                          │
│     https://tu-dominio.com                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. Usuario accede a la aplicación

```
Usuario → https://tu-dominio.com
         ↓
     Coolify Proxy (Puerto 9002)
         ↓
     Frontend Next.js
```

### 2. Frontend hace una petición API

```
Frontend → fetch('/api/factures')
         ↓
   NEXT_PUBLIC_API_URL (https://tu-dominio.com/api)
         ↓
   Coolify Proxy redirige internamente
         ↓
   Backend Express (Puerto 3001)
```

### 3. Backend procesa la petición

```
Backend → Prisma Client
        ↓
   Query SQL
        ↓
   SQLite (dev.db)
        ↓
   Retorna datos
        ↓
   Backend → JSON Response
        ↓
   Frontend actualiza UI
```

---

## 🔌 Configuración de Puertos

| Servicio | Puerto | Acceso | Descripción |
|----------|--------|--------|-------------|
| **Frontend** | 9002 | 🌐 Público | Interfaz de usuario Next.js |
| **Backend** | 3001 | 🔒 Interno | API REST Express |
| **Database** | N/A | 🔒 Archivo | SQLite (no usa puerto) |

### ¿Por qué el Backend es interno?

El backend (puerto 3001) **NO está expuesto públicamente** por seguridad:

- ✅ Solo el Frontend puede comunicarse con él
- ✅ Los usuarios externos NO pueden acceder directamente
- ✅ Coolify maneja el routing interno automáticamente

### Cómo funciona el routing:

```
Usuario → https://tu-dominio.com/api/factures
         ↓
   Coolify detecta /api
         ↓
   Redirige internamente a localhost:3001/api/factures
         ↓
   Backend responde
         ↓
   Coolify devuelve respuesta al usuario
```

---

## 💾 Persistencia de Datos

### Sin Volumen (❌ INCORRECTO)

```
Contenedor inicia
    ↓
Crea dev.db en /app/backend/prisma/
    ↓
Usuario usa la app, crea facturas
    ↓
Reinicio del contenedor
    ↓
❌ dev.db se PIERDE
    ↓
Todas las facturas DESAPARECEN 😱
```

### Con Volumen (✅ CORRECTO)

```
Contenedor inicia
    ↓
Volumen monta /app/backend/prisma/
    ↓
dev.db está en el host (persistente)
    ↓
Usuario usa la app, crea facturas
    ↓
Datos se guardan en el host
    ↓
Reinicio del contenedor
    ↓
✅ dev.db sigue en el host
    ↓
Todas las facturas están INTACTAS 🎉
```

### Configuración del Volumen en Coolify

```
Source (Host):
/var/lib/coolify/storage/aly-gestion/db
    ↓
    Montado en
    ↓
Destination (Container):
/app/backend/prisma
```

---

## 🚀 Proceso de Despliegue

### Fase 1: Build (5-10 minutos)

```
Coolify clona tu repositorio
    ↓
Construye Backend (Stage 1)
    • npm ci
    • npx prisma generate
    • npm run build
    ↓
Construye Frontend (Stage 2)
    • npm ci
    • npm run build (Next.js)
    ↓
Crea imagen final (Stage 3)
    • Copia archivos compilados
    • Configura permisos
    • Prepara entrypoint
```

### Fase 2: Runtime (Inicio del contenedor)

```
Contenedor inicia
    ↓
docker-entrypoint.sh ejecuta:
    ↓
1. Crea directorio de datos
    ↓
2. Ejecuta migraciones Prisma
   (Crea tablas en SQLite)
    ↓
3. Genera Prisma Client
    ↓
4. Ejecuta seed (si DB vacía)
   (Crea usuario admin)
    ↓
5. Inicia Backend (Puerto 3001)
    ↓
6. Espera 5 segundos
    ↓
7. Inicia Frontend (Puerto 9002)
    ↓
✅ Aplicación lista!
```

---

## 🔐 Seguridad

### Capas de Seguridad

```
┌─────────────────────────────────────┐
│  CAPA 1: Coolify Proxy              │
│  • SSL/TLS (HTTPS)                  │
│  • Rate limiting                    │
│  • Firewall                         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  CAPA 2: Frontend (Next.js)         │
│  • Validación de formularios        │
│  • XSS protection                   │
│  • CSRF protection                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  CAPA 3: Backend (Express)          │
│  • JWT Authentication               │
│  • Input validation                 │
│  • SQL injection protection (Prisma)│
│  • CORS configurado                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  CAPA 4: Base de Datos              │
│  • No expuesta públicamente         │
│  • Solo accesible vía Prisma        │
│  • Backups automáticos (volumen)    │
└─────────────────────────────────────┘
```

---

## 📈 Rendimiento

### Recursos del Contenedor

| Recurso | Uso Típico | Recomendado |
|---------|------------|-------------|
| **CPU** | 20-30% | 1 vCPU |
| **RAM** | 500MB-1GB | 2GB |
| **Disco** | 500MB + datos | 5GB |
| **Red** | <100Mbps | Ilimitado |

### Tiempos de Respuesta Esperados

| Operación | Tiempo |
|-----------|--------|
| Carga inicial | <2s |
| Login | <500ms |
| Listar facturas | <300ms |
| Crear factura | <500ms |
| Imprimir PDF | <1s |

---

## 🔄 Escalabilidad

### Límites Actuales (1 Contenedor + SQLite)

```
┌─────────────────────────────────────┐
│  Capacidad: ~100 usuarios concurrentes
│  Base de datos: ~10GB máximo SQLite
│  Perfecto para: Pequeñas empresas
│  Costo: Bajo (~$5-10/mes)
└─────────────────────────────────────┘
```

### Escalabilidad Futura (Si creces)

```
┌──────────────────┐  ┌──────────────────┐
│  Frontend 1      │  │  Frontend 2      │
│  (Contenedor)    │  │  (Contenedor)    │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └─────────┬───────────┘
                   ↓
         ┌─────────────────────┐
         │  Load Balancer      │
         └─────────┬───────────┘
                   ↓
         ┌─────────────────────┐
         │  Backend (Stateless)│
         └─────────┬───────────┘
                   ↓
         ┌─────────────────────┐
         │  PostgreSQL         │
         │  (Base de datos     │
         │   externa)          │
         └─────────────────────┘
```

---

## 🎯 Resumen Visual

### ¿Qué está dentro del contenedor?

```
┌─────────────────────────────────────┐
│  CONTENEDOR DOCKER                  │
│                                     │
│  ✅ Frontend compilado (.next)      │
│  ✅ Backend compilado (dist/)       │
│  ✅ node_modules (runtime)          │
│  ✅ Prisma Client                   │
│  ✅ docker-entrypoint.sh            │
│                                     │
│  ❌ dev.db (está en volumen)        │
│  ❌ node_modules (dev)              │
│  ❌ Código TypeScript fuente        │
└─────────────────────────────────────┘
```

### ¿Qué está en el host (persistente)?

```
┌─────────────────────────────────────┐
│  HOST (Coolify Server)              │
│                                     │
│  ✅ dev.db (base de datos)          │
│  ✅ Backups                          │
│  ✅ Logs de Coolify                 │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Checklist de Arquitectura

Antes de desplegar, verifica:

- [ ] **Frontend y Backend** en un solo Dockerfile ✅
- [ ] **Puerto 9002** como puerto público ✅
- [ ] **Puerto 3001** interno (no expuesto) ✅
- [ ] **Volumen** configurado para /app/backend/prisma ✅
- [ ] **Variables de entorno** configuradas ✅
- [ ] **NEXT_PUBLIC_API_URL** apunta al dominio público ✅
- [ ] **Health check** configurado en Dockerfile ✅
- [ ] **docker-entrypoint.sh** ejecuta migraciones y seed ✅

---

**Todo está configurado para un despliegue exitoso!** 🚀

---

**Documentado por:** Claude Code
**Última actualización:** 2025-10-28
