import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los registros de alquiler de equipos
export const obtenerLocationMateriel = async (req: Request, res: Response) => {
  try {
    const locationMateriel = await prisma.locationMateriel.findMany({
      include: {
        registros: true,
        proveedor: true
      }
    });
    return res.json(locationMateriel);
  } catch (error) {
    console.error('Error al obtener registros de alquiler:', error);
    return res.status(500).json({ mensaje: 'Error al obtener registros de alquiler' });
  }
};

// Obtener un registro de alquiler por ID
export const obtenerLocationMaterielPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const locationMateriel = await prisma.locationMateriel.findUnique({
      where: { id },
      include: {
        registros: true,
        proveedor: true
      }
    });

    if (!locationMateriel) {
      return res.status(404).json({ mensaje: 'Registro de alquiler no encontrado' });
    }

    return res.json(locationMateriel);
  } catch (error) {
    console.error('Error al obtener registro de alquiler:', error);
    return res.status(500).json({ mensaje: 'Error al obtener registro de alquiler' });
  }
};

// Crear un nuevo registro de alquiler
export const crearLocationMateriel = async (req: Request, res: Response) => {
  const {
    titulo,
    periodo,
    proveedorId,
    registros,
    totalGeneral
  } = req.body;

  try {
    const nuevoLocationMateriel = await prisma.locationMateriel.create({
      data: {
        titulo,
        periodo,
        proveedorId: proveedorId || null,
        totalGeneral,
        registros: {
          create: registros?.map((registro: any) => ({
            fecha: new Date(registro.fecha),
            numeroBL: registro.numeroBL,
            tipoMaterial: registro.tipoMaterial,
            unidad: registro.unidad,
            cantidad: registro.cantidad,
            precioUnitario: registro.precioUnitario,
            precioTotal: registro.precioTotal
          })) || []
        }
      },
      include: {
        registros: true,
        proveedor: true
      }
    });

    return res.status(201).json(nuevoLocationMateriel);
  } catch (error) {
    console.error('Error al crear registro de alquiler:', error);
    return res.status(500).json({ mensaje: 'Error al crear registro de alquiler' });
  }
};

// Actualizar un registro de alquiler existente
export const actualizarLocationMateriel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    titulo,
    periodo,
    proveedorId,
    totalGeneral
  } = req.body;

  try {
    // Verificar si el registro de alquiler existe
    const locationMaterielExiste = await prisma.locationMateriel.findUnique({
      where: { id }
    });

    if (!locationMaterielExiste) {
      return res.status(404).json({ mensaje: 'Registro de alquiler no encontrado' });
    }

    // Actualizar el registro de alquiler
    const locationMaterielActualizado = await prisma.locationMateriel.update({
      where: { id },
      data: {
        titulo,
        periodo,
        proveedorId: proveedorId || null,
        totalGeneral
      },
      include: {
        registros: true,
        proveedor: true
      }
    });

    return res.json(locationMaterielActualizado);
  } catch (error) {
    console.error('Error al actualizar registro de alquiler:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar registro de alquiler' });
  }
};

// Eliminar un registro de alquiler
export const eliminarLocationMateriel = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar si el registro de alquiler existe
    const locationMaterielExiste = await prisma.locationMateriel.findUnique({
      where: { id }
    });

    if (!locationMaterielExiste) {
      return res.status(404).json({ mensaje: 'Registro de alquiler no encontrado' });
    }

    // Eliminar registros asociados
    await prisma.registroLocation.deleteMany({
      where: { locationMaterielId: id }
    });

    // Eliminar el registro de alquiler
    await prisma.locationMateriel.delete({
      where: { id }
    });

    return res.json({ mensaje: 'Registro de alquiler eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar registro de alquiler:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar registro de alquiler' });
  }
};