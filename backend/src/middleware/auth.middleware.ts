import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

export const protegerRuta = async (req: Request, res: Response, next: NextFunction) => {
  // Verificar si existe el token (acepta x-auth-token o Authorization Bearer)
  const bearerHeader = req.header('authorization');
  const tokenFromBearer = bearerHeader?.toLowerCase().startsWith('bearer ')
    ? bearerHeader.slice(7)
    : undefined;
  const token = req.header('x-auth-token') || tokenFromBearer;

  if (!token) {
    return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Buscar el usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Token no válido' });
    }

    // Agregar el usuario a la solicitud
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};

// Para facilitar el desarrollo, crearemos un middleware simplificado
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // En entorno de desarrollo, permitimos todas las solicitudes
  // Forzamos modo de desarrollo para pruebas
  const isDevelopment = true; //process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.log('Modo desarrollo: Permitiendo acceso sin autenticación');
    // Simular un usuario autenticado
    req.usuario = {
      id: 'dev-user-id',
      nombre: 'Usuario de Desarrollo',
      email: 'dev@example.com',
      rol: 'admin'
    };
    return next();
  }

  // En otros entornos, usamos la autenticación normal
  return protegerRuta(req, res, next);
};

export const esAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
  }
};