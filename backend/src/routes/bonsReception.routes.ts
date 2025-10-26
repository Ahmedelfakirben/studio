import express from 'express';
import { 
  bonsReceptionController, 
  validarCreateBonReception, 
  validarUpdateBonReception 
} from '../controllers/bonsReception.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas para bons de réception
router.get('/', bonsReceptionController.getAll);
router.get('/:id', bonsReceptionController.getById);
router.post('/', validarCreateBonReception, bonsReceptionController.create);
router.put('/:id', validarUpdateBonReception, bonsReceptionController.update);
router.delete('/:id', bonsReceptionController.delete);

export default router;
