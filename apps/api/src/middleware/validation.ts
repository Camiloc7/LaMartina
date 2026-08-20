import { NextFunction, Request, Response, RequestHandler } from 'express';
import { body, param, ValidationChain, validationResult } from 'express-validator';
import { ApiError } from './errorHandler';

export const validate = (validations: ValidationChain[]): RequestHandler[] => [
  ...validations,
  (req: Request, _res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError('Datos de entrada inválidos.', 400);
    }
    next();
  },
];

const uuid = (field: string) =>
  param(field).isUUID().withMessage(`${field} debe ser un UUID válido.`);

const coordinates = (field: string) => [
  body(`${field}.lat`).optional().isFloat({ min: -90, max: 90 }),
  body(`${field}.lng`).optional().isFloat({ min: -180, max: 180 }),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 128 }),
];

export const registerValidation = [
  body('nombre').trim().isLength({ min: 1, max: 100 }),
  body('apellido').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 12, max: 128 }),
  body('telefono').optional().trim().isLength({ min: 7, max: 20 }),
  body('rol').optional().isIn(['SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'CLIENTE', 'PROPIETARIO']),
];

export const qrAuthValidation = [
  body('qrId').isString().trim().isLength({ min: 8, max: 100 }),
  body('pin').isString().matches(/^\d{4}$/),
];

export const pqrValidation = [
  body('tipo').isIn(['PETICION', 'QUEJA', 'RECLAMO', 'FELICITACION']),
  body('titulo').trim().isLength({ min: 3, max: 255 }),
  body('descripcion').trim().isLength({ min: 10, max: 10_000 }),
  body('conjuntoId').isUUID(),
  body('propiedadId').optional().isUUID(),
  body('prioridad').optional().isIn(['BAJA', 'MEDIA', 'ALTA', 'URGENTE']),
  body('clienteId').optional().isUUID(),
  body('asignadoAId').optional().isUUID(),
];

export const publicPqrValidation = [
  ...pqrValidation,
  body('propiedadId').isUUID(),
];

export const updatePqrValidation = [
  uuid('id'),
  body('estado').isIn(['ABIERTA', 'EN_PROCESO', 'RESUELTA', 'CERRADA']),
  body('respuesta').optional({ checkFalsy: true }).trim().isLength({ min: 1, max: 10_000 }),
  body('asignadoAId').optional().isUUID(),
];

export const jornadaStartValidation = [
  body('conjuntoId').isUUID(),
  body('jornadaId').optional().isUUID(),
  ...coordinates('ubicacion'),
];

export const jornadaFinishValidation = [
  uuid('id'),
  body('observaciones').optional().trim().isLength({ max: 10_000 }),
  ...coordinates('ubicacion'),
];

export const uuidParamValidation = (field = 'id') => [uuid(field)];
