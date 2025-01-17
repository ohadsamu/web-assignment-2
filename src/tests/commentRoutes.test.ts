import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; // Assuming your Express app is exported from app.ts
import Comment from '../models/comment';
import Post from '../models/post';

beforeAll(async () => {
    const dbUrl = 'mongodb://localhost:27017/testdb'; // Replace with your test DB URL
    await mongoose.connect(dbUrl);
});

afterAll(async () => {
  await mongoose?.connection?.db?.dropDatabase();
  await mongoose.disconnect();
});

describe('Comments Routes', () => {
  let post: any;

  beforeEach(async () => {
    await Comment.deleteMany({});
    await Post.deleteMany({});
    post = await Post.create({ title: 'Test Post', content: 'Test Content', sender: 'User1' });
  });

  test('POST /comments - should create a new comment', async () => {
    const response = await request(app)
      .post('/comments')
      .send({ content: 'Test Comment', post: post._id });
    expect(response.status).toBe(201);
    expect(response.body.content).toBe('Test Comment');
  });

  test('GET /comments - should retrieve all comments', async () => {
    await Comment.create({ content: 'Comment 1', post: post._id, sender: 'User1' });
    await Comment.create({ content: 'Comment 2', post: post._id, sender: 'User2' });

    const response = await request(app).get('/comments');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test('GET /comments/:id - should retrieve a specific comment by ID', async () => {
    const comment = await Comment.create({ content: 'Specific Comment', post: post._id, sender: 'User1' });

    const response = await request(app).get(`/comments/${comment._id}`);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe('Specific Comment');
  });

  test('PUT /comments/:id - should update a comment', async () => {
    const comment = await Comment.create({ content: 'Old Content', post: post._id, sender: 'User1' });

    const response = await request(app)
      .put(`/comments/${comment._id}`)
      .send({ content: 'Updated Content' });
    expect(response.status).toBe(200);
    expect(response.body.content).toBe('Updated Content');
  });

  test('DELETE /comments/:id - should delete a comment', async () => {
    const comment = await Comment.create({ content: 'To Delete', post: post._id, sender: 'User1' });

    const response = await request(app).delete(`/comments/${comment._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post deleted');
  });
});
