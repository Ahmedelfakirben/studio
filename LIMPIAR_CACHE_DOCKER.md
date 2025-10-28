# 🧹 Limpiar Cache de Docker en VPS

El problema persistente de "Module not found" sugiere que Docker está usando capas cacheadas viejas donde los archivos no se copiaron correctamente o el tsconfig.json no tiene el baseUrl.

## Paso 1: Conectar por SSH

```bash
ssh root@49.13.153.105
# Contraseña: Satec2016C@U
```

## Paso 2: Limpiar COMPLETAMENTE el cache de Docker

```bash
# Ver cuánto espacio usa Docker actualmente
docker system df

# Limpiar SOLO el build cache (RECOMENDADO - más seguro)
docker builder prune -af

# Verificar que se limpió
docker system df

# Opcional: Si lo anterior no funciona, limpieza más agresiva
# CUIDADO: Esto elimina imágenes sin usar
# docker system prune -af
```

## Paso 3: Eliminar imágenes específicas de tu app

```bash
# Listar imágenes de tu aplicación
docker images | grep -E "(studio|aly-gestion|ahmedelfakirben)"

# Eliminar imágenes viejas de tu app (ajusta el nombre según lo que veas)
docker images | grep studio | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || echo "No images found"
```

## Paso 4: Verificar que Coolify tiene el código más reciente

```bash
# Ver el último commit que Coolify está intentando usar
cd /data/coolify
docker logs coolify | grep "studio" | tail -20

# O verificar en los logs de build
ls -lt /var/lib/docker/overlay2/ | head -10
```

## Paso 5: Salir y Rebuild en Coolify

```bash
exit
```

Luego en Coolify:
1. Ve a tu aplicación
2. Click en **"Force Rebuild Container"** (si está disponible)
3. Luego click en **"Deploy"**

---

## ¿Por qué es necesario?

Docker BuildKit usa un cache muy agresivo. Aunque cambiamos `CACHEBUST`, si las capas anteriores tienen el mismo contenido (o Docker piensa que lo tienen), reutilizará las capas viejas.

Al limpiar con `docker builder prune -af`, forzamos a Docker a reconstruir TODAS las capas desde cero, garantizando que:

1. ✅ El nuevo `tsconfig.json` con `baseUrl: "."` se copie
2. ✅ Todos los archivos `src/` se copien correctamente
3. ✅ No se usen capas viejas donde algo faltaba

---

## Alternativa: Forzar rebuild sin cache desde Coolify

Si no quieres conectarte por SSH, en Coolify puedes intentar:

1. **Settings → Build**
2. Buscar una opción como **"No Cache"** o **"Force Rebuild"**
3. Habilítala temporalmente
4. Deploy de nuevo

Pero la forma más confiable es limpiar el cache directamente en el servidor.
