import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../src/middleware/errorHandler';
import { loginRateLimit } from '../../src/middleware/rateLimit';
import { loginValidation, pqrValidation, validate } from '../../src/middleware/validation';

describe('input validation and rate limits', () => {
  it('rejects malformed PQR input before reaching the handler', async () => {
    const app = express();
    app.use(express.json());
    app.post('/pqr', ...validate(pqrValidation), (_req, res) => res.sendStatus(201));
    app.use(errorHandler);

    const response = await request(app).post('/pqr').send({ tipo: 'INVALIDO', titulo: 'x' });

    expect(response.status).toBe(400);
  });

  it('blocks a sixth failed login attempt from the same IP', async () => {
    const app = express();
    app.use(express.json());
    app.post('/login', loginRateLimit, ...validate(loginValidation), (_req, res) => res.sendStatus(401));
    app.use(errorHandler);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await request(app)
        .post('/login')
        .send({ email: 'cliente@example.test', password: 'password-segura' });
      expect(response.status).toBe(401);
    }

    const blocked = await request(app)
      .post('/login')
      .send({ email: 'cliente@example.test', password: 'password-segura' });

    expect(blocked.status).toBe(429);
  });
});
