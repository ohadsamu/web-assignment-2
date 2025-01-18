import request from 'supertest';
import app from '../app';
import User from '../models/user';
import mongoose from 'mongoose';

let refreshToken: string;
let accessToken: string;

beforeAll(async () => {
  const dbUrl = 'mongodb://localhost:27017/auth-tests';
  await mongoose.connect(dbUrl);
  await User.findOne().deleteMany();
});

afterAll(async () => {
    await mongoose?.connection?.db?.dropDatabase();
    await mongoose.disconnect();
});

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'check@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully.');
  });

  it('should log in a user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'check@example.com',
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
    accessToken = res.body.accessToken;
  });

  it('should log out the user', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .send({ refreshToken });

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

  it('should return error for missing email during registration', async () => {
    const res = await request(app).post('/auth/register').send({ password: 'password123' });
    expect(res.status).toBe(500); // Or appropriate error code
  });
  
  it('should return error for missing password during registration', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'test@example.com' });
    expect(res.status).toBe(500); // Or appropriate error code
  });

  it('should return error for duplicate email during registration', async () => {
    await request(app).post('/auth/register').send({ email: 'unique@example.com', password: 'password123' });
    const res = await request(app).post('/auth/register').send({ email: 'unique@example.com', password: 'anotherPassword' });
    expect(res.status).toBe(400); // Or appropriate error code
  });

  it('should return error for incorrect email during login', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'wrong@example.com', password: 'password123' });
    expect(res.status).toBe(401); // Or appropriate error code
  });
  
  it('should return error for incorrect password during login', async () => {
    await request(app).post('/auth/register').send({ email: 'loginTest@example.com', password: 'correctPassword' });
    const res = await request(app).post('/auth/login').send({ email: 'loginTest@example.com', password: 'wrongPassword' });
    expect(res.status).toBe(401); // Or appropriate error code
  });

  it('should return error for logout with invalid refresh token', async () => {
    const res = await request(app).post('/auth/logout').send({ refreshToken: 'invalid_token' });
    expect(res.status).toBe(403); // Or appropriate error code
  });
});
