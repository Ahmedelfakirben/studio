import { Request, Response } from 'express';
import { prisma } from '../index';

// Obtener todos los clientes
export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { razonSocial: 'asc' }
    });
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los clientes' });
  }
};

// Obtener un cliente por ID
export const getClienteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        facturas: true,
        prefacturas: true,
        bonsLivraison: true
      }
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el cliente' });
  }
};

// Crear un nuevo cliente
export const createCliente = async (req: Request, res: Response) => {
  const { razonSocial, direccion, numeroTVA, telefono, email } = req.body;

  try {
    const cliente = await prisma.cliente.create({
      data: {
        razonSocial,
        direccion,
        numeroTVA,
        telefono,
        email
      }
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el cliente' });
  }
};

// Actualizar un cliente
export const updateCliente = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { razonSocial, direccion, numeroTVA, telefono, email } = req.body;

  try {
    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        razonSocial,
        direccion,
        numeroTVA,
        telefono,
        email
      }
    });

    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el cliente' });
  }
};

// Eliminar un cliente
export const deleteCliente = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.cliente.delete({
      where: { id }
    });

    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el cliente' });
  }
};