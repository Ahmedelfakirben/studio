import express from 'express';
import { 
  prefacturasAchatController, 
  validarCreatePrefacturaAchat, 
  validarUpdatePrefacturaAchat 
} from '../controllers/prefacturasAchat.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas para prefacturas de compra
router.get('/', prefacturasAchatController.getAll);
router.get('/:id', prefacturasAchatController.getById);
router.post('/', validarCreatePrefacturaAchat, prefacturasAchatController.create);
router.put('/:id', validarUpdatePrefacturaAchat, prefacturasAchatController.update);
router.delete('/:id', prefacturasAchatController.delete);
router.post('/:id/convertir', prefacturasAchatController.convertToFactura);

export default router;
