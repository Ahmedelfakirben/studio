import { Router } from 'express';
import { getBonsLivraison, getBonLivraisonById, createBonLivraison, updateBonLivraison, deleteBonLivraison } from '../controllers/bonsLivraison.controller';
import { protegerRuta } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas están protegidas
router.use(protegerRuta);

// Rutas CRUD para bons de livraison
router.get('/', getBonsLivraison);
router.get('/:id', getBonLivraisonById);
router.post('/', createBonLivraison);
router.put('/:id', updateBonLivraison);
router.delete('/:id', deleteBonLivraison);

export default router;
