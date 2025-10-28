import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los gastos de combustible
export const obtenerFraisEssence = async (req: Request, res: Response) => {
  try {
    const fraisEssence = await prisma.fraisEssence.findMany();
    return res.json(fraisEssence);
  } catch (error) {
    console.error('Error al obtener gastos de combustible:', error);
    return res.status(500).json({ mensaje: 'Error al obtener gastos de combustible' });
  }
};

// Obtener un gasto de combustible por ID
export const obtenerFraisEssencePorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const fraisEssence = await prisma.fraisEssence.findUnique({
      where: { id }
    });

    if (!fraisEssence) {
      return res.status(404).json({ mensaje: 'Gasto de combustible no encontrado' });
    }

    return res.json(fraisEssence);
  } catch (error) {
    console.error('Error al obtener gasto de combustible:', error);
    return res.status(500).json({ mensaje: 'Error al obtener gasto de combustible' });
  }
};

// Crear un nuevo gasto de combustible
export const crearFraisEssence = async (req: Request, res: Response) => {
  const {
    fecha,
    numeroBL,
    designacionServicio,
    monto
  } = req.body;

  try {
    const nuevoFraisEssence = await prisma.fraisEssence.create({
      data: {
        fecha: new Date(fecha),
        numeroBL,
        designacionServicio,
        monto
      }
    });

    return res.status(201).json(nuevoFraisEssence);
  } catch (error) {
    console.error('Error al crear gasto de combustible:', error);
    return res.status(500).json({ mensaje: 'Error al crear gasto de combustible' });
  }
};

// Actualizar un gasto de combustible existente
export const actualizarFraisEssence = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    fecha,
    numeroBL,
    designacionServicio,
    monto
  } = req.body;

  try {
    // Verificar si el gasto de combustible existe
    const fraisEssenceExiste = await prisma.fraisEssence.findUnique({
      where: { id }
    });

    if (!fraisEssenceExiste) {
      return res.status(404).json({ mensaje: 'Gasto de combustible no encontrado' });
    }

    // Actualizar el gasto de combustible
    const fraisEssenceActualizado = await prisma.fraisEssence.update({
      where: { id },
      data: {
        fecha: fecha ? new Date(fecha) : undefined,
        numeroBL,
        designacionServicio,
        monto
      }
    });

    return res.json(fraisEssenceActualizado);
  } catch (error) {
    console.error('Error al actualizar gasto de combustible:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar gasto de combustible' });
  }
};

// Eliminar un gasto de combustible
export const eliminarFraisEssence = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar si el gasto de combustible existe
    const fraisEssenceExiste = await prisma.fraisEssence.findUnique({
      where: { id }
    });

    if (!fraisEssenceExiste) {
      return res.status(404).json({ mensaje: 'Gasto de combustible no encontrado' });
    }

    // Eliminar el gasto de combustible
    await prisma.fraisEssence.delete({
      where: { id }
    });

    return res.json({ mensaje: 'Gasto de combustible eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar gasto de combustible:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar gasto de combustible' });
  }
};