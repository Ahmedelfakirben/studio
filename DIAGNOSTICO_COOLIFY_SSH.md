# 🔧 Diagnóstico de Coolify por SSH

Ejecuta estos comandos en tu VPS para diagnosticar el problema.

## Paso 1: Conectar por SSH

```bash
ssh root@49.13.153.105
# Contraseña: Satec2016C@U
```

---

## Paso 2: Verificar Estado de Coolify

```bash
# Ver si Coolify está corriendo
docker ps | grep coolify

# Ver logs de Coolify
docker logs -n 100 coolify

# Ver versión de Coolify
cd /data/coolify
docker-compose version
```

---

## Paso 3: Verificar tu Aplicación

```bash
# Listar todos los contenedores (incluyendo los parados)
docker ps -a | grep studio

# Ver los contenedores de tu app
docker ps -a | grep h8g4k0osso8kss084g44cs8w
```

---

## Paso 4: Inspeccionar el Último Build

```bash
# Ver las imágenes Docker creadas
docker images | grep studio

# Ver el historial de builds
docker images | head -20
```

---

## Paso 5: Verificar Volúmenes Persistentes

```bash
# Listar volúmenes de Docker
docker volume ls | grep aly

# Inspeccionar el volumen de base de datos (si existe)
docker volume inspect aly-db 2>/dev/null || echo "Volumen no existe"

# Ver archivos en /var/lib/coolify/storage
ls -la /var/lib/coolify/storage/
```

---

## Paso 6: Limpiar Cache de Docker (IMPORTANTE)

Si el build sigue usando cache viejo:

```bash
# Ver cuánto espacio usa Docker
docker system df

# Limpiar build cache (RECOMENDADO)
docker builder prune -af

# Limpiar todo (CUIDADO: elimina imágenes sin usar)
# docker system prune -af --volumes
```

---

## Paso 7: Ver Logs del Contenedor Actual

```bash
# Ver el ID del contenedor más reciente de tu app
CONTAINER_ID=$(docker ps -a | grep h8g4k0osso8kss084g44cs8w | head -1 | awk '{print $1}')

echo "Container ID: $CONTAINER_ID"

# Ver logs completos
docker logs $CONTAINER_ID

# Ver archivos dentro del contenedor
docker exec -it $CONTAINER_ID sh -c "ls -la /app/backend/prisma" 2>/dev/null || echo "Contenedor no está corriendo"
```

---

## Paso 8: Verificar Espacio en Disco

```bash
# Ver espacio disponible
df -h

# Ver uso de Docker
du -sh /var/lib/docker
```

---

## Paso 9: Forzar Rebuild Completo desde SSH

```bash
# Opción A: Limpiar cache de build
docker builder prune -af

# Opción B: Eliminar imágenes antiguas de tu app
docker images | grep studio | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || echo "No images to remove"

# Después de limpiar, ve a Coolify UI y haz Deploy de nuevo
```

---

## Paso 10: Verificar Configuración de Coolify

```bash
# Ver configuración de Coolify
cat /data/coolify/.env | grep -E "(COOLIFY|DOCKER)"

# Ver logs de despliegue
ls -la /data/coolify/logs/

# Ver último log de deploy
ls -lt /data/coolify/logs/ | head -5
```

---

## 🐛 Solución Probable: Limpiar Build Cache

El problema más común es que Docker está usando **capas cacheadas viejas** donde la carpeta `prisma` estaba vacía.

### Solución Rápida:

```bash
# 1. Limpiar build cache
docker builder prune -af

# 2. Verificar que se limpió
docker system df

# 3. En Coolify UI: Force Rebuild Container
# 4. En Coolify UI: Deploy/Redeploy
```

---

## 📊 Verificación Post-Build

Después de un nuevo deploy exitoso:

```bash
# 1. Obtener ID del nuevo contenedor
CONTAINER_ID=$(docker ps | grep h8g4k0osso8kss084g44cs8w | awk '{print $1}')

# 2. Verificar que prisma tiene archivos
docker exec $CONTAINER_ID ls -la /app/backend/prisma/

# 3. Ver logs en tiempo real
docker logs -f $CONTAINER_ID

# 4. Verificar que el frontend responde
curl http://localhost:9002 || curl http://127.0.0.1:9002
```

---

## 🆘 Si Nada Funciona

### Opción Nuclear: Recrear la Aplicación en Coolify

1. Exporta las variables de entorno de tu app actual
2. En Coolify UI: Delete Resource (tu app actual)
3. Crea una nueva aplicación desde cero
4. Configura variables de entorno
5. Deploy

Esto elimina cualquier configuración corrupta o cache persistente.

---

## 📋 Checklist de Diagnóstico

Ejecuta estos comandos y anota los resultados:

- [ ] `docker builder prune -af` → Limpiado
- [ ] `docker ps -a | grep studio` → Estado de contenedores
- [ ] `docker images | grep studio` → Imágenes existentes
- [ ] `df -h` → Espacio disponible
- [ ] Ver logs del contenedor más reciente
- [ ] Verificar `/app/backend/prisma` dentro del contenedor

---

## 🔗 Recursos Útiles

- Docs de Coolify: https://coolify.io/docs
- Limpiar Docker: `docker system prune -af`
- Ver uso: `docker system df -v`

---

**Nota:** Después de limpiar el cache con `docker builder prune -af`,
el próximo build en Coolify DEBE construir todo desde cero, lo que
debería resolver el problema de la carpeta prisma vacía.
