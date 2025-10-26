import { Request, Response } from 'express';
import { prisma } from '../index';

// Obtener todos los proveedores
export const obtenerProveedores = async (req: Request, res: Response) => {
  try {
    console.log('✅ Obteniendo todos los proveedores');
    const proveedores = await prisma.proveedor.findMany({
      orderBy: { razonSocial: 'asc' }
    });
    console.log(`✅ Proveedores encontrados: ${proveedores.length}`);
    console.log('📋 Lista de proveedores:', proveedores.map(p => ({ id: p.id, razonSocial: p.razonSocial })));
    return res.json(proveedores);
  } catch (error) {
    console.error('❌ Error al obtener proveedores:', error);
    return res.status(500).json({ mensaje: 'Error al obtener proveedores', error: error });
  }
};

// Obtener un proveedor por ID
export const obtenerProveedorPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id }
    });
    
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    return res.json(proveedor);
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    return res.status(500).json({ mensaje: 'Error al obtener proveedor' });
  }
};

// Crear proveedores de ejemplo (para desarrollo)
export const crearProveedoresEjemplo = async (req: Request, res: Response) => {
  try {
    console.log('📝 Creando proveedores de ejemplo...');
    
    const proveedoresEjemplo = [
      {
        razonSocial: 'Matériaux Express',
        direccion: '123 Rue de la Construction\n75001 Paris, France',
        numeroTVA: 'FR12345678901',
        telefono: '+33 123456789',
        email: 'contact@materiaux-express.fr'
      },
      {
        razonSocial: 'Béton Pro',
        direccion: '456 Avenue du Béton\n69000 Lyon, France',
        numeroTVA: 'FR98765432109',
        telefono: '+33 987654321',
        email: 'info@betonpro.fr'
      },
      {
        razonSocial: 'Acier Durable S.L.',
        direccion: '789 Calle del Acero\n28001 Madrid, España',
        numeroTVA: 'ES87654321098',
        telefono: '+34 612345678',
        email: 'commercial@acier-durable.es'
      }
    ];
    
    const proveedoresCreados = [];
    
    for (const proveedorData of proveedoresEjemplo) {
      // Verificar si ya existe
      const existente = await prisma.proveedor.findFirst({
        where: { razonSocial: proveedorData.razonSocial }
      });
      
      if (!existente) {
        const proveedor = await prisma.proveedor.create({ data: proveedorData });
        proveedoresCreados.push(proveedor);
        console.log(`✅ Proveedor creado: ${proveedor.razonSocial}`);
      } else {
        console.log(`⚠️ Proveedor ya existe: ${proveedorData.razonSocial}`);
      }
    }
    
    return res.json({
      mensaje: `${proveedoresCreados.length} proveedores de ejemplo creados`,
      proveedores: proveedoresCreados
    });
  } catch (error) {
    console.error('❌ Error al crear proveedores de ejemplo:', error);
    return res.status(500).json({ mensaje: 'Error al crear proveedores de ejemplo', error: error });
  }
};

// Crear un nuevo proveedor
export const crearProveedor = async (req: Request, res: Response) => {
  const { 
    nombre, 
    direccion, 
    numeroTVA, 
    telefono, 
    email,
    notas,
    razonSocial
  } = req.body;
  
  console.log('📝 Datos recibidos para crear proveedor:', req.body);
  
  // Usamos razonSocial si está presente, de lo contrario usamos nombre
  const nombreProveedor = razonSocial || nombre;
  
  if (!nombreProveedor) {
    console.log('❌ Error: Falta nombre del proveedor');
    return res.status(400).json({ mensaje: 'El nombre o razón social es obligatorio' });
  }
  
  try {
    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        razonSocial: nombreProveedor,
        direccion: direccion || '',
        numeroTVA: numeroTVA || null,
        telefono: telefono || null,
        email: email || null
      }
    });
    
    console.log('✅ Proveedor creado exitosamente:', { id: nuevoProveedor.id, razonSocial: nuevoProveedor.razonSocial });
    return res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.error('❌ Error al crear proveedor:', error);
    return res.status(500).json({ mensaje: 'Error al crear proveedor', error: error });
  }
};

// Actualizar un proveedor existente
export const actualizarProveedor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    nombre, 
    direccion, 
    numeroTVA, 
    telefono, 
    email,
    notas,
    razonSocial
  } = req.body;
  
  // Usamos razonSocial si está presente, de lo contrario usamos nombre
  const nombreProveedor = razonSocial || nombre;
  
  if (!nombreProveedor) {
    return res.status(400).json({ mensaje: 'El nombre o razón social es obligatorio' });
  }
  
  console.log(`Actualizando proveedor ID: ${id}`, req.body);
  
  try {
    // Verificar si el proveedor existe
    const proveedorExiste = await prisma.proveedor.findUnique({
      where: { id }
    });
    
    if (!proveedorExiste) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    // Actualizar el proveedor
    const proveedorActualizado = await prisma.proveedor.update({
      where: { id },
      data: {
        razonSocial: nombreProveedor,
        direccion: direccion || '',
        numeroTVA,
        telefono,
        email,
      }
    });
    
    console.log('Proveedor actualizado:', proveedorActualizado);
    return res.json(proveedorActualizado);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar proveedor', error });
  }
};

// Eliminar un proveedor
export const eliminarProveedor = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  console.log(`Eliminando proveedor ID: ${id}`);
  
  try {
    // Verificar si el proveedor existe
    const proveedorExiste = await prisma.proveedor.findUnique({
      where: { id }
    });
    
    if (!proveedorExiste) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    // Eliminar el proveedor
    await prisma.proveedor.delete({
      where: { id }
    });
    
    console.log('Proveedor eliminado correctamente');
    return res.json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar proveedor', error });
  }
};