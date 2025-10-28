"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
// Rutas
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const clientes_routes_1 = __importDefault(require("./routes/clientes.routes"));
const facturas_routes_1 = __importDefault(require("./routes/facturas.routes"));
const prefacturas_routes_1 = __importDefault(require("./routes/prefacturas.routes"));
const bonsLivraison_routes_1 = __importDefault(require("./routes/bonsLivraison.routes"));
const proveedores_routes_1 = __importDefault(require("./routes/proveedores.routes"));
const fraisEssence_routes_1 = __importDefault(require("./routes/fraisEssence.routes"));
const locationMateriel_routes_1 = __importDefault(require("./routes/locationMateriel.routes"));
const facturasAchat_routes_1 = __importDefault(require("./routes/facturasAchat.routes"));
const bonsReception_routes_1 = __importDefault(require("./routes/bonsReception.routes"));
const prefacturasAchat_routes_1 = __importDefault(require("./routes/prefacturasAchat.routes"));
// Configuración
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:9002',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Rutas API - VENTE (Ventas)
app.use('/api/auth', auth_routes_1.default);
app.use('/api/clientes', clientes_routes_1.default);
app.use('/api/facturas', facturas_routes_1.default);
app.use('/api/prefacturas', prefacturas_routes_1.default);
app.use('/api/bons-livraison', bonsLivraison_routes_1.default);
// Rutas API - ACHAT (Compras) - ✅ CORREGIDO
app.use('/api/fournisseurs', proveedores_routes_1.default);
app.use('/api/achats/facturas', facturasAchat_routes_1.default);
app.use('/api/achats/prefacturas', prefacturasAchat_routes_1.default);
app.use('/api/achats/bons-reception', bonsReception_routes_1.default);
// Rutas API - Otros módulos
app.use('/api/frais-essence', fraisEssence_routes_1.default);
app.use('/api/location-materiel', locationMateriel_routes_1.default);
// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de ALY Gestion funcionando correctamente' });
});
// Manejo de errores
app.use((err, req, res, next) => {
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
    await exports.prisma.$disconnect();
    console.log('Conexión a la base de datos cerrada');
    process.exit(0);
});
