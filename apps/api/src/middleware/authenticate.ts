import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';

interface JwtPayload {
  sub: string;
  rol: string;
}

export interface AuthRequest extends Request {
  userId: string;
  userRol: string;
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError('Token de autenticación requerido.', 401);
  }

  const token = authHeader.split(' ')[1]!;

  try {
    const payload = jwt.verify(
      token,
      process.env['JWT_SECRET'] as string
    ) as JwtPayload;

    (req as AuthRequest).userId = payload.sub;
    (req as AuthRequest).userRol = payload.rol;
    next();
  } catch {
    throw new ApiError('Token inválido o expirado.', 401);
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRol = (req as AuthRequest).userRol;
    if (!roles.includes(userRol)) {
      throw new ApiError('No tienes permisos para esta acción.', 403);
    }
    next();
  };
}
