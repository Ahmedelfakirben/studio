import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los registros de alquiler de equipos
export const obtenerLocationMateriel = async (req: Request, res: Response) => {
  try {
    const locationMateriel = await prisma.locationMateriel.findMany({
      include: {
        registros: true
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
      where: { id: Number(id) },
      include: {
        registros: true
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
    equipo, 
    proveedor, 
    fechaInicio, 
    fechaFin, 
    costoDiario, 
    costoTotal, 
    registros,
    notas 
  } = req.body;
  
  try {
    const nuevoLocationMateriel = await prisma.locationMateriel.create({
      data: {
        equipo,
        proveedor,
        fechaInicio: new Date(fechaInicio),
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        costoDiario,
        costoTotal,
        notas,
        registros: {
          create: registros?.map((registro: any) => ({
            fecha: new Date(registro.fecha),
            horasUtilizadas: registro.horasUtilizadas,
            proyecto: registro.proyecto,
            notas: registro.notas
          })) || []
        }
      },
      include: {
        registros: true
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
    equipo, 
    proveedor, 
    fechaInicio, 
    fechaFin, 
    costoDiario, 
    costoTotal, 
    notas 
  } = req.body;
  
  try {
    // Verificar si el registro de alquiler existe
    const locationMaterielExiste = await prisma.locationMateriel.findUnique({
      where: { id: Number(id) }
    });
    
    if (!locationMaterielExiste) {
      return res.status(404).json({ mensaje: 'Registro de alquiler no encontrado' });
    }
    
    // Actualizar el registro de alquiler
    const locationMaterielActualizado = await prisma.locationMateriel.update({
      where: { id: Number(id) },
      data: {
        equipo,
        proveedor,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        costoDiario,
        costoTotal,
        notas
      },
      include: {
        registros: true
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
      where: { id: Number(id) }
    });
    
    if (!locationMaterielExiste) {
      return res.status(404).json({ mensaje: 'Registro de alquiler no encontrado' });
    }
    
    // Eliminar registros asociados
    await prisma.registroLocation.deleteMany({
      where: { locationMaterielId: Number(id) }
    });
    
    // Eliminar el registro de alquiler
    await prisma.locationMateriel.delete({
      where: { id: Number(id) }
    });
    
    return res.json({ mensaje: 'Registro de alquiler eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar registro de alquiler:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar registro de alquiler' });
  }
};