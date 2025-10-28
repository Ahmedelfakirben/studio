"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.esAdmin = exports.authMiddleware = exports.protegerRuta = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const protegerRuta = async (req, res, next) => {
    // Verificar si existe el token (acepta x-auth-token o Authorization Bearer)
    const bearerHeader = req.header('authorization');
    const tokenFromBearer = (bearerHeader === null || bearerHeader === void 0 ? void 0 : bearerHeader.toLowerCase().startsWith('bearer '))
        ? bearerHeader.slice(7)
        : undefined;
    const token = req.header('x-auth-token') || tokenFromBearer;
    if (!token) {
        return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });
    }
    try {
        // Verificar el token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Buscar el usuario en la base de datos
        const usuario = await index_1.prisma.usuario.findUnique({
            where: { id: decoded.id }
        });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Token no válido' });
        }
        // Agregar el usuario a la solicitud
        req.usuario = usuario;
        next();
    }
    catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};
exports.protegerRuta = protegerRuta;
// Para facilitar el desarrollo, crearemos un middleware simplificado
const authMiddleware = async (req, res, next) => {
    // En entorno de desarrollo, permitimos todas las solicitudes
    // Forzamos modo de desarrollo para pruebas
    const isDevelopment = true; //process.env.NODE_ENV === 'development';
    if (isDevelopment) {
        console.log('Modo desarrollo: Permitiendo acceso sin autenticación');
        // Simular un usuario autenticado
        req.usuario = {
            id: 'dev-user-id',
            nombre: 'Usuario de Desarrollo',
            email: 'dev@example.com',
            rol: 'admin'
        };
        return next();
    }
    // En otros entornos, usamos la autenticación normal
    return (0, exports.protegerRuta)(req, res, next);
};
exports.authMiddleware = authMiddleware;
const esAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'admin') {
        next();
    }
    else {
        res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
    }
};
exports.esAdmin = esAdmin;
