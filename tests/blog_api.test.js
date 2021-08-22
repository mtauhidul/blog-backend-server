/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const blogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
];

beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(blogs[0]);
    await blogObject.save();
    blogObject = new Blog(blogs[1]);
    await blogObject.save();
});

test('all blogs returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(blogs.length);
}, 100000);

test('should return blogs in json format', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
}, 100000);

test('verifying the existence of a property', async () => {
    const response = await api.get('/api/blogs');
    const id = response.body.map((r) => r.id);
    expect(id).toBeDefined();
}, 100000);

afterAll(() => {
    mongoose.connection.close();
});
