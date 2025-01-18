import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Comment from '../models/comment';
import Post from '../models/post';
import User from '../models/user';

let accessToken: string;

beforeAll(async () => {
  const dbUrl = 'mongodb://localhost:27017/commentsdb';
  await mongoose.connect(dbUrl);

  await User.findOne().deleteMany();

  // Set up a user and authenticate
  await request(app).post('/auth/register').send({
    email: 'test@example.com',
    password: 'password123',
  });

  const loginResponse = await request(app).post('/auth/login').send({
    email: 'test@example.com',
    password: 'password123',
  });
  accessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
  await mongoose?.connection?.db?.dropDatabase();
  await mongoose.disconnect();
});

describe('Comments Routes', () => {
  let post: any;

  beforeEach(async () => {
    await Comment.findOne().deleteMany();
    await Post.findOne().deleteMany();
    post = await Post.create({ title: 'Test Post', content: 'Test Content', sender: 'test@example.com' });
  });

  test('POST /comments - should create a new comment', async () => {
    const response = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Test Comment', post: post._id });

    expect(response.status).toBe(201);
    expect(response.body.content).toBe('Test Comment');
  });

  test('POST /comments - should return unauthorized for unauthenticated users', async () => {
    const post = await Post.create({ title: 'Test Post', content: 'Test Content', sender: 'test@example.com' });
    const response = await request(app).post('/comments').send({ content: 'Test Comment', post: post._id });
    expect(response.status).toBe(401);
  });

  test('GET /comments - should retrieve all comments', async () => {
    await Comment.create({ content: 'Comment 1', post: post._id, sender: 'test@example.com' });
    await Comment.create({ content: 'Comment 2', post: post._id, sender: 'test@example.com' });

    const response = await request(app).get('/comments');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test('GET /comments/:id - should retrieve a specific comment by ID', async () => {
    const comment = await Comment.create({ content: 'Specific Comment', post: post._id, sender: 'test@example.com' });

    const response = await request(app).get(`/comments/${comment._id}`);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe('Specific Comment');
  });

  test('PUT /comments/:id - should update a comment', async () => {
    const comment = await Comment.create({ content: 'Old Content', post: post._id, sender: 'test@example.com' });

    const response = await request(app)
      .put(`/comments/${comment._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Updated Content' });
    expect(response.status).toBe(200);
    expect(response.body.content).toBe('Updated Content');
  });

  test('PUT /comments/:id - should return unauthorized for unauthenticated users', async () => {
    const comment = await Comment.create({ content: 'Old Content', post: post._id, sender: 'test@example.com' });
    const response = await request(app).put(`/comments/${comment._id}`).send({ content: 'Updated Content' });
    expect(response.status).toBe(401);
  });

  test('DELETE /comments/:id - should delete a comment', async () => {
    const comment = await Comment.create({ content: 'To Delete', post: post._id, sender: 'test@example.com' });

    const response = await request(app).delete(`/comments/${comment._id}`).set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post deleted');
  });

  test('DELETE /comments/:id - should return unauthorized for unauthenticated users', async () => {
    const comment = await Comment.create({ content: 'To Delete', post: post._id, sender: 'test@example.com' });
    const response = await request(app).delete(`/comments/${comment._id}`);
    expect(response.status).toBe(401);
  });
});
