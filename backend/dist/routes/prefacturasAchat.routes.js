"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prefacturasAchat_controller_1 = require("../controllers/prefacturasAchat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Aplicar middleware de autenticación a todas las rutas
router.use(auth_middleware_1.authMiddleware);
// Rutas para prefacturas de compra
router.get('/', prefacturasAchat_controller_1.prefacturasAchatController.getAll);
router.get('/:id', prefacturasAchat_controller_1.prefacturasAchatController.getById);
router.post('/', prefacturasAchat_controller_1.validarCreatePrefacturaAchat, prefacturasAchat_controller_1.prefacturasAchatController.create);
router.put('/:id', prefacturasAchat_controller_1.validarUpdatePrefacturaAchat, prefacturasAchat_controller_1.prefacturasAchatController.update);
router.delete('/:id', prefacturasAchat_controller_1.prefacturasAchatController.delete);
router.post('/:id/convertir', prefacturasAchat_controller_1.prefacturasAchatController.convertToFactura);
exports.default = router;
