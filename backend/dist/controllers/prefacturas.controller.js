"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrefactura = exports.updatePrefactura = exports.createPrefactura = exports.getPrefacturaById = exports.getPrefacturas = void 0;
const index_1 = require("../index");
// Obtener todas las prefacturas
const getPrefacturas = async (req, res) => {
    try {
        const prefacturas = await index_1.prisma.prefactura.findMany({
            include: {
                cliente: true,
                lineasDetalle: true
            },
            orderBy: { fecha: 'desc' }
        });
        res.json(prefacturas);
    }
    catch (error) {
        console.error('Error al obtener prefacturas:', error);
        res.status(500).json({ mensaje: 'Error al obtener las prefacturas' });
    }
};
exports.getPrefacturas = getPrefacturas;
// Obtener una prefactura por ID
const getPrefacturaById = async (req, res) => {
    const { id } = req.params;
    try {
        const prefactura = await index_1.prisma.prefactura.findUnique({
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
    }
    catch (error) {
        console.error('Error al obtener prefactura:', error);
        res.status(500).json({ mensaje: 'Error al obtener la prefactura' });
    }
};
exports.getPrefacturaById = getPrefacturaById;
// Crear una nueva prefactura
const createPrefactura = async (req, res) => {
    try {
        console.log('📥 Datos recibidos para crear prefactura:', JSON.stringify(req.body, null, 2));
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
        const clienteExiste = await index_1.prisma.cliente.findUnique({
            where: { id: clienteId }
        });
        if (!clienteExiste) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        console.log('✅ Cliente encontrado:', clienteExiste.razonSocial);
        // Crear la prefactura con sus líneas
        const prefactura = await index_1.prisma.prefactura.create({
            data: {
                numero,
                fecha: new Date(fecha),
                referenciaProyecto: referenciaProyecto || null,
                clienteId,
                montoHT: parseFloat(montoHT),
                montTVA: parseFloat(montTVA),
                montoTTC: parseFloat(montoTTC),
                lineasDetalle: {
                    create: lineasDetalle.map((linea) => ({
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
        console.log('✅ Prefactura creada exitosamente:', prefactura.numero);
        res.status(201).json(prefactura);
    }
    catch (error) {
        console.error('❌ Error al crear la prefactura:', error);
        res.status(500).json({
            mensaje: 'Error al crear la prefactura',
            error: error.message,
            detalles: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.createPrefactura = createPrefactura;
// Actualizar una prefactura
const updatePrefactura = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('📝 Actualizando prefactura:', id);
        console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
        const { numero, fecha, referenciaProyecto, clienteId, lineasDetalle, montoHT, montTVA, montoTTC } = req.body;
        // Verificar que la prefactura existe
        const prefacturaExiste = await index_1.prisma.prefactura.findUnique({
            where: { id }
        });
        if (!prefacturaExiste) {
            return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
        }
        // Primero eliminamos las líneas de detalle existentes
        await index_1.prisma.lineaDetalle.deleteMany({
            where: { prefacturaId: id }
        });
        console.log('🗑️ Líneas anteriores eliminadas');
        // Luego actualizamos la prefactura y creamos nuevas líneas
        const prefactura = await index_1.prisma.prefactura.update({
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
                    create: lineasDetalle.map((linea) => ({
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
    }
    catch (error) {
        console.error('❌ Error al actualizar la prefactura:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar la prefactura',
            error: error.message
        });
    }
};
exports.updatePrefactura = updatePrefactura;
// Eliminar una prefactura
const deletePrefactura = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('🗑️ Eliminando prefactura:', id);
        // Verificar que la prefactura existe
        const prefacturaExiste = await index_1.prisma.prefactura.findUnique({
            where: { id }
        });
        if (!prefacturaExiste) {
            return res.status(404).json({ mensaje: 'Prefactura no encontrada' });
        }
        // Primero eliminar las líneas de detalle
        await index_1.prisma.lineaDetalle.deleteMany({
            where: { prefacturaId: id }
        });
        // Luego eliminar la prefactura
        await index_1.prisma.prefactura.delete({
            where: { id }
        });
        console.log('✅ Prefactura eliminada exitosamente');
        res.json({ mensaje: 'Prefactura eliminada correctamente' });
    }
    catch (error) {
        console.error('❌ Error al eliminar la prefactura:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar la prefactura',
            error: error.message
        });
    }
};
exports.deletePrefactura = deletePrefactura;
