import { Request, Response } from 'express';
import { validarEsquemaMiddleware } from '../utils/validacion';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { LoggerFactory } from '../utils/logger';

const logger = LoggerFactory.getLogger('bonsReceptionController');

// Esquema para validar items del albarán
const bonReceptionItemSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  cantidad: z.number().positive("La cantidad debe ser positiva"),
  precioUnitario: z.number().positive("El precio debe ser positivo"),
});

// Esquema para validar el albarán completo
export const bonReceptionSchema = z.object({
  proveedorId: z.string().min(1, "Selecciona un proveedor"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  numero: z.string().min(1, "El número de albarán es obligatorio"),
  referencia: z.string().optional(),
  notas: z.string().optional(),
  items: z.array(bonReceptionItemSchema).min(1, "Agrega al menos un artículo"),
  totalHT: z.number().positive(),
});

// Path al archivo JSON donde se guardarán los albaranes
const dataFilePath = path.resolve(__dirname, '../data/bonsReception.json');

// Función para cargar los albaranes desde el archivo
const cargarBons = (): any[] => {
  try {
    // Si el directorio no existe, créalo
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Si el archivo no existe, crea uno vacío
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
      return [];
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Error al cargar bons de réception:', error);
    return [];
  }
};

// Función para guardar los albaranes en el archivo
const guardarBons = (bons: any[]): void => {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(bons, null, 2));
  } catch (error) {
    logger.error('Error al guardar bons de réception:', error);
  }
};

// Controladores
export const bonsReceptionController = {
  // Obtener todos los albaranes
  getAll: (req: Request, res: Response) => {
    try {
      logger.info('Obteniendo todos los bons de réception');
      const bons = cargarBons();
      return res.status(200).json(bons);
    } catch (error) {
      logger.error('Error al obtener bons de réception:', error);
      return res.status(500).json({ mensaje: 'Error al obtener los bons de réception' });
    }
  },
  
  // Obtener un albarán por ID
  getById: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Obteniendo bon de réception con ID: ${id}`);
      
      const bons = cargarBons();
      const bon = bons.find(b => b._id === id);
      
      if (!bon) {
        return res.status(404).json({ mensaje: 'Bon de réception no encontrado' });
      }
      
      return res.status(200).json(bon);
    } catch (error) {
      logger.error(`Error al obtener bon de réception con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al obtener el bon de réception' });
    }
  },
  
  // Crear un nuevo albarán
  create: (req: Request, res: Response) => {
    try {
      const bonData = req.body;
      logger.info(`Creando nuevo bon de réception: ${bonData.numero}`);
      
      // Agregar un ID único
      const nuevoBon = {
        ...bonData,
        _id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      
      // Cargar los albaranes existentes y agregar el nuevo
      const bons = cargarBons();
      bons.push(nuevoBon);
      
      // Guardar los cambios
      guardarBons(bons);
      
      return res.status(201).json(nuevoBon);
    } catch (error) {
      logger.error('Error al crear bon de réception:', error);
      return res.status(500).json({ mensaje: 'Error al crear el bon de réception' });
    }
  },
  
  // Actualizar un albarán existente
  update: (req: Request, res: Response) => {
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
    } catch (error) {
      logger.error(`Error al actualizar bon de réception con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al actualizar el bon de réception' });
    }
  },
  
  // Eliminar un albarán
  delete: (req: Request, res: Response) => {
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
    } catch (error) {
      logger.error(`Error al eliminar bon de réception con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al eliminar el bon de réception' });
    }
  }
};

// Middleware de validación para crear albarán
export const validarCreateBonReception = validarEsquemaMiddleware(bonReceptionSchema);

// Middleware de validación para actualizar albarán
export const validarUpdateBonReception = validarEsquemaMiddleware(bonReceptionSchema.partial());
