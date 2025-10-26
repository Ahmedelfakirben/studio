import { Request, Response } from 'express';
import { prisma } from '../index';

// Obtener todas las facturas
export const getFacturas = async (req: Request, res: Response) => {
  try {
    const facturas = await prisma.factura.findMany({
      include: {
        cliente: true,
        lineasDetalle: true
      },
      orderBy: { fecha: 'desc' }
    });
    res.json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las facturas' });
  }
};

// Obtener una factura por ID
export const getFacturaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const factura = await prisma.factura.findUnique({
      where: { id },
      include: {
        cliente: true,
        lineasDetalle: true
      }
    });

    if (!factura) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }

    res.json(factura);
  } catch (error) {
    console.error('Error al obtener factura:', error);
    res.status(500).json({ mensaje: 'Error al obtener la factura' });
  }
};

// Crear una nueva factura
export const createFactura = async (req: Request, res: Response) => {
  try {
    console.log('📥 Datos recibidos para crear factura:', JSON.stringify(req.body, null, 2));
    
    const { numero, fecha, referenciaProyecto, clienteId, lineasDetalle, montoHT, montTVA, montoTTC } = req.body;

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

    if (!lineasDetalle || lineasDetalle.length === 0) {
      return res.status(400).json({ mensaje: 'Debe incluir al menos una línea de detalle' });
    }

    // Verificar que el cliente existe
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });

    if (!clienteExiste) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    console.log('✅ Cliente encontrado:', clienteExiste.razonSocial);

    // Crear la factura con sus líneas
    const factura = await prisma.factura.create({
      data: {
        numero,
        fecha: new Date(fecha),
        referenciaProyecto: referenciaProyecto || null,
        clienteId,
        montoHT: parseFloat(montoHT),
        montTVA: parseFloat(montTVA),
        montoTTC: parseFloat(montoTTC),
        lineasDetalle: {
          create: lineasDetalle.map((linea: any) => ({
            numeroPrix: linea.numeroPrix,
            designacion: linea.designacion,
            unidad: linea.unidad,
            cantidad: parseFloat(linea.cantidad),
            precioUnitario: parseFloat(linea.precioUnitario),
            montoHT: parseFloat(linea.montoHT)
          }))
        }
      },
      include: {
        cliente: true,
        lineasDetalle: true
      }
    });

    console.log('✅ Factura creada exitosamente:', factura.numero);
    res.status(201).json(factura);
  } catch (error: any) {
    console.error('❌ Error al crear la factura:', error);
    res.status(500).json({ 
      mensaje: 'Error al crear la factura',
      error: error.message,
      detalles: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Actualizar una factura
export const updateFactura = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    console.log('📝 Actualizando factura:', id);
    console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    const { numero, fecha, referenciaProyecto, clienteId, lineasDetalle, montoHT, montTVA, montoTTC } = req.body;

    // Verificar que la factura existe
    const facturaExiste = await prisma.factura.findUnique({
      where: { id }
    });

    if (!facturaExiste) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }

    // Primero eliminamos las líneas de detalle existentes
    await prisma.lineaDetalle.deleteMany({
      where: { facturaId: id }
    });

    console.log('🗑️ Líneas anteriores eliminadas');

    // Luego actualizamos la factura y creamos nuevas líneas
    const factura = await prisma.factura.update({
      where: { id },
      data: {
        numero,
        fecha: new Date(fecha),
        referenciaProyecto: referenciaProyecto || null,
        clienteId,
        montoHT: parseFloat(montoHT),
        montTVA: parseFloat(montTVA),
        montoTTC: parseFloat(montoTTC),
        lineasDetalle: {
          create: lineasDetalle.map((linea: any) => ({
            numeroPrix: linea.numeroPrix,
            designacion: linea.designacion,
            unidad: linea.unidad,
            cantidad: parseFloat(linea.cantidad),
            precioUnitario: parseFloat(linea.precioUnitario),
            montoHT: parseFloat(linea.montoHT)
          }))
        }
      },
      include: {
        cliente: true,
        lineasDetalle: true
      }
    });

    console.log('✅ Factura actualizada exitosamente');
    res.json(factura);
  } catch (error: any) {
    console.error('❌ Error al actualizar la factura:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar la factura',
      error: error.message
    });
  }
};

// Eliminar una factura
export const deleteFactura = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    console.log('🗑️ Eliminando factura:', id);
    
    // Verificar que la factura existe
    const facturaExiste = await prisma.factura.findUnique({
      where: { id }
    });

    if (!facturaExiste) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }

    // Primero eliminar las líneas de detalle
    await prisma.lineaDetalle.deleteMany({
      where: { facturaId: id }
    });

    // Luego eliminar la factura
    await prisma.factura.delete({
      where: { id }
    });

    console.log('✅ Factura eliminada exitosamente');
    res.json({ mensaje: 'Factura eliminada correctamente' });
  } catch (error: any) {
    console.error('❌ Error al eliminar la factura:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar la factura',
      error: error.message
    });
  }
};
