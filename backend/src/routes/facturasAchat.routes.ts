import express from 'express';
import { 
  facturasAchatController, 
  validarCreateFacturaAchat, 
  validarUpdateFacturaAchat 
} from '../controllers/facturasAchat.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas para facturas de compra
router.get('/', facturasAchatController.getAll);
router.get('/:id', facturasAchatController.getById);
router.post('/', validarCreateFacturaAchat, facturasAchatController.create);
router.put('/:id', validarUpdateFacturaAchat, facturasAchatController.update);
router.delete('/:id', facturasAchatController.delete);

export default router;
