"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.deleteUsuario = exports.updateUsuario = exports.getUsuarios = exports.getUsuario = exports.login = exports.registrar = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
// Registrar un nuevo usuario (solo admin puede hacerlo)
const registrar = async (req, res) => {
    const { email, password, nombre, rol } = req.body;
    try {
        // Verificar si el usuario ya existe
        let usuario = await index_1.prisma.usuario.findUnique({
            where: { email }
        });
        if (usuario) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }
        // Encriptar la contraseña
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Crear el usuario
        usuario = await index_1.prisma.usuario.create({
            data: {
                email,
                password: hashedPassword,
                nombre,
                rol: rol || 'usuario'
            }
        });
        // Retornar usuario sin la contraseña
        const { password: _, ...usuarioSinPassword } = usuario;
        res.status(201).json(usuarioSinPassword);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.registrar = registrar;
// Iniciar sesión
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificar si el usuario existe
        const usuario = await index_1.prisma.usuario.findUnique({
            where: { email }
        });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }
        // Verificar la contraseña
        const isMatch = await bcryptjs_1.default.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }
        // Crear y devolver el token JWT
        const payload = {
            id: usuario.id
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.login = login;
// Obtener usuario autenticado
const getUsuario = async (req, res) => {
    try {
        const usuario = await index_1.prisma.usuario.findUnique({
            where: { id: req.usuario.id },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(usuario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.getUsuario = getUsuario;
// Obtener todos los usuarios (solo admin)
const getUsuarios = async (req, res) => {
    try {
        // Verificar que el usuario es admin
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
        }
        const usuarios = await index_1.prisma.usuario.findMany({
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(usuarios);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.getUsuarios = getUsuarios;
// Actualizar usuario (solo admin)
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
    try {
        // Verificar que el usuario es admin
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
        }
        const usuario = await index_1.prisma.usuario.update({
            where: { id },
            data: {
                nombre,
                email,
                rol
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(usuario);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.updateUsuario = updateUsuario;
// Eliminar usuario (solo admin)
const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar que el usuario es admin
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
        }
        // No permitir que un admin se elimine a sí mismo
        if (id === req.usuario.id) {
            return res.status(400).json({ mensaje: 'No puedes eliminar tu propio usuario' });
        }
        await index_1.prisma.usuario.delete({
            where: { id }
        });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.deleteUsuario = deleteUsuario;
// Resetear contraseña de un usuario (solo admin)
const resetPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    try {
        // Verificar que el usuario es admin
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
        }
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
        }
        // Encriptar la nueva contraseña
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        await index_1.prisma.usuario.update({
            where: { id },
            data: {
                password: hashedPassword
            }
        });
        res.json({ mensaje: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
exports.resetPassword = resetPassword;
