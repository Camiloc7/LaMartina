import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/database';
import { User } from '../../entities/User';
import { ApiError } from '../../middleware/errorHandler';

const userRepo = AppDataSource.getRepository(User);

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  const user = await userRepo
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email })
    .getOne();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError('Credenciales inválidas', 401);
  }

  if (!user.activo) {
    throw new ApiError('Usuario inactivo. Contacta al administrador.', 403);
  }

  const token = jwt.sign(
    { sub: user.id, rol: user.rol },
    process.env['JWT_SECRET'] as string,
    { expiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d' } as object
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
        activo: user.activo,
      },
    },
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
}


export async function register(req: Request, res: Response): Promise<void> {
  const { nombre, apellido, email, password, telefono, rol } = req.body as {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono?: string;
    rol?: string;
  };

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    throw new ApiError('Ya existe un usuario con ese correo electrónico.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = userRepo.create({
    nombre,
    apellido,
    email,
    password: hashedPassword,
    telefono,
    rol: (rol as User['rol']) ?? 'CLIENTE',
  });

  await userRepo.save(user);

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente.',
    data: { id: user.id, email: user.email },
  });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const userId = (req as Request & { userId: string }).userId;
  const user = await userRepo.findOne({ where: { id: userId } });

  if (!user) throw new ApiError('Usuario no encontrado', 404);

  res.json({ success: true, data: user });
}
