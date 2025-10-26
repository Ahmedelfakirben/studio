import { Router } from 'express';
import { 
  obtenerProveedores, 
  obtenerProveedorPorId, 
  crearProveedor, 
  actualizarProveedor, 
  eliminarProveedor,
  crearProveedoresEjemplo
} from '../controllers/proveedores.controller';
import { protegerRuta, authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Rutas protegidas
router.get('/', authMiddleware, obtenerProveedores);
router.get('/:id', authMiddleware, obtenerProveedorPorId);
router.post('/', authMiddleware, crearProveedor);
router.post('/seed', authMiddleware, crearProveedoresEjemplo); // Crear datos de ejemplo
router.put('/:id', authMiddleware, actualizarProveedor);
router.delete('/:id', authMiddleware, eliminarProveedor);

export default router;