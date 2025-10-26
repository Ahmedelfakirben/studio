import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';
import { LoggerFactory } from './logger';

const logger = LoggerFactory.getLogger('validacion');

/**
 * Middleware para validar datos de petición con Zod
 * @param schema Esquema de validación Zod
 * @returns Middleware de Express
 */
export const validarEsquemaMiddleware = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar el cuerpo de la petición contra el esquema
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.error('Error de validación:', error);
      
      // Si es un error de Zod, devuelve los errores formateados
      if (error instanceof z.ZodError) {
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
