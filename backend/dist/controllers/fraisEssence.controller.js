"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarFraisEssence = exports.actualizarFraisEssence = exports.crearFraisEssence = exports.obtenerFraisEssencePorId = exports.obtenerFraisEssence = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtener todos los gastos de combustible
const obtenerFraisEssence = async (req, res) => {
    try {
        const fraisEssence = await prisma.fraisEssence.findMany();
        return res.json(fraisEssence);
    }
    catch (error) {
        console.error('Error al obtener gastos de combustible:', error);
        return res.status(500).json({ mensaje: 'Error al obtener gastos de combustible' });
    }
};
exports.obtenerFraisEssence = obtenerFraisEssence;
// Obtener un gasto de combustible por ID
const obtenerFraisEssencePorId = async (req, res) => {
    const { id } = req.params;
    try {
        const fraisEssence = await prisma.fraisEssence.findUnique({
            where: { id }
        });
        if (!fraisEssence) {
            return res.status(404).json({ mensaje: 'Gasto de combustible no encontrado' });
        }
        return res.json(fraisEssence);
    }
    catch (error) {
        console.error('Error al obtener gasto de combustible:', error);
        return res.status(500).json({ mensaje: 'Error al obtener gasto de combustible' });
    }
};
exports.obtenerFraisEssencePorId = obtenerFraisEssencePorId;
// Crear un nuevo gasto de combustible
const crearFraisEssence = async (req, res) => {
    const { fecha, numeroBL, designacionServicio, monto } = req.body;
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
    }
    catch (error) {
        console.error('Error al crear gasto de combustible:', error);
        return res.status(500).json({ mensaje: 'Error al crear gasto de combustible' });
    }
};
exports.crearFraisEssence = crearFraisEssence;
// Actualizar un gasto de combustible existente
const actualizarFraisEssence = async (req, res) => {
    const { id } = req.params;
    const { fecha, numeroBL, designacionServicio, monto } = req.body;
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
    }
    catch (error) {
        console.error('Error al actualizar gasto de combustible:', error);
        return res.status(500).json({ mensaje: 'Error al actualizar gasto de combustible' });
    }
};
exports.actualizarFraisEssence = actualizarFraisEssence;
// Eliminar un gasto de combustible
const eliminarFraisEssence = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error al eliminar gasto de combustible:', error);
        return res.status(500).json({ mensaje: 'Error al eliminar gasto de combustible' });
    }
};
exports.eliminarFraisEssence = eliminarFraisEssence;
