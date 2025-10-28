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
exports.validarUpdateBonReception = exports.validarCreateBonReception = exports.bonsReceptionController = exports.bonReceptionSchema = void 0;
const validacion_1 = require("../utils/validacion");
const z = __importStar(require("zod"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const logger = logger_1.LoggerFactory.getLogger('bonsReceptionController');
// Esquema para validar items del albarán
const bonReceptionItemSchema = z.object({
    descripcion: z.string().min(1, "La descripción es obligatoria"),
    cantidad: z.number().positive("La cantidad debe ser positiva"),
    precioUnitario: z.number().positive("El precio debe ser positivo"),
});
// Esquema para validar el albarán completo
exports.bonReceptionSchema = z.object({
    proveedorId: z.string().min(1, "Selecciona un proveedor"),
    fecha: z.string().min(1, "La fecha es obligatoria"),
    numero: z.string().min(1, "El número de albarán es obligatorio"),
    referencia: z.string().optional(),
    notas: z.string().optional(),
    items: z.array(bonReceptionItemSchema).min(1, "Agrega al menos un artículo"),
    totalHT: z.number().positive(),
});
// Path al archivo JSON donde se guardarán los albaranes
const dataFilePath = path_1.default.resolve(__dirname, '../data/bonsReception.json');
// Función para cargar los albaranes desde el archivo
const cargarBons = () => {
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
        logger.error('Error al cargar bons de réception:', error);
        return [];
    }
};
// Función para guardar los albaranes en el archivo
const guardarBons = (bons) => {
    try {
        const dirPath = path_1.default.dirname(dataFilePath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        fs_1.default.writeFileSync(dataFilePath, JSON.stringify(bons, null, 2));
    }
    catch (error) {
        logger.error('Error al guardar bons de réception:', error);
    }
};
// Controladores
exports.bonsReceptionController = {
    // Obtener todos los albaranes
    getAll: (req, res) => {
        try {
            logger.info('Obteniendo todos los bons de réception');
            const bons = cargarBons();
            return res.status(200).json(bons);
        }
        catch (error) {
            logger.error('Error al obtener bons de réception:', error);
            return res.status(500).json({ mensaje: 'Error al obtener los bons de réception' });
        }
    },
    // Obtener un albarán por ID
    getById: (req, res) => {
        try {
            const { id } = req.params;
            logger.info(`Obteniendo bon de réception con ID: ${id}`);
            const bons = cargarBons();
            const bon = bons.find(b => b._id === id);
            if (!bon) {
                return res.status(404).json({ mensaje: 'Bon de réception no encontrado' });
            }
            return res.status(200).json(bon);
        }
        catch (error) {
            logger.error(`Error al obtener bon de réception con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al obtener el bon de réception' });
        }
    },
    // Crear un nuevo albarán
    create: (req, res) => {
        try {
            const bonData = req.body;
            logger.info(`Creando nuevo bon de réception: ${bonData.numero}`);
            // Agregar un ID único
            const nuevoBon = {
                ...bonData,
                _id: (0, uuid_1.v4)(),
                createdAt: new Date().toISOString()
            };
            // Cargar los albaranes existentes y agregar el nuevo
            const bons = cargarBons();
            bons.push(nuevoBon);
            // Guardar los cambios
            guardarBons(bons);
            return res.status(201).json(nuevoBon);
        }
        catch (error) {
            logger.error('Error al crear bon de réception:', error);
            return res.status(500).json({ mensaje: 'Error al crear el bon de réception' });
        }
    },
    // Actualizar un albarán existente
    update: (req, res) => {
        try {
            const { id } = req.params;
            const bonData = req.body;
            logger.info(`Actualizando bon de réception con ID: ${id}`);
            // Cargar los albaranes
            const bons = cargarBons();
            const bonIndex = bons.findIndex(b => b._id === id);
            if (bonIndex === -1) {
                return res.status(404).json({ mensaje: 'Bon de réception no encontrado' });
            }
            // Actualizar el albarán
            const bonActualizado = {
                ...bons[bonIndex],
                ...bonData,
                updatedAt: new Date().toISOString()
            };
            bons[bonIndex] = bonActualizado;
            // Guardar los cambios
            guardarBons(bons);
            return res.status(200).json(bonActualizado);
        }
        catch (error) {
            logger.error(`Error al actualizar bon de réception con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al actualizar el bon de réception' });
        }
    },
    // Eliminar un albarán
    delete: (req, res) => {
        try {
            const { id } = req.params;
            logger.info(`Eliminando bon de réception con ID: ${id}`);
            // Cargar los albaranes
            const bons = cargarBons();
            const bonIndex = bons.findIndex(b => b._id === id);
            if (bonIndex === -1) {
                return res.status(404).json({ mensaje: 'Bon de réception no encontrado' });
            }
            // Eliminar el albarán
            bons.splice(bonIndex, 1);
            // Guardar los cambios
            guardarBons(bons);
            return res.status(200).json({ mensaje: 'Bon de réception eliminado correctamente' });
        }
        catch (error) {
            logger.error(`Error al eliminar bon de réception con ID ${req.params.id}:`, error);
            return res.status(500).json({ mensaje: 'Error al eliminar el bon de réception' });
        }
    }
};
// Middleware de validación para crear albarán
exports.validarCreateBonReception = (0, validacion_1.validarEsquemaMiddleware)(exports.bonReceptionSchema);
// Middleware de validación para actualizar albarán
exports.validarUpdateBonReception = (0, validacion_1.validarEsquemaMiddleware)(exports.bonReceptionSchema.partial());
