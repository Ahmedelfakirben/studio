# 🖥️ Desarrollo Local - ALY Gestion

Si quieres ejecutar la aplicación en tu computadora local (no Docker), sigue estos pasos:

## 📋 Prerrequisitos

- Node.js 18 o superior
- npm

## 🚀 Iniciar en Desarrollo Local

### Terminal 1: Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed  # Solo la primera vez
npm run dev
```

El backend estará en: `http://localhost:3001`

### Terminal 2: Frontend

```bash
npm install
npm run dev
```

El frontend estará en: `http://localhost:9002`

## 🔑 Login Local

Después de ejecutar el seed, usa:
- Email: `admin@alygestion.com`
- Password: `admin123`

## ⚠️ IMPORTANTE

- **NO uses `npm start`** en local, usa `npm run dev`
- `npm start` es solo para producción con Docker
- El error `ECONNREFUSED ::1:3001` aparece si el backend no está corriendo

## 🐳 Para Producción

Para producción en Coolify, consulta `DEPLOY_INSTRUCCIONES.md`
