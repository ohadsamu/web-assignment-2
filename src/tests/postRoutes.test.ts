import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Post from '../models/post';
import User from '../models/user';

let accessToken: string;

beforeAll(async () => {
    const dbUrl = 'mongodb://localhost:27017/posts-tests';
    await mongoose.connect(dbUrl);
    await User.findOne().deleteMany();

    // Set up a user and authenticate
    await request(app).post('/auth/register').send({
        email: 'try@example.com',
        password: 'password123',
    });

    const loginResponse = await request(app).post('/auth/login').send({
        email: 'try@example.com',
        password: 'password123',
    });
    accessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
    await mongoose?.connection?.db?.dropDatabase();
    await mongoose.disconnect();
});

describe('Posts Routes', () => {
    beforeEach(async () => {
        await Post.findOne().deleteMany();
    });

    test('GET /posts - should retrieve all posts', async () => {
        await Post.create({ title: 'Post 1', content: 'Content 1', sender: 'try@example.com' });
        await Post.create({ title: 'Post 2', content: 'Content 2', sender: 'try@example.com' });

        const response = await request(app)
            .get('/posts')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    test('GET /posts/:id - should retrieve a specific post by ID', async () => {
        const post = await Post.create({ title: 'Specific Post', content: 'Content', sender: 'try@example.com' });

        const response = await request(app).get(`/posts/${post._id}`);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Specific Post');
    });

    test('POST /posts - should create a new post', async () => {
        const response = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'New Post', content: 'Content' });
        expect(response.status).toBe(201);
        expect(response.body.title).toBe('New Post');
    });

    test('POST /posts - should return unauthorized for unauthenticated users', async () => {
        const response = await request(app).post('/posts').send({ title: 'New Post', content: 'Content' });
        expect(response.status).toBe(401);
    });

    test('PUT /posts/:id - should update a post', async () => {
        const post = await Post.create({ title: 'Old Title', content: 'Old Content', sender: 'try@example.com' });

        const response = await request(app)
            .put(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'Updated Title', content: 'Updated Content' });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Title');
    });

    test('PUT /posts/:id - should return unauthorized for unauthenticated users', async () => {
        const post = await Post.create({ title: 'Old Title', content: 'Old Content', sender: 'try@example.com' });
        const response = await request(app).put(`/posts/${post._id}`).send({ title: 'Updated Title', content: 'Updated Content' });
        expect(response.status).toBe(401);
    });

    test('DELETE /posts/:id - should delete a post', async () => {
        const post = await Post.create({ title: 'To Delete', content: 'Content', sender: 'try@example.com' });

        const response = await request(app).delete(`/posts/${post._id}`).set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Post deleted');
    });

    test('DELETE /posts/:id - should return unauthorized for unauthenticated users', async () => {
        const post = await Post.create({ title: 'To Delete', content: 'Content', sender: 'try@example.com' });
        const response = await request(app).delete(`/posts/${post._id}`);
        expect(response.status).toBe(401);
    });
});
