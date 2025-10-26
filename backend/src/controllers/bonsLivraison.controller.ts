import { Request, Response } from 'express';
import { prisma } from '../index';

// Obtener todos los bons de livraison
export const getBonsLivraison = async (req: Request, res: Response) => {
  try {
    const bonsLivraison = await prisma.bonLivraison.findMany({
      include: {
        cliente: true,
        lineasMaterial: true
      },
      orderBy: { fecha: 'desc' }
    });
    res.json(bonsLivraison);
  } catch (error) {
    console.error('Error al obtener bons de livraison:', error);
    res.status(500).json({ mensaje: 'Error al obtener los bons de livraison' });
  }
};

// Obtener un bon de livraison por ID
export const getBonLivraisonById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const bonLivraison = await prisma.bonLivraison.findUnique({
      where: { id },
      include: {
        cliente: true,
        lineasMaterial: true
      }
    });

    if (!bonLivraison) {
      return res.status(404).json({ mensaje: 'Bon de livraison no encontrado' });
    }

    res.json(bonLivraison);
  } catch (error) {
    console.error('Error al obtener bon de livraison:', error);
    res.status(500).json({ mensaje: 'Error al obtener el bon de livraison' });
  }
};

// Crear un nuevo bon de livraison
export const createBonLivraison = async (req: Request, res: Response) => {
  try {
    console.log('📥 Datos recibidos para crear bon de livraison:', JSON.stringify(req.body, null, 2));
    
    const { numero, fecha, referenciaProyecto, clienteId, lineasMaterial } = req.body;

    // Validaciones
    if (!numero || !fecha || !clienteId) {
      return res.status(400).json({ 
        mensaje: 'Faltan campos obligatorios',
        detalles: {
          numero: !numero ? 'requerido' : 'ok',
          fecha: !fecha ? 'requerido' : 'ok',
          clienteId: !clienteId ? 'requerido' : 'ok'
        }
      });
    }

    if (!lineasMaterial || lineasMaterial.length === 0) {
      return res.status(400).json({ mensaje: 'Debe incluir al menos un material' });
    }

    // Verificar que el cliente existe
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });

    if (!clienteExiste) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    console.log('✅ Cliente encontrado:', clienteExiste.razonSocial);

    // Crear el bon de livraison con sus materiales
    const bonLivraison = await prisma.bonLivraison.create({
      data: {
        numero,
        fecha: new Date(fecha),
        referenciaProyecto: referenciaProyecto || null,
        clienteId,
        lineasMaterial: {
          create: lineasMaterial.map((material: any) => ({
            numeroPrix: material.numeroPrix,
            designacion: material.designacion,
            unidad: material.unidad,
            cantidad: parseFloat(material.cantidad)
          }))
        }
      },
      include: {
        cliente: true,
        lineasMaterial: true
      }
    });

    console.log('✅ Bon de livraison creado exitosamente:', bonLivraison.numero);
    res.status(201).json(bonLivraison);
  } catch (error: any) {
    console.error('❌ Error al crear el bon de livraison:', error);
    res.status(500).json({ 
      mensaje: 'Error al crear el bon de livraison',
      error: error.message,
      detalles: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Actualizar un bon de livraison
export const updateBonLivraison = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    console.log('📝 Actualizando bon de livraison:', id);
    console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    const { numero, fecha, referenciaProyecto, clienteId, lineasMaterial } = req.body;

    // Verificar que el bon existe
    const bonExiste = await prisma.bonLivraison.findUnique({
      where: { id }
    });

    if (!bonExiste) {
      return res.status(404).json({ mensaje: 'Bon de livraison no encontrado' });
    }

    // Primero eliminamos los materiales existentes
    await prisma.lineaMaterial.deleteMany({
      where: { bonLivraisonId: id }
    });

    console.log('🗑️ Materiales anteriores eliminados');

    // Luego actualizamos el bon y creamos nuevos materiales
    const bonLivraison = await prisma.bonLivraison.update({
      where: { id },
      data: {
        numero,
        fecha: new Date(fecha),
        referenciaProyecto: referenciaProyecto || null,
        clienteId,
        lineasMaterial: {
          create: lineasMaterial.map((material: any) => ({
            numeroPrix: material.numeroPrix,
            designacion: material.designacion,
            unidad: material.unidad,
            cantidad: parseFloat(material.cantidad)
          }))
        }
      },
      include: {
        cliente: true,
        lineasMaterial: true
      }
    });

    console.log('✅ Bon de livraison actualizado exitosamente');
    res.json(bonLivraison);
  } catch (error: any) {
    console.error('❌ Error al actualizar el bon de livraison:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar el bon de livraison',
      error: error.message
    });
  }
};

// Eliminar un bon de livraison
export const deleteBonLivraison = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    console.log('🗑️ Eliminando bon de livraison:', id);
    
    // Verificar que el bon existe
    const bonExiste = await prisma.bonLivraison.findUnique({
      where: { id }
    });

    if (!bonExiste) {
      return res.status(404).json({ mensaje: 'Bon de livraison no encontrado' });
    }

    // Primero eliminar los materiales
    await prisma.lineaMaterial.deleteMany({
      where: { bonLivraisonId: id }
    });

    // Luego eliminar el bon
    await prisma.bonLivraison.delete({
      where: { id }
    });

    console.log('✅ Bon de livraison eliminado exitosamente');
    res.json({ mensaje: 'Bon de livraison eliminado correctamente' });
  } catch (error: any) {
    console.error('❌ Error al eliminar el bon de livraison:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar el bon de livraison',
      error: error.message
    });
  }
};
