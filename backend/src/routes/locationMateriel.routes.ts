import { Router } from 'express';
import { 
  obtenerLocationMateriel, 
  obtenerLocationMaterielPorId, 
  crearLocationMateriel, 
  actualizarLocationMateriel, 
  eliminarLocationMateriel
} from '../controllers/locationMateriel.controller';
import { protegerRuta } from '../middleware/auth.middleware';

const router = Router();

// Rutas protegidas
router.get('/', protegerRuta, obtenerLocationMateriel);
router.get('/:id', protegerRuta, obtenerLocationMaterielPorId);
router.post('/', protegerRuta, crearLocationMateriel);
router.put('/:id', protegerRuta, actualizarLocationMateriel);
router.delete('/:id', protegerRuta, eliminarLocationMateriel);

export default router;