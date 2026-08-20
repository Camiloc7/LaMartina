import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import {
  authenticate,
  authorizeSelfOrRoles,
  AuthRequest,
} from '../../src/middleware/authenticate';
import { errorHandler } from '../../src/middleware/errorHandler';

const jwtSecret = 'test-secret-that-is-long-enough';

function buildApp() {
  const app = express();
  app.use(cookieParser());

  app.get('/protected', authenticate, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    res.json({ userId: authReq.userId, role: authReq.userRol });
  });
  app.get(
    '/users/:id',
    authenticate,
    authorizeSelfOrRoles('id', 'ADMIN', 'SUPER_ADMIN'),
    (req: Request, res: Response) => res.json({ id: req.params['id'] })
  );
  app.use(errorHandler);

  return app;
}

describe('authenticate and authorizeSelfOrRoles', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = jwtSecret;
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it('rejects requests without a token', async () => {
    const response = await request(buildApp()).get('/protected');

    expect(response.status).toBe(401);
  });

  it('accepts a valid JWT cookie', async () => {
    const token = jwt.sign({ sub: '11111111-1111-4111-8111-111111111111', rol: 'CLIENTE' }, jwtSecret);
    const response = await request(buildApp()).get('/protected').set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId: '11111111-1111-4111-8111-111111111111', role: 'CLIENTE' });
  });

  it('blocks a client from reading another user and permits an admin', async () => {
    const clientToken = jwt.sign({ sub: '11111111-1111-4111-8111-111111111111', rol: 'CLIENTE' }, jwtSecret);
    const adminToken = jwt.sign({ sub: '22222222-2222-4222-8222-222222222222', rol: 'ADMIN' }, jwtSecret);

    const denied = await request(buildApp())
      .get('/users/33333333-3333-4333-8333-333333333333')
      .set('Authorization', `Bearer ${clientToken}`);
    const allowed = await request(buildApp())
      .get('/users/33333333-3333-4333-8333-333333333333')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(denied.status).toBe(403);
    expect(allowed.status).toBe(200);
  });
});
