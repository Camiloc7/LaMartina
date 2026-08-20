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
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new ApiError('No autenticado', 401);
  }

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

export function authorizeSelfOrRoles(paramName: string, ...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    const resourceUserId = req.params[paramName];

    if (authReq.userId !== resourceUserId && !roles.includes(authReq.userRol)) {
      throw new ApiError('No tienes permisos para acceder a este recurso.', 403);
    }
    next();
  };
}
