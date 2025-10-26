import { Router } from 'express';
import { registrar, login, getUsuario, getUsuarios, updateUsuario, deleteUsuario, resetPassword } from '../controllers/auth.controller';
import { protegerRuta, esAdmin } from '../middleware/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/login', login);

// Rutas protegidas - cualquier usuario autenticado
router.get('/usuario', protegerRuta, getUsuario);

// Rutas protegidas - solo administradores
router.post('/registrar', protegerRuta, esAdmin, registrar);
router.get('/usuarios', protegerRuta, esAdmin, getUsuarios);
router.put('/usuarios/:id', protegerRuta, esAdmin, updateUsuario);
router.delete('/usuarios/:id', protegerRuta, esAdmin, deleteUsuario);
router.put('/usuarios/:id/reset-password', protegerRuta, esAdmin, resetPassword);

export default router;
