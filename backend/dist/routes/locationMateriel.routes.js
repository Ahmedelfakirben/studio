"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const locationMateriel_controller_1 = require("../controllers/locationMateriel.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Rutas protegidas
router.get('/', auth_middleware_1.protegerRuta, locationMateriel_controller_1.obtenerLocationMateriel);
router.get('/:id', auth_middleware_1.protegerRuta, locationMateriel_controller_1.obtenerLocationMaterielPorId);
router.post('/', auth_middleware_1.protegerRuta, locationMateriel_controller_1.crearLocationMateriel);
router.put('/:id', auth_middleware_1.protegerRuta, locationMateriel_controller_1.actualizarLocationMateriel);
router.delete('/:id', auth_middleware_1.protegerRuta, locationMateriel_controller_1.eliminarLocationMateriel);
exports.default = router;
