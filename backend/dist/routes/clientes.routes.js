"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientes_controller_1 = require("../controllers/clientes.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas están protegidas
router.use(auth_middleware_1.protegerRuta);
// Rutas CRUD para clientes
router.get('/', clientes_controller_1.getClientes);
router.get('/:id', clientes_controller_1.getClienteById);
router.post('/', clientes_controller_1.createCliente);
router.put('/:id', clientes_controller_1.updateCliente);
router.delete('/:id', clientes_controller_1.deleteCliente);
exports.default = router;
