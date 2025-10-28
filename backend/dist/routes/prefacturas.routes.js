"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prefacturas_controller_1 = require("../controllers/prefacturas.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas están protegidas
router.use(auth_middleware_1.protegerRuta);
// Rutas CRUD para prefacturas
router.get('/', prefacturas_controller_1.getPrefacturas);
router.get('/:id', prefacturas_controller_1.getPrefacturaById);
router.post('/', prefacturas_controller_1.createPrefactura);
router.put('/:id', prefacturas_controller_1.updatePrefactura);
router.delete('/:id', prefacturas_controller_1.deletePrefactura);
exports.default = router;
