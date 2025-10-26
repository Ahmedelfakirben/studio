import { Router } from 'express';
import { getFacturas, getFacturaById, createFactura, updateFactura, deleteFactura } from '../controllers/facturas.controller';
import { protegerRuta } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas están protegidas
router.use(protegerRuta);

// Rutas CRUD para facturas
router.get('/', getFacturas);
router.get('/:id', getFacturaById);
router.post('/', createFactura);
router.put('/:id', updateFactura);
router.delete('/:id', deleteFactura);

export default router;
