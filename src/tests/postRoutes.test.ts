import request from 'supertest';
import express from 'express';
import postsRouter from '../routes/postRoutes';

const app = express();
app.use(express.json());
app.use('/posts', postsRouter);

describe('Posts Routes', () => {
  test('POST /posts - Create a new post', async () => {
    const response = await request(app)
      .post('/posts')
      .send({ title: 'Test Post', content: 'Test Content' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Post');
  });

  test('GET /posts - Get all posts', async () => {
    const response = await request(app).get('/posts');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('GET /posts/:id - Get a post by ID', async () => {
    const response = await request(app).get('/posts/1'); // Mock ID

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', '1');
  });

  test('PUT /posts/:id - Update a post by ID', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({ title: 'Updated Post', content: 'Updated Content' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Post');
  });

  test('DELETE /posts/:id - Delete a post by ID', async () => {
    const response = await request(app).delete('/posts/1'); // Mock ID

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post deleted successfully');
  });
});
