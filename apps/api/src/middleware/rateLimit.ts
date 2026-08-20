import rateLimit from 'express-rate-limit';

const jsonMessage = (message: string) => ({
  success: false,
  message,
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: jsonMessage('Demasiadas solicitudes. Intenta de nuevo más tarde.'),
});

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: jsonMessage('Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.'),
});

export const registrationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: jsonMessage('Se alcanzó el límite de registros. Intenta de nuevo más tarde.'),
});

export const qrAuthRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: jsonMessage('Demasiados intentos de PIN. Intenta de nuevo en 15 minutos.'),
});

export const publicPqrRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: jsonMessage('Se alcanzó el límite de PQR públicas. Intenta de nuevo más tarde.'),
});

export const whatsappTraceRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados eventos de seguimiento. Inténtalo más tarde.' },
});
