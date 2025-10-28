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
exports.validarUpdatePrefacturaAchat = exports.validarCreatePrefacturaAchat = exports.prefacturasAchatController = exports.prefacturaAchatSchema = void 0;
const validacion_1 = require("../utils/validacion");
const z = __importStar(require("zod"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const logger = logger_1.LoggerFactory.getLogger('prefacturasAchatController');
// Esquema para validar items de la prefactura
const prefacturaAchatItemSchema = z.object({
    descripcion: z.string().min(1, "La descripción es obligatoria"),
    cantidad: z.number().positive("La cantidad debe ser positiva"),
    precioUnitario: z.number().positive("El precio debe ser positivo"),
    tipoIVA: z.number().min(0).max(100),
});
// Esquema para validar la prefactura completa
exports.prefacturaAchatSchema = z.object({
    proveedorId: z.string().min(1, "Selecciona un proveedor"),
    fecha: z.string().min(1, "La fecha es obligatoria"),
    fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria"),
    numero: z.string().min(1, "El número de prefactura es obligatorio"),
    referencia: z.string().optional(),
    notas: z.string().optional(),
    items: z.array(prefacturaAchatItemSchema).min(1, "Agrega al menos un concepto"),
    totalHT: z.number().positive(),
    totalTVA: z.number().min(0),
    totalTTC: z.number().positive(),
});
// Path al archivo JSON donde se guardarán las prefacturas
const dataFilePath = path_1.default.resolve(__dirname, '../data/prefacturasAchat.json');
const facturasAchatPath = path_1.default.resolve(__dirname, '../data/facturasAchat.json');
// Función para cargar las prefacturas desde el archivo
const cargarPrefacturas = () => {
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
        logger.error('Error al cargar prefacturas de compra:', error);
        return [];
    }
};
// Función para guardar las prefacturas en el archivo
const guardarPrefacturas = (prefacturas) => {
    try {
        const dirPath = path_1.default.dirname(dataFilePath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        fs_1.default.writeFileSync(dataFilePath, JSON.stringify(prefacturas, null, 2));
    }
    catch (error) {
        logger.error('Error al guardar prefacturas de compra:', error);
    }
};
// Función para cargar las facturas de compra desde el archivo
const cargarFacturasAchat = () => {
    try {
        // Si el directorio no existe, créalo
        const dirPath = path_1.default.dirname(facturasAchatPath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        // Si el archivo no existe, crea uno vacío
        if (!fs_1.default.existsSync(facturasAchatPath)) {
            fs_1.default.writeFileSync(facturasAchatPath, JSON.stringify([]));
            return [];
        }
        const data = fs_1.default.readFileSync(facturasAchatPath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        logger.error('Error al cargar facturas de compra:', error);
        return [];
    }
};
// Función para guardar las facturas de compra en el archivo
const guardarFacturasAchat = (facturas) => {
    try {
        const dirPath = path_1.default.dirname(facturasAchatPath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        fs_1.default.writeFileSync(facturasAchatPath, JSON.stringify(facturas, null, 2));
    }
    catch (error) {
        logger.error('Error al guardar facturas de compra:', error);
    }
};
// Controladores
exports.prefacturasAchatController = {
    // Obtener todas las prefacturas
    getAll: (req, res) => {
        try {
            logger.info('Obteniendo todas las prefacturas de compra');
            const prefacturas = cargarPrefacturas();
            return res.status(200).json(prefacturas);
        }
        catch (error) {
            logger.error('Error al obtener prefacturas de compra:', error);
            return res.status(500).json({ mensaje: 'Error al obtener las prefacturas de compra' });
        }
    },
    // Obtener una prefactura por ID
    getById: (req, res) => {
        try {
            const { id } = req.params;
            logger.info(`Obteniendo prefactura de compra con ID: ${id}`);
            const prefacturas = cargarPrefacturas();
            const prefactura = prefacturas.find(f => f._id === id);
            if (!prefactura) {
                return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
            }
            return res.status(200).json(prefactura);
        }
        catch (error) {
            logger.error(`Error al obtener prefactura de compra con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al obtener la prefactura de compra' });
        }
    },
    // Crear una nueva prefactura
    create: (req, res) => {
        try {
            const prefacturaData = req.body;
            logger.info(`Creando nueva prefactura de compra: ${prefacturaData.numero}`);
            // Agregar un ID único
            const nuevaPrefactura = {
                ...prefacturaData,
                _id: (0, uuid_1.v4)(),
                createdAt: new Date().toISOString()
            };
            // Cargar las prefacturas existentes y agregar la nueva
            const prefacturas = cargarPrefacturas();
            prefacturas.push(nuevaPrefactura);
            // Guardar los cambios
            guardarPrefacturas(prefacturas);
            return res.status(201).json(nuevaPrefactura);
        }
        catch (error) {
            logger.error('Error al crear prefactura de compra:', error);
            return res.status(500).json({ mensaje: 'Error al crear la prefactura de compra' });
        }
    },
    // Actualizar una prefactura existente
    update: (req, res) => {
        try {
            const { id } = req.params;
            const prefacturaData = req.body;
            logger.info(`Actualizando prefactura de compra con ID: ${id}`);
            // Cargar las prefacturas
            const prefacturas = cargarPrefacturas();
            const prefacturaIndex = prefacturas.findIndex(f => f._id === id);
            if (prefacturaIndex === -1) {
                return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
            }
            // Actualizar la prefactura
            const prefacturaActualizada = {
                ...prefacturas[prefacturaIndex],
                ...prefacturaData,
                updatedAt: new Date().toISOString()
            };
            prefacturas[prefacturaIndex] = prefacturaActualizada;
            // Guardar los cambios
            guardarPrefacturas(prefacturas);
            return res.status(200).json(prefacturaActualizada);
        }
        catch (error) {
            logger.error(`Error al actualizar prefactura de compra con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al actualizar la prefactura de compra' });
        }
    },
    // Eliminar una prefactura
    delete: (req, res) => {
        try {
            const { id } = req.params;
            logger.info(`Eliminando prefactura de compra con ID: ${id}`);
            // Cargar las prefacturas
            const prefacturas = cargarPrefacturas();
            const prefacturaIndex = prefacturas.findIndex(f => f._id === id);
            if (prefacturaIndex === -1) {
                return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
            }
            // Eliminar la prefactura
            prefacturas.splice(prefacturaIndex, 1);
            // Guardar los cambios
            guardarPrefacturas(prefacturas);
            return res.status(200).json({ mensaje: 'Prefactura eliminada correctamente' });
        }
        catch (error) {
            logger.error(`Error al eliminar prefactura de compra con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al eliminar la prefactura de compra' });
        }
    },
    // Convertir prefactura a factura
    convertToFactura: (req, res) => {
        try {
            const { id } = req.params;
            logger.info(`Convirtiendo prefactura de compra con ID ${id} a factura`);
            // Cargar las prefacturas
            const prefacturas = cargarPrefacturas();
            const prefactura = prefacturas.find(p => p._id === id);
            if (!prefactura) {
                return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
            }
            // Generar número de factura (en un entorno real, esto seguiría una secuencia)
            const numeroFactura = `FAC-ACHAT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            // Crear la factura a partir de la prefactura
            const nuevaFactura = {
                ...prefactura,
                _id: (0, uuid_1.v4)(),
                numero: numeroFactura,
                prefacturaId: prefactura._id,
                fecha: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            };
            // Guardar la nueva factura
            const facturas = cargarFacturasAchat();
            facturas.push(nuevaFactura);
            guardarFacturasAchat(facturas);
            // Opcional: Marcar la prefactura como convertida
            const prefacturaIndex = prefacturas.findIndex(p => p._id === id);
            if (prefacturaIndex !== -1) {
                prefacturas[prefacturaIndex] = {
                    ...prefacturas[prefacturaIndex],
                    convertida: true,
                    facturaId: nuevaFactura._id,
                    updatedAt: new Date().toISOString()
                };
                guardarPrefacturas(prefacturas);
            }
            return res.status(200).json({
                mensaje: 'Prefactura convertida a factura correctamente',
                factura: nuevaFactura
            });
        }
        catch (error) {
            logger.error(`Error al convertir prefactura de compra con ID ${req.params.id} a factura:`, error);
            return res.status(500).json({ mensaje: 'Error al convertir la prefactura a factura' });
        }
    }
};
// Middleware de validación para crear prefactura
exports.validarCreatePrefacturaAchat = (0, validacion_1.validarEsquemaMiddleware)(exports.prefacturaAchatSchema);
// Middleware de validación para actualizar prefactura
exports.validarUpdatePrefacturaAchat = (0, validacion_1.validarEsquemaMiddleware)(exports.prefacturaAchatSchema.partial());
