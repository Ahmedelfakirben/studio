import { Request, Response } from 'express';
import { validarEsquemaMiddleware } from '../utils/validacion';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { LoggerFactory } from '../utils/logger';

const logger = LoggerFactory.getLogger('prefacturasAchatController');

// Esquema para validar items de la prefactura
const prefacturaAchatItemSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  cantidad: z.number().positive("La cantidad debe ser positiva"),
  precioUnitario: z.number().positive("El precio debe ser positivo"),
  tipoIVA: z.number().min(0).max(100),
});

// Esquema para validar la prefactura completa
export const prefacturaAchatSchema = z.object({
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
const dataFilePath = path.resolve(__dirname, '../data/prefacturasAchat.json');
const facturasAchatPath = path.resolve(__dirname, '../data/facturasAchat.json');

// Función para cargar las prefacturas desde el archivo
const cargarPrefacturas = (): any[] => {
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
    logger.error('Error al cargar prefacturas de compra:', error);
    return [];
  }
};

// Función para guardar las prefacturas en el archivo
const guardarPrefacturas = (prefacturas: any[]): void => {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(prefacturas, null, 2));
  } catch (error) {
    logger.error('Error al guardar prefacturas de compra:', error);
  }
};

// Función para cargar las facturas de compra desde el archivo
const cargarFacturasAchat = (): any[] => {
  try {
    // Si el directorio no existe, créalo
    const dirPath = path.dirname(facturasAchatPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Si el archivo no existe, crea uno vacío
    if (!fs.existsSync(facturasAchatPath)) {
      fs.writeFileSync(facturasAchatPath, JSON.stringify([]));
      return [];
    }
    
    const data = fs.readFileSync(facturasAchatPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Error al cargar facturas de compra:', error);
    return [];
  }
};

// Función para guardar las facturas de compra en el archivo
const guardarFacturasAchat = (facturas: any[]): void => {
  try {
    const dirPath = path.dirname(facturasAchatPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(facturasAchatPath, JSON.stringify(facturas, null, 2));
  } catch (error) {
    logger.error('Error al guardar facturas de compra:', error);
  }
};

// Controladores
export const prefacturasAchatController = {
  // Obtener todas las prefacturas
  getAll: (req: Request, res: Response) => {
    try {
      logger.info('Obteniendo todas las prefacturas de compra');
      const prefacturas = cargarPrefacturas();
      return res.status(200).json(prefacturas);
    } catch (error) {
      logger.error('Error al obtener prefacturas de compra:', error);
      return res.status(500).json({ mensaje: 'Error al obtener las prefacturas de compra' });
    }
  },
  
  // Obtener una prefactura por ID
  getById: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Obteniendo prefactura de compra con ID: ${id}`);
      
      const prefacturas = cargarPrefacturas();
      const prefactura = prefacturas.find(f => f._id === id);
      
      if (!prefactura) {
        return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
      }
      
      return res.status(200).json(prefactura);
    } catch (error) {
      logger.error(`Error al obtener prefactura de compra con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al obtener la prefactura de compra' });
    }
  },
  
  // Crear una nueva prefactura
  create: (req: Request, res: Response) => {
    try {
      const prefacturaData = req.body;
      logger.info(`Creando nueva prefactura de compra: ${prefacturaData.numero}`);
      
      // Agregar un ID único
      const nuevaPrefactura = {
        ...prefacturaData,
        _id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      
      // Cargar las prefacturas existentes y agregar la nueva
      const prefacturas = cargarPrefacturas();
      prefacturas.push(nuevaPrefactura);
      
      // Guardar los cambios
      guardarPrefacturas(prefacturas);
      
      return res.status(201).json(nuevaPrefactura);
    } catch (error) {
      logger.error('Error al crear prefactura de compra:', error);
      return res.status(500).json({ mensaje: 'Error al crear la prefactura de compra' });
    }
  },
  
  // Actualizar una prefactura existente
  update: (req: Request, res: Response) => {
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
    } catch (error) {
      logger.error(`Error al actualizar prefactura de compra con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al actualizar la prefactura de compra' });
    }
  },
  
  // Eliminar una prefactura
  delete: (req: Request, res: Response) => {
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
    } catch (error) {
      logger.error(`Error al eliminar prefactura de compra con ID ${req.params.id}:`, error);
      return res.status(500).json({ mensaje: 'Error al eliminar la prefactura de compra' });
    }
  },
  
  // Convertir prefactura a factura
  convertToFactura: (req: Request, res: Response) => {
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
        _id: uuidv4(),
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
    } catch (error) {
      logger.error(`Error al convertir prefactura de compra con ID ${req.params.id} a factura:`, error);
      return res.status(500).json({ mensaje: 'Error al convertir la prefactura a factura' });
    }
  }
};

// Middleware de validación para crear prefactura
export const validarCreatePrefacturaAchat = validarEsquemaMiddleware(prefacturaAchatSchema);

// Middleware de validación para actualizar prefactura
export const validarUpdatePrefacturaAchat = validarEsquemaMiddleware(prefacturaAchatSchema.partial());
