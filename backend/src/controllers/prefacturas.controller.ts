import { Request, Response } from 'express';
import { prisma } from '../index';

// Obtener todas las prefacturas
export const getPrefacturas = async (req: Request, res: Response) => {
  try {
    const prefacturas = await prisma.prefactura.findMany({
      include: {
        cliente: true,
        lineasDetalle: true
      },
      orderBy: { fecha: 'desc' }
    });
    res.json(prefacturas);
  } catch (error) {
    console.error('Error al obtener prefacturas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las prefacturas' });
  }
};

// Obtener una prefactura por ID
export const getPrefacturaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const prefactura = await prisma.prefactura.findUnique({
      where: { id },
      include: {
        cliente: true,
        lineasDetalle: true
      }
    });

    if (!prefactura) {
      return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
    }

    res.json(prefactura);
  } catch (error) {
    console.error('Error al obtener prefactura:', error);
    res.status(500).json({ mensaje: 'Error al obtener la prefactura' });
  }
};

// Crear una nueva prefactura
export const createPrefactura = async (req: Request, res: Response) => {
  try {
    console.log('🔵 ===== BACKEND: CREANDO PREFACTURA =====');
    console.log('📥 Endpoint llamado: POST /api/prefacturas');
    console.log('📥 Datos recibidos para crear PREFACTURA:', JSON.stringify(req.body, null, 2));

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
    console.log('🔵 Llamando a prisma.prefactura.create() - MODELO: Prefactura');

    // Crear la prefactura con sus líneas
    const prefactura = await prisma.prefactura.create({
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

    console.log('✅ ===== PREFACTURA CREADA EN BASE DE DATOS =====');
    console.log('✅ Tabla utilizada: Prefactura (NO Factura)');
    console.log('✅ ID generado:', prefactura.id);
    console.log('✅ Número:', prefactura.numero);
    console.log('✅ Líneas de detalle:', prefactura.lineasDetalle.length);
    console.log('✅ Enviando respuesta al cliente...');

    res.status(201).json(prefactura);
  } catch (error: any) {
    console.error('❌ ===== ERROR AL CREAR PREFACTURA =====');
    console.error('❌ Error:', error);
    console.error('❌ Mensaje:', error.message);
    res.status(500).json({
      mensaje: 'Error al crear la prefactura',
      error: error.message,
      detalles: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Actualizar una prefactura
export const updatePrefactura = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    console.log('📝 Actualizando prefactura:', id);
    console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    const { numero, fecha, referenciaProyecto, clienteId, lineasDetalle, montoHT, montTVA, montoTTC } = req.body;

    // Verificar que la prefactura existe
    const prefacturaExiste = await prisma.prefactura.findUnique({
      where: { id }
    });

    if (!prefacturaExiste) {
      return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
    }

    // Primero eliminamos las líneas de detalle existentes
    await prisma.lineaDetalle.deleteMany({
      where: { prefacturaId: id }
    });

    console.log('🗑️ Líneas anteriores eliminadas');

    // Luego actualizamos la prefactura y creamos nuevas líneas
    const prefactura = await prisma.prefactura.update({
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

    console.log('✅ Prefactura actualizada exitosamente');
    res.json(prefactura);
  } catch (error: any) {
    console.error('❌ Error al actualizar la prefactura:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar la prefactura',
      error: error.message
    });
  }
};

// Eliminar una prefactura
export const deletePrefactura = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    console.log('🗑️ Eliminando prefactura:', id);
    
    // Verificar que la prefactura existe
    const prefacturaExiste = await prisma.prefactura.findUnique({
      where: { id }
    });

    if (!prefacturaExiste) {
      return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
    }

    // Primero eliminar las líneas de detalle
    await prisma.lineaDetalle.deleteMany({
      where: { prefacturaId: id }
    });

    // Luego eliminar la prefactura
    await prisma.prefactura.delete({
      where: { id }
    });

    console.log('✅ Prefactura eliminada exitosamente');
    res.json({ mensaje: 'Prefactura eliminada correctamente' });
  } catch (error: any) {
    console.error('❌ Error al eliminar la prefactura:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar la prefactura',
      error: error.message
    });
  }
};
