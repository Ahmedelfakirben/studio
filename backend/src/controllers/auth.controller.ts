import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

// Registrar un nuevo usuario (solo admin puede hacerlo)
export const registrar = async (req: Request, res: Response) => {
  const { email, password, nombre, rol } = req.body;

  try {
    // Verificar si el usuario ya existe
    let usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuario) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario
    usuario = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rol: rol || 'usuario'
      }
    });

    // Retornar usuario sin la contraseña
    const { password: _, ...usuarioSinPassword } = usuario;
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Iniciar sesión
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Crear y devolver el token JWT
    const payload = {
      id: usuario.id
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener usuario autenticado
export const getUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener todos los usuarios (solo admin)
export const getUsuarios = async (req: Request, res: Response) => {
  try {
    // Verificar que el usuario es admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar usuario (solo admin)
export const updateUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;

  try {
    // Verificar que el usuario es admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        nombre,
        email,
        rol
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar usuario (solo admin)
export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar que el usuario es admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
    }

    // No permitir que un admin se elimine a sí mismo
    if (id === req.usuario.id) {
      return res.status(400).json({ mensaje: 'No puedes eliminar tu propio usuario' });
    }

    await prisma.usuario.delete({
      where: { id }
    });

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Resetear contraseña de un usuario (solo admin)
export const resetPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    // Verificar que el usuario es admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.usuario.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    });

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
