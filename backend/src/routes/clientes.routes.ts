import { Router } from 'express';
import { getClientes, getClienteById, createCliente, updateCliente, deleteCliente } from '../controllers/clientes.controller';
import { protegerRuta } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas están protegidas
router.use(protegerRuta);

// Rutas CRUD para clientes
router.get('/', getClientes);
router.get('/:id', getClienteById);
router.post('/', createCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

export default router;