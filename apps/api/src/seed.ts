import { AppDataSource } from './config/database';
import { User } from './entities/User';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Iniciando conexión a la base de datos...');
    await AppDataSource.initialize();
    console.log('Base de datos conectada.');

    const userRepository = AppDataSource.getRepository(User);

    // Verificar si ya existe un admin
    const adminExists = await userRepository.findOneBy({ email: 'admin@lamartina.com' });
    if (adminExists) {
      console.log('El usuario administrador ya existe.');
    } else {
      console.log('Creando usuario administrador por defecto...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = userRepository.create({
        nombre: 'Super',
        apellido: 'Admin',
        email: 'admin@lamartina.com',
        password: hashedPassword,
        rol: 'SUPER_ADMIN',
        activo: true
      });

      await userRepository.save(admin);
      console.log('Usuario administrador creado con éxito.');
      console.log('Email: admin@lamartina.com | Password: admin123');
    }

    console.log('Seeder ejecutado correctamente.');
  } catch (error) {
    console.error('Error ejecutando el seeder:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
