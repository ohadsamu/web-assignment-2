import request from 'supertest';
import express from 'express';
import commentsRouter from '../routes/commentRoutes';

const app = express();
app.use(express.json());
app.use('/comments', commentsRouter);

describe('Comments Routes', () => {
  test('POST /comments - Create a new comment', async () => {
    const response = await request(app)
      .post('/comments')
      .send({ text: 'Test comment' }); // Mock request payload

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.text).toBe('Test comment');
  });

  test('GET /comments - Get all comments', async () => {
    const response = await request(app).get('/comments');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('GET /comments/:id - Get a comment by ID', async () => {
    const response = await request(app).get('/comments/1'); // Mock ID

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', '1');
  });

  test('PUT /comments/:id - Update a comment by ID', async () => {
    const response = await request(app)
      .put('/comments/1')
      .send({ text: 'Updated comment' });

    expect(response.status).toBe(200);
    expect(response.body.text).toBe('Updated comment');
  });

  test('DELETE /comments/:id - Delete a comment by ID', async () => {
    const response = await request(app).delete('/comments/1'); // Mock ID

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
  });
});
