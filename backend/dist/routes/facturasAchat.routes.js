"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facturasAchat_controller_1 = require("../controllers/facturasAchat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Aplicar middleware de autenticación a todas las rutas
router.use(auth_middleware_1.authMiddleware);
// Rutas para facturas de compra
router.get('/', facturasAchat_controller_1.facturasAchatController.getAll);
router.get('/:id', facturasAchat_controller_1.facturasAchatController.getById);
router.post('/', facturasAchat_controller_1.validarCreateFacturaAchat, facturasAchat_controller_1.facturasAchatController.create);
router.put('/:id', facturasAchat_controller_1.validarUpdateFacturaAchat, facturasAchat_controller_1.facturasAchatController.update);
router.delete('/:id', facturasAchat_controller_1.facturasAchatController.delete);
exports.default = router;
