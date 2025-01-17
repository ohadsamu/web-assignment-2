import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; // Assuming your Express app is exported from app.ts
import Post from '../models/post';

beforeAll(async () => {
    const dbUrl = 'mongodb://localhost:27017/testdb'; // Replace with your test DB URL
    await mongoose.connect(dbUrl);
});


afterAll(async () => {
    await mongoose?.connection?.db?.dropDatabase();
    await mongoose.disconnect();
});

describe('Posts Routes', () => {
    beforeEach(async () => {
        await Post.deleteMany({});
    });

    test('GET /posts - should retrieve all posts', async () => {
        await Post.create({ title: 'Post 1', content: 'Content 1', sender: 'User1' });
        await Post.create({ title: 'Post 2', content: 'Content 2', sender: 'User2' });

        const response = await request(app).get('/posts');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    test('GET /posts/:id - should retrieve a specific post by ID', async () => {
        const post = await Post.create({ title: 'Specific Post', content: 'Content', sender: 'User1' });

        const response = await request(app).get(`/posts/${post._id}`);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Specific Post');
    });

    test('POST /posts - should create a new post', async () => {
        const response = await request(app)
            .post('/posts')
            .send({ title: 'New Post', content: 'Content', sender: 'User1' });
        expect(response.status).toBe(201);
        expect(response.body.title).toBe('New Post');
    });

    test('PUT /posts/:id - should update a post', async () => {
        const post = await Post.create({ title: 'Old Title', content: 'Old Content', sender: 'User1' });

        const response = await request(app)
            .put(`/posts/${post._id}`)
            .send({ title: 'Updated Title', content: 'Updated Content' });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Title');
    });

    test('DELETE /posts/:id - should delete a post', async () => {
        const post = await Post.create({ title: 'To Delete', content: 'Content', sender: 'User1' });

        const response = await request(app).delete(`/posts/${post._id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Post deleted');
    });
});
