// tests/auth.test.ts
import request from 'supertest';
import app from '../src/app'; // Your Express app
import User from '../src/models/user';

let refreshToken: string;
let accessToken: string;

beforeAll(async () => {
  await User.deleteMany({});
});

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully.');
  });

  it('should log in a user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should refresh the access token', async () => {
    const res = await request(app).post('/auth/refresh').send({
      refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('should log out the user', async () => {
    const res = await request(app).post('/auth/logout').send({
      refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully.');
  });

  it('should not refresh with an invalid token', async () => {
    const res = await request(app).post('/auth/refresh').send({
      refreshToken: 'invalid_token',
    });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Invalid refresh token.');
  });
});
