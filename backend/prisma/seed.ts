import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la carga de datos iniciales...');

  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@alygestion.com',
      password: adminPassword,
      rol: 'admin'
    }
  });
  console.log('Usuario administrador creado:', admin.email);

  // Crear algunos clientes de ejemplo
  const cliente1 = await prisma.cliente.create({
    data: {
      razonSocial: 'Empresa Ejemplo 1',
      email: 'empresa1@example.com',
      telefono: '+34600000001',
      direccion: 'Calle Principal 123, Madrid',
      numeroTVA: 'B12345678'
    }
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      razonSocial: 'Empresa Ejemplo 2',
      email: 'empresa2@example.com',
      telefono: '+34600000002',
      direccion: 'Avenida Central 456, Barcelona',
      numeroTVA: 'B87654321'
    }
  });
  console.log('2 clientes de ejemplo creados');

  // Crear algunos proveedores de ejemplo
  const proveedor1 = await prisma.proveedor.create({
    data: {
      razonSocial: 'Proveedor Ejemplo 1',
      email: 'proveedor1@example.com',
      telefono: '+34600000003',
      direccion: 'Calle Suministros 789, Valencia',
      numeroTVA: 'B11223344'
    }
  });

  const proveedor2 = await prisma.proveedor.create({
    data: {
      razonSocial: 'Proveedor Ejemplo 2',
      email: 'proveedor2@example.com',
      telefono: '+34600000004',
      direccion: 'Avenida Industrial 101, Sevilla',
      numeroTVA: 'B44332211'
    }
  });
  console.log('2 proveedores de ejemplo creados');

  console.log('Carga de datos iniciales completada con éxito');
}

main()
  .catch((e) => {
    console.error('Error durante la carga de datos iniciales:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });