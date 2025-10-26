# 🚀 Guía de Despliegue en Coolify - ALY Gestion

Esta guía te ayudará a desplegar la aplicación ALY Gestion en Coolify usando Docker.

## 📋 Prerequisitos

- Cuenta de Coolify configurada
- Acceso a tu servidor Coolify
- Repositorio Git (GitHub, GitLab, Bitbucket, etc.)

---

## 🎯 Opciones de Despliegue

### **Opción 1: Despliegue con un Solo Contenedor (Recomendado)**

Esta es la opción más sencilla. Frontend y Backend corren en el mismo contenedor.

#### Pasos:

1. **Push tu código al repositorio Git**
   ```bash
   git add .
   git commit -m "Preparar para despliegue en Coolify"
   git push origin main
   ```

2. **En Coolify Dashboard:**
   - Click en "New Resource" > "Application"
   - Selecciona tu repositorio Git
   - Nombre del proyecto: `aly-gestion`
   - Build Pack: **Dockerfile**
   - Dockerfile Path: `Dockerfile`

3. **Configurar Variables de Entorno:**

   En la sección "Environment Variables" de Coolify, añade:

   ```env
   NODE_ENV=production
   PORT=3001
   FRONTEND_PORT=9002
   JWT_SECRET=tu-secreto-super-seguro-aqui-cambialo
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://tu-dominio.com
   DATABASE_URL=file:/app/backend/data/prod.db
   ```

   **⚠️ IMPORTANTE**: Cambia `JWT_SECRET` por un valor seguro y único.

4. **Configurar Puertos:**
   - Puerto de exposición: `9002` (Frontend)
   - El backend corre internamente en el puerto `3001`

5. **Configurar Volúmenes Persistentes** (Importante para la base de datos):

   En la sección "Volumes" de Coolify:
   - Source: `/var/lib/docker/volumes/aly-gestion-db`
   - Destination: `/app/backend/data`
   - Esto asegura que tu base de datos SQLite no se pierda al reiniciar

6. **Deploy**
   - Click en "Deploy"
   - Espera a que termine el build (5-10 minutos la primera vez)

---

### **Opción 2: Despliegue con Docker Compose**

Si prefieres usar Docker Compose para mayor control:

1. **En Coolify Dashboard:**
   - New Resource > "Docker Compose"
   - Pega el contenido de `docker-compose.yml`

2. **Modificar docker-compose.yml para Coolify:**

   Reemplaza la sección `environment` con:
   ```yaml
   environment:
     NODE_ENV: production
     PORT: 3001
     FRONTEND_URL: https://tu-dominio.com
     JWT_SECRET: ${JWT_SECRET}
     JWT_EXPIRES_IN: 7d
     DATABASE_URL: file:/app/backend/data/prod.db
     FRONTEND_PORT: 9002
   ```

3. **Configurar las mismas variables de entorno** que en la Opción 1

---

## 🔒 Configuración de Dominio

1. **En Coolify:**
   - Ve a tu aplicación > "Domains"
   - Añade tu dominio: `aly-gestion.tudominio.com`
   - Coolify configurará automáticamente HTTPS con Let's Encrypt

2. **Actualiza la variable de entorno:**
   ```env
   FRONTEND_URL=https://aly-gestion.tudominio.com
   ```

---

## 🗄️ Base de Datos

### SQLite (Por Defecto)

La configuración actual usa SQLite, que es perfecta para pequeñas y medianas aplicaciones.

**Ventajas:**
- ✅ Sin configuración adicional
- ✅ Backup sencillo
- ✅ Ideal para hasta 100,000 registros

**Backup:**
El volumen persistente se guarda en `/app/backend/data/prod.db`

### PostgreSQL (Opcional para Producción)

Si necesitas mayor escalabilidad:

1. **Crear servicio PostgreSQL en Coolify:**
   - New Resource > Database > PostgreSQL
   - Copia la URL de conexión

2. **Actualizar variables de entorno:**
   ```env
   DATABASE_URL=postgresql://usuario:contraseña@postgres-host:5432/aly_gestion
   ```

3. **Actualizar schema.prisma:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Rebuild la aplicación** para que Prisma regenere el cliente

---

## 🔍 Verificación del Despliegue

Una vez desplegado, verifica:

1. **Frontend accesible:**
   ```
   https://tu-dominio.com
   ```
   Deberías ver la página de login

2. **Backend API funcional:**
   ```
   https://tu-dominio.com/api/health
   ```

3. **Logs en Coolify:**
   - Ve a tu aplicación > "Logs"
   - Deberías ver:
     ```
     ✅ Application started successfully!
     - Backend running at http://localhost:3001
     - Frontend running at http://localhost:9002
     ```

---

## 🐛 Troubleshooting

### Error: "Backend no responde"

**Solución:**
```bash
# En Coolify Logs, busca errores de Prisma
# Puede necesitar ejecutar migraciones manualmente
```

Accede al contenedor:
```bash
docker exec -it aly-gestion sh
cd /app/backend
npx prisma migrate deploy
```

### Error: "Database locked"

**Solución:**
SQLite tiene problemas con múltiples escrituras concurrentes. Considera migrar a PostgreSQL.

### Error: "Module not found"

**Solución:**
Reconstruye la imagen desde cero:
```bash
# En Coolify
Click en "Redeploy" con "Force rebuild"
```

### Logs no aparecen

**Solución:**
Verifica que el contenedor esté corriendo:
```bash
docker ps | grep aly-gestion
docker logs aly-gestion
```

---

## 📊 Monitoreo

Coolify incluye monitoreo básico. Para ver métricas:

1. Ve a tu aplicación en Coolify
2. Click en "Metrics"
3. Verás: CPU, RAM, Network, Disk

---

## 🔄 Actualizar la Aplicación

Cuando hagas cambios en el código:

1. **Push al repositorio:**
   ```bash
   git add .
   git commit -m "Actualización de funcionalidad"
   git push origin main
   ```

2. **En Coolify:**
   - La aplicación se redesplega automáticamente si tienes "Auto Deploy" activado
   - O haz click manual en "Deploy"

3. **Zero Downtime Deploy:**
   Coolify maneja esto automáticamente con health checks

---

## 🔐 Seguridad

### Antes de ir a producción:

1. **Cambia JWT_SECRET:**
   ```bash
   # Genera un secreto aleatorio fuerte
   openssl rand -base64 32
   ```

2. **Configura CORS correctamente:**
   Verifica `backend/src/index.ts` que solo permite tu dominio

3. **Habilita rate limiting:**
   Ya está configurado en el backend, pero verifica los límites

4. **Backup regular:**
   ```bash
   # Script de backup automático (en el servidor)
   0 2 * * * docker cp aly-gestion:/app/backend/data/prod.db /backups/aly-gestion-$(date +\%Y\%m\%d).db
   ```

---

## 📁 Estructura del Proyecto para Despliegue

```
studio/
├── Dockerfile                  # Configuración multi-stage
├── docker-compose.yml          # Orquestación (opcional)
├── docker-entrypoint.sh        # Script de inicio
├── .dockerignore              # Archivos ignorados
├── .env.example               # Variables de entorno de ejemplo
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Esquema de base de datos
│   ├── src/
│   └── package.json
├── src/
│   └── app/                   # Frontend Next.js
└── package.json
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en Coolify
2. Verifica las variables de entorno
3. Comprueba que el volumen esté montado correctamente
4. Accede al contenedor para debug manual

---

## ✅ Checklist de Despliegue

- [ ] Código pusheado a Git
- [ ] Variables de entorno configuradas en Coolify
- [ ] `JWT_SECRET` cambiado a valor seguro
- [ ] Volumen persistente configurado para `/app/backend/data`
- [ ] Puerto 9002 expuesto
- [ ] Dominio configurado con HTTPS
- [ ] Primer despliegue exitoso
- [ ] Login funciona correctamente
- [ ] API responde en `/api/health`
- [ ] Backup configurado (recomendado)

---

## 🎉 ¡Listo!

Tu aplicación ALY Gestion debería estar corriendo en producción. Accede a:

```
https://tu-dominio.com
```

Usuario por defecto (si seed está configurado):
- Email: admin@example.com
- Password: (revisa backend/prisma/seed.ts)
