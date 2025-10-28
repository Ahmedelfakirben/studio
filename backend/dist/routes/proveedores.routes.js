"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proveedores_controller_1 = require("../controllers/proveedores.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Rutas protegidas
router.get('/', auth_middleware_1.authMiddleware, proveedores_controller_1.obtenerProveedores);
router.get('/:id', auth_middleware_1.authMiddleware, proveedores_controller_1.obtenerProveedorPorId);
router.post('/', auth_middleware_1.authMiddleware, proveedores_controller_1.crearProveedor);
router.post('/seed', auth_middleware_1.authMiddleware, proveedores_controller_1.crearProveedoresEjemplo); // Crear datos de ejemplo
router.put('/:id', auth_middleware_1.authMiddleware, proveedores_controller_1.actualizarProveedor);
router.delete('/:id', auth_middleware_1.authMiddleware, proveedores_controller_1.eliminarProveedor);
exports.default = router;
