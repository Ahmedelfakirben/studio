"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBonLivraison = exports.updateBonLivraison = exports.createBonLivraison = exports.getBonLivraisonById = exports.getBonsLivraison = void 0;
const index_1 = require("../index");
// Obtener todos los bons de livraison
const getBonsLivraison = async (req, res) => {
    try {
        const bonsLivraison = await index_1.prisma.bonLivraison.findMany({
            include: {
                cliente: true,
                lineasMaterial: true
            },
            orderBy: { fecha: 'desc' }
        });
        res.json(bonsLivraison);
    }
    catch (error) {
        console.error('Error al obtener bons de livraison:', error);
        res.status(500).json({ mensaje: 'Error al obtener los bons de livraison' });
    }
};
exports.getBonsLivraison = getBonsLivraison;
// Obtener un bon de livraison por ID
const getBonLivraisonById = async (req, res) => {
    const { id } = req.params;
    try {
        const bonLivraison = await index_1.prisma.bonLivraison.findUnique({
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
    }
    catch (error) {
        console.error('Error al obtener bon de livraison:', error);
        res.status(500).json({ mensaje: 'Error al obtener el bon de livraison' });
    }
};
exports.getBonLivraisonById = getBonLivraisonById;
// Crear un nuevo bon de livraison
const createBonLivraison = async (req, res) => {
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
        const clienteExiste = await index_1.prisma.cliente.findUnique({
            where: { id: clienteId }
        });
        if (!clienteExiste) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        console.log('✅ Cliente encontrado:', clienteExiste.razonSocial);
        // Crear el bon de livraison con sus materiales
        const bonLivraison = await index_1.prisma.bonLivraison.create({
            data: {
                numero,
                fecha: new Date(fecha),
                referenciaProyecto: referenciaProyecto || null,
                clienteId,
                lineasMaterial: {
                    create: lineasMaterial.map((material) => ({
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
    }
    catch (error) {
        console.error('❌ Error al crear el bon de livraison:', error);
        res.status(500).json({
            mensaje: 'Error al crear el bon de livraison',
            error: error.message,
            detalles: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.createBonLivraison = createBonLivraison;
// Actualizar un bon de livraison
const updateBonLivraison = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('📝 Actualizando bon de livraison:', id);
        console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
        const { numero, fecha, referenciaProyecto, clienteId, lineasMaterial } = req.body;
        // Verificar que el bon existe
        const bonExiste = await index_1.prisma.bonLivraison.findUnique({
            where: { id }
        });
        if (!bonExiste) {
            return res.status(404).json({ mensaje: 'Bon de livraison no encontrado' });
        }
        // Primero eliminamos los materiales existentes
        await index_1.prisma.lineaMaterial.deleteMany({
            where: { bonLivraisonId: id }
        });
        console.log('🗑️ Materiales anteriores eliminados');
        // Luego actualizamos el bon y creamos nuevos materiales
        const bonLivraison = await index_1.prisma.bonLivraison.update({
            where: { id },
            data: {
                numero,
                fecha: new Date(fecha),
                referenciaProyecto: referenciaProyecto || null,
                clienteId,
                lineasMaterial: {
                    create: lineasMaterial.map((material) => ({
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
    }
    catch (error) {
        console.error('❌ Error al actualizar el bon de livraison:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar el bon de livraison',
            error: error.message
        });
    }
};
exports.updateBonLivraison = updateBonLivraison;
// Eliminar un bon de livraison
const deleteBonLivraison = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('🗑️ Eliminando bon de livraison:', id);
        // Verificar que el bon existe
        const bonExiste = await index_1.prisma.bonLivraison.findUnique({
            where: { id }
        });
        if (!bonExiste) {
            return res.status(404).json({ mensaje: 'Bon de livraison no encontrado' });
        }
        // Primero eliminar los materiales
        await index_1.prisma.lineaMaterial.deleteMany({
            where: { bonLivraisonId: id }
        });
        // Luego eliminar el bon
        await index_1.prisma.bonLivraison.delete({
            where: { id }
        });
        console.log('✅ Bon de livraison eliminado exitosamente');
        res.json({ mensaje: 'Bon de livraison eliminado correctamente' });
    }
    catch (error) {
        console.error('❌ Error al eliminar el bon de livraison:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar el bon de livraison',
            error: error.message
        });
    }
};
exports.deleteBonLivraison = deleteBonLivraison;
