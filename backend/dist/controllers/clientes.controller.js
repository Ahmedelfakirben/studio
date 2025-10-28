"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteById = exports.getClientes = void 0;
const index_1 = require("../index");
// Obtener todos los clientes
const getClientes = async (req, res) => {
    try {
        const clientes = await index_1.prisma.cliente.findMany({
            orderBy: { razonSocial: 'asc' }
        });
        res.json(clientes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los clientes' });
    }
};
exports.getClientes = getClientes;
// Obtener un cliente por ID
const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await index_1.prisma.cliente.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener el cliente' });
    }
};
exports.getClienteById = getClienteById;
// Crear un nuevo cliente
const createCliente = async (req, res) => {
    const { razonSocial, direccion, numeroTVA, telefono, email } = req.body;
    try {
        const cliente = await index_1.prisma.cliente.create({
            data: {
                razonSocial,
                direccion,
                numeroTVA,
                telefono,
                email
            }
        });
        res.status(201).json(cliente);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el cliente' });
    }
};
exports.createCliente = createCliente;
// Actualizar un cliente
const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { razonSocial, direccion, numeroTVA, telefono, email } = req.body;
    try {
        const cliente = await index_1.prisma.cliente.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el cliente' });
    }
};
exports.updateCliente = updateCliente;
// Eliminar un cliente
const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        await index_1.prisma.cliente.delete({
            where: { id }
        });
        res.json({ mensaje: 'Cliente eliminado correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar el cliente' });
    }
};
exports.deleteCliente = deleteCliente;
