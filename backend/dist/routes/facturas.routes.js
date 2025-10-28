"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facturas_controller_1 = require("../controllers/facturas.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas están protegidas
router.use(auth_middleware_1.protegerRuta);
// Rutas CRUD para facturas
router.get('/', facturas_controller_1.getFacturas);
router.get('/:id', facturas_controller_1.getFacturaById);
router.post('/', facturas_controller_1.createFactura);
router.put('/:id', facturas_controller_1.updateFactura);
router.delete('/:id', facturas_controller_1.deleteFactura);
exports.default = router;
