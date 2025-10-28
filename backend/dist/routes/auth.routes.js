"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Rutas públicas
router.post('/login', auth_controller_1.login);
// Rutas protegidas - cualquier usuario autenticado
router.get('/usuario', auth_middleware_1.protegerRuta, auth_controller_1.getUsuario);
// Rutas protegidas - solo administradores
router.post('/registrar', auth_middleware_1.protegerRuta, auth_middleware_1.esAdmin, auth_controller_1.registrar);
router.get('/usuarios', auth_middleware_1.protegerRuta, auth_middleware_1.esAdmin, auth_controller_1.getUsuarios);
router.put('/usuarios/:id', auth_middleware_1.protegerRuta, auth_middleware_1.esAdmin, auth_controller_1.updateUsuario);
router.delete('/usuarios/:id', auth_middleware_1.protegerRuta, auth_middleware_1.esAdmin, auth_controller_1.deleteUsuario);
router.put('/usuarios/:id/reset-password', auth_middleware_1.protegerRuta, auth_middleware_1.esAdmin, auth_controller_1.resetPassword);
exports.default = router;
