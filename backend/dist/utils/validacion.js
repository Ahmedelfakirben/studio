"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarEsquemaMiddleware = void 0;
const zod_1 = require("zod");
const logger_1 = require("./logger");
const logger = logger_1.LoggerFactory.getLogger('validacion');
/**
 * Middleware para validar datos de petición con Zod
 * @param schema Esquema de validación Zod
 * @returns Middleware de Express
 */
const validarEsquemaMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            // Validar el cuerpo de la petición contra el esquema
            schema.parse(req.body);
            next();
        }
        catch (error) {
            logger.error('Error de validación:', error);
            // Si es un error de Zod, devuelve los errores formateados
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    mensaje: 'Datos inválidos',
                    errores: error.errors.map(err => ({
                        campo: err.path.join('.'),
                        mensaje: err.message
                    }))
                });
            }
            // Si es otro tipo de error, devuelve un error genérico
            return res.status(500).json({
                mensaje: 'Error al validar datos'
            });
        }
    };
};
exports.validarEsquemaMiddleware = validarEsquemaMiddleware;
