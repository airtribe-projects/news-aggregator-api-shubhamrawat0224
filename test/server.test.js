const tap = require('tap');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User.model');
const server = supertest(app);

const mockUser = {
    name: 'Clark Kent',
    email: 'clark@superman.com',
    password: 'Krypt@n8',
    preferences: ['movies', 'comics']
};

let token = '';

tap.before(async () => {
    try {
        await mongoose.connect(process.env.URI);
        await User.deleteMany({});
        console.log('✅ MongoDB connected for testing');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
});

// Auth tests
tap.test('POST /users/signup', async (t) => {
    try {
        const response = await server.post('/users/signup').send(mockUser);
        t.equal(response.status, 200);
        t.hasOwnProp(response.body, 'user');
        t.same(response.body.user, {
            name: mockUser.name,
            email: mockUser.email,
            preferences: mockUser.preferences
        });
    } catch (err) {
        t.error(err);
    }
});

tap.test('POST /users/signup with missing email', async (t) => {
    try {
        const response = await server.post('/users/signup').send({
            name: mockUser.name,
            password: mockUser.password
        });
        t.equal(response.status, 400);
        t.hasOwnProp(response.body, 'message');
    } catch (err) {
        t.error(err);
    }
});

tap.test('POST /users/login', async (t) => {
    try {
        const response = await server.post('/users/login').send({
            email: mockUser.email,
            password: mockUser.password
        });
        t.equal(response.status, 200);
        t.hasOwnProp(response.body, 'token');
        token = response.body.token;
    } catch (err) {
        t.error(err);
    }
});

tap.test('POST /users/login with wrong password', async (t) => {
    try {
        const response = await server.post('/users/login').send({
            email: mockUser.email,
            password: 'wrongpassword'
        });
        t.equal(response.status, 401);
        t.hasOwnProp(response.body, 'message');
    } catch (err) {
        t.error(err);
    }
});

// Preferences tests
tap.test('GET /users/preferences', async (t) => {
    try {
        const response = await server.get('/users/preferences').set('Authorization', `Bearer ${token}`);
        t.equal(response.status, 200);
        t.hasOwnProp(response.body, 'preferences');
        t.same(response.body.preferences, mockUser.preferences);
    } catch (err) {
        t.error(err);
    }
});

tap.test('GET /users/preferences without token', async (t) => {
    try {
        const response = await server.get('/users/preferences');
        t.equal(response.status, 401);
        t.hasOwnProp(response.body, 'message');
    } catch (err) {
        t.error(err);
    }
});

tap.test('PUT /users/preferences', async (t) => {
    try {
        const response = await server.put('/users/preferences')
            .set('Authorization', `Bearer ${token}`)
            .send({
                preferences: ['movies', 'comics', 'games']
            });
        t.equal(response.status, 200);
        t.hasOwnProp(response.body, 'message');
    } catch (err) {
        t.error(err);
    }
});

tap.test('Check PUT /users/preferences', async (t) => {
    try {
        const response = await server.get('/users/preferences').set('Authorization', `Bearer ${token}`);
        t.equal(response.status, 200);
        t.same(response.body.preferences, ['movies', 'comics', 'games']);
    } catch (err) {
        t.error(err);
    }
});

// News tests
tap.test('GET /news', async (t) => {
    try {
        const response = await server.get('/news').set('Authorization', `Bearer ${token}`);
        t.equal(response.status, 200);
        t.hasOwnProp(response.body, 'news');
    } catch (err) {
        t.error(err);
    }
});

tap.test('GET /news without token', async (t) => {
    try {
        const response = await server.get('/news');
        t.equal(response.status, 401);
        t.hasOwnProp(response.body, 'message');
    } catch (err) {
        t.error(err);
    }
});

tap.teardown(async () => {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected after testing');
});