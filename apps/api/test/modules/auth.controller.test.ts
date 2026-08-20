import { Request, Response } from 'express';

const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockHash = jest.fn();

jest.mock('../../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      findOne: mockFindOne,
      create: mockCreate,
      save: mockSave,
    })),
  },
}));

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: { hash: mockHash },
}));

import { register } from '../../src/modules/auth/auth.controller';

function responseMock(): Response {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
}

describe('register', () => {
  const body = {
    nombre: 'Ana',
    apellido: 'Prueba',
    email: 'ana@example.test',
    password: 'password-segura',
    rol: 'SUPER_ADMIN',
  };

  beforeEach(() => {
    mockFindOne.mockResolvedValue(null);
    mockHash.mockResolvedValue('hash');
    mockCreate.mockImplementation((user) => ({ ...user, id: '11111111-1111-4111-8111-111111111111' }));
    mockSave.mockResolvedValue(undefined);
  });

  it('forces public registrations to CLIENTE even when a privileged role is sent', async () => {
    await register({ body } as Request, responseMock());

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ rol: 'CLIENTE' }));
  });

  it('allows a SUPER_ADMIN to choose the role through the staff route', async () => {
    await register({ body, userRol: 'SUPER_ADMIN' } as unknown as Request, responseMock());

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ rol: 'SUPER_ADMIN' }));
  });
});
