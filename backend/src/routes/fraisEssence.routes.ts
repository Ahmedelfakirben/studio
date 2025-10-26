import { Router } from 'express';
import { 
  obtenerFraisEssence, 
  obtenerFraisEssencePorId, 
  crearFraisEssence, 
  actualizarFraisEssence, 
  eliminarFraisEssence
} from '../controllers/fraisEssence.controller';
import { protegerRuta } from '../middleware/auth.middleware';

const router = Router();

// Rutas protegidas
router.get('/', protegerRuta, obtenerFraisEssence);
router.get('/:id', protegerRuta, obtenerFraisEssencePorId);
router.post('/', protegerRuta, crearFraisEssence);
router.put('/:id', protegerRuta, actualizarFraisEssence);
router.delete('/:id', protegerRuta, eliminarFraisEssence);

export default router;