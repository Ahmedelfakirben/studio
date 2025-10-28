"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bonsLivraison_controller_1 = require("../controllers/bonsLivraison.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas están protegidas
router.use(auth_middleware_1.protegerRuta);
// Rutas CRUD para bons de livraison
router.get('/', bonsLivraison_controller_1.getBonsLivraison);
router.get('/:id', bonsLivraison_controller_1.getBonLivraisonById);
router.post('/', bonsLivraison_controller_1.createBonLivraison);
router.put('/:id', bonsLivraison_controller_1.updateBonLivraison);
router.delete('/:id', bonsLivraison_controller_1.deleteBonLivraison);
exports.default = router;
