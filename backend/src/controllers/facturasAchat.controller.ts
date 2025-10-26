import { Request, Response } from 'express';
import { validarEsquemaMiddleware } from '../utils/validacion';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { LoggerFactory } from '../utils/logger';

const logger = LoggerFactory.getLogger('facturasAchatController');

// Esquema para validar items de la factura
const facturaAchatItemSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  cantidad: z.number().positive("La cantidad debe ser positiva"),
  precioUnitario: z.number().positive("El precio debe ser positivo"),
  tipoIVA: z.number().min(0).max(100),
});

// Esquema para validar la factura completa
export const facturaAchatSchema = z.object({
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
const dataFilePath = path.resolve(__dirname, '../data/facturasAchat.json');

// Función para cargar las facturas desde el archivo
const cargarFacturas = (): any[] => {
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
    logger.error('Error al cargar facturas de compra:', error);
    return [];
  }
};

// Función para guardar las facturas en el archivo
const guardarFacturas = (facturas: any[]): void => {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(facturas, null, 2));
  } catch (error) {
    logger.error('Error al guardar facturas de compra:', error);
  }
};

// Controladores
export const facturasAchatController = {
  // Obtener todas las facturas
  getAll: (req: Request, res: Response) => {
    try {
      logger.info('Obteniendo todas las facturas de compra');
      const facturas = cargarFacturas();
      return res.status(200).json(facturas);
    } catch (error) {
      logger.error('Error al obtener facturas de compra:', error);
      return res.status(500).json({ mensaje: 'Error al obtener las facturas de compra' });
    }
  },
  
  // Obtener una factura por ID
  getById: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Obteniendo factura de compra con ID: ${id}`);
      
      const facturas = cargarFacturas();
      const factura = facturas.find(f => f._id === id);
      
      if (!factura) {
        return res.status(404).json({ mensaje: 'Factura no encontrada' });
      }
      
      return res.status(200).json(factura);
    } catch (error) {
      logger.error(`Error al obtener factura de compra con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al obtener la factura de compra' });
    }
  },
  
  // Crear una nueva factura
  create: (req: Request, res: Response) => {
    try {
      const facturaData = req.body;
      logger.info(`Creando nueva factura de compra: ${facturaData.numero}`);
      
      // Agregar un ID único
      const nuevaFactura = {
        ...facturaData,
        _id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      
      // Cargar las facturas existentes y agregar la nueva
      const facturas = cargarFacturas();
      facturas.push(nuevaFactura);
      
      // Guardar los cambios
      guardarFacturas(facturas);
      
      return res.status(201).json(nuevaFactura);
    } catch (error) {
      logger.error('Error al crear factura de compra:', error);
      return res.status(500).json({ mensaje: 'Error al crear la factura de compra' });
    }
  },
  
  // Actualizar una factura existente
  update: (req: Request, res: Response) => {
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
    } catch (error) {
      logger.error(`Error al actualizar factura de compra con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al actualizar la factura de compra' });
    }
  },
  
  // Eliminar una factura
  delete: (req: Request, res: Response) => {
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
    } catch (error) {
      logger.error(`Error al eliminar factura de compra con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al eliminar la factura de compra' });
    }
  }
};

// Middleware de validación para crear factura
export const validarCreateFacturaAchat = validarEsquemaMiddleware(facturaAchatSchema);

// Middleware de validación para actualizar factura
export const validarUpdateFacturaAchat = validarEsquemaMiddleware(facturaAchatSchema.partial());
