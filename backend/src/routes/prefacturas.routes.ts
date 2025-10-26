import { Router } from 'express';
import { getPrefacturas, getPrefacturaById, createPrefactura, updatePrefactura, deletePrefactura } from '../controllers/prefacturas.controller';
import { protegerRuta } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas están protegidas
router.use(protegerRuta);

// Rutas CRUD para prefacturas
router.get('/', getPrefacturas);
router.get('/:id', getPrefacturaById);
router.post('/', createPrefactura);
router.put('/:id', updatePrefactura);
router.delete('/:id', deletePrefactura);

export default router;
