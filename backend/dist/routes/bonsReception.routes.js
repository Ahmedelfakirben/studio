"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bonsReception_controller_1 = require("../controllers/bonsReception.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Aplicar middleware de autenticación a todas las rutas
router.use(auth_middleware_1.authMiddleware);
// Rutas para bons de réception
router.get('/', bonsReception_controller_1.bonsReceptionController.getAll);
router.get('/:id', bonsReception_controller_1.bonsReceptionController.getById);
router.post('/', bonsReception_controller_1.validarCreateBonReception, bonsReception_controller_1.bonsReceptionController.create);
router.put('/:id', bonsReception_controller_1.validarUpdateBonReception, bonsReception_controller_1.bonsReceptionController.update);
router.delete('/:id', bonsReception_controller_1.bonsReceptionController.delete);
exports.default = router;
