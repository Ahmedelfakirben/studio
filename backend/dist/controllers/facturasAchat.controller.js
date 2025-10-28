"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarUpdateFacturaAchat = exports.validarCreateFacturaAchat = exports.facturasAchatController = exports.facturaAchatSchema = void 0;
const validacion_1 = require("../utils/validacion");
const z = __importStar(require("zod"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const logger = logger_1.LoggerFactory.getLogger('facturasAchatController');
// Esquema para validar items de la factura
const facturaAchatItemSchema = z.object({
    descripcion: z.string().min(1, "La descripción es obligatoria"),
    cantidad: z.number().positive("La cantidad debe ser positiva"),
    precioUnitario: z.number().positive("El precio debe ser positivo"),
    tipoIVA: z.number().min(0).max(100),
});
// Esquema para validar la factura completa
exports.facturaAchatSchema = z.object({
    proveedorId: z.string().min(1, "Selecciona un proveedor"),
    fecha: z.string().min(1, "La fecha es obligatoria"),
    fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria"),
    numero: z.string().min(1, "El número de factura es obligatorio"),
    referencia: z.string().optional(),
    notas: z.string().optional(),
    formaPago: z.string().min(1, "Selecciona una forma de pago"),
    metodoPago: z.string().min(1, "Selecciona un método de pago"),
    items: z.array(facturaAchatItemSchema).min(1, "Agrega al menos un concepto"),
    totalHT: z.number().positive(),
    totalTVA: z.number().min(0),
    totalTTC: z.number().positive(),
});
// Path al archivo JSON donde se guardarán las facturas
const dataFilePath = path_1.default.resolve(__dirname, '../data/facturasAchat.json');
// Función para cargar las facturas desde el archivo
const cargarFacturas = () => {
    try {
        // Si el directorio no existe, créalo
        const dirPath = path_1.default.dirname(dataFilePath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        // Si el archivo no existe, crea uno vacío
        if (!fs_1.default.existsSync(dataFilePath)) {
            fs_1.default.writeFileSync(dataFilePath, JSON.stringify([]));
            return [];
        }
        const data = fs_1.default.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        logger.error('Error al cargar facturas de compra:', error);
        return [];
    }
};
// Función para guardar las facturas en el archivo
const guardarFacturas = (facturas) => {
    try {
        const dirPath = path_1.default.dirname(dataFilePath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        fs_1.default.writeFileSync(dataFilePath, JSON.stringify(facturas, null, 2));
    }
    catch (error) {
        logger.error('Error al guardar facturas de compra:', error);
    }
};
// Controladores
exports.facturasAchatController = {
    // Obtener todas las facturas
    getAll: (req, res) => {
        try {
            logger.info('Obteniendo todas las facturas de compra');
            const facturas = cargarFacturas();
            return res.status(200).json(facturas);
        }
        catch (error) {
            logger.error('Error al obtener facturas de compra:', error);
            return res.status(500).json({ mensaje: 'Error al obtener las facturas de compra' });
        }
    },
    // Obtener una factura por ID
    getById: (req, res) => {
        try {
            const { id } = req.params;
            logger.info(`Obteniendo factura de compra con ID: ${id}`);
            const facturas = cargarFacturas();
            const factura = facturas.find(f => f._id === id);
            if (!factura) {
                return res.status(404).json({ mensaje: 'Factura no encontrada' });
            }
            return res.status(200).json(factura);
        }
        catch (error) {
            logger.error(`Error al obtener factura de compra con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al obtener la factura de compra' });
        }
    },
    // Crear una nueva factura
    create: (req, res) => {
        try {
            const facturaData = req.body;
            logger.info(`Creando nueva factura de compra: ${facturaData.numero}`);
            // Agregar un ID único
            const nuevaFactura = {
                ...facturaData,
                _id: (0, uuid_1.v4)(),
                createdAt: new Date().toISOString()
            };
            // Cargar las facturas existentes y agregar la nueva
            const facturas = cargarFacturas();
            facturas.push(nuevaFactura);
            // Guardar los cambios
            guardarFacturas(facturas);
            return res.status(201).json(nuevaFactura);
        }
        catch (error) {
            logger.error('Error al crear factura de compra:', error);
            return res.status(500).json({ mensaje: 'Error al crear la factura de compra' });
        }
    },
    // Actualizar una factura existente
    update: (req, res) => {
        try {
            const { id } = req.params;
            const facturaData = req.body;
            logger.info(`Actualizando factura de compra con ID: ${id}`);
            // Cargar las facturas
            const facturas = cargarFacturas();
            const facturaIndex = facturas.findIndex(f => f._id === id);
            if (facturaIndex === -1) {
                return res.status(404).json({ mensaje: 'Factura no encontrada' });
            }
            // Actualizar la factura
            const facturaActualizada = {
                ...facturas[facturaIndex],
                ...facturaData,
                updatedAt: new Date().toISOString()
            };
            facturas[facturaIndex] = facturaActualizada;
            // Guardar los cambios
            guardarFacturas(facturas);
            return res.status(200).json(facturaActualizada);
        }
        catch (error) {
            logger.error(`Error al actualizar factura de compra con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al actualizar la factura de compra' });
        }
    },
    // Eliminar una factura
    delete: (req, res) => {
        try {
            const { id } = req.params;
            logger.info(`Eliminando factura de compra con ID: ${id}`);
            // Cargar las facturas
            const facturas = cargarFacturas();
            const facturaIndex = facturas.findIndex(f => f._id === id);
            if (facturaIndex === -1) {
                return res.status(404).json({ mensaje: 'Factura no encontrada' });
            }
            // Eliminar la factura
            facturas.splice(facturaIndex, 1);
            // Guardar los cambios
            guardarFacturas(facturas);
            return res.status(200).json({ mensaje: 'Factura eliminada correctamente' });
        }
        catch (error) {
            logger.error(`Error al eliminar factura de compra con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al eliminar la factura de compra' });
        }
    }
};
// Middleware de validación para crear factura
exports.validarCreateFacturaAchat = (0, validacion_1.validarEsquemaMiddleware)(exports.facturaAchatSchema);
// Middleware de validación para actualizar factura
exports.validarUpdateFacturaAchat = (0, validacion_1.validarEsquemaMiddleware)(exports.facturaAchatSchema.partial());
