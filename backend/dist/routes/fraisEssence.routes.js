"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fraisEssence_controller_1 = require("../controllers/fraisEssence.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Rutas protegidas
router.get('/', auth_middleware_1.protegerRuta, fraisEssence_controller_1.obtenerFraisEssence);
router.get('/:id', auth_middleware_1.protegerRuta, fraisEssence_controller_1.obtenerFraisEssencePorId);
router.post('/', auth_middleware_1.protegerRuta, fraisEssence_controller_1.crearFraisEssence);
router.put('/:id', auth_middleware_1.protegerRuta, fraisEssence_controller_1.actualizarFraisEssence);
router.delete('/:id', auth_middleware_1.protegerRuta, fraisEssence_controller_1.eliminarFraisEssence);
exports.default = router;
