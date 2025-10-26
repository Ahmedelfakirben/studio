import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Rutas
import authRoutes from './routes/auth.routes';
import clientesRoutes from './routes/clientes.routes';
import facturasRoutes from './routes/facturas.routes';
import prefacturasRoutes from './routes/prefacturas.routes';
import bonsLivraisonRoutes from './routes/bonsLivraison.routes';
import proveedoresRoutes from './routes/proveedores.routes';
import fraisEssenceRoutes from './routes/fraisEssence.routes';
import locationMaterielRoutes from './routes/locationMateriel.routes';
import facturasAchatRoutes from './routes/facturasAchat.routes';
import bonsReceptionRoutes from './routes/bonsReception.routes';
import prefacturasAchatRoutes from './routes/prefacturasAchat.routes';

// Configuración
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
export const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:9002',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rutas API - VENTE (Ventas)
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/prefacturas', prefacturasRoutes);
app.use('/api/bons-livraison', bonsLivraisonRoutes);

// Rutas API - ACHAT (Compras) - ✅ CORREGIDO
app.use('/api/fournisseurs', proveedoresRoutes);
app.use('/api/achats/facturas', facturasAchatRoutes);
app.use('/api/achats/prefacturas', prefacturasAchatRoutes);
app.use('/api/achats/bons-reception', bonsReceptionRoutes);

// Rutas API - Otros módulos
app.use('/api/frais-essence', fraisEssenceRoutes);
app.use('/api/location-materiel', locationMaterielRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de ALY Gestion funcionando correctamente' });
});

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log('✅ Rutas VENTE configuradas: /api/clientes, /api/facturas, /api/prefacturas, /api/bons-livraison');
  console.log('✅ Rutas ACHAT configuradas: /api/fournisseurs, /api/achats/facturas, /api/achats/prefacturas, /api/achats/bons-reception');
});

// Manejo de cierre de la aplicación
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Conexión a la base de datos cerrada');
  process.exit(0);
});
