const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  process.env.JWT_ACCESS_SECRET = 'test_access_secret';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
  process.env.NODE_ENV = 'test';

  await mongoose.connect(process.env.MONGO_URI);
  // Import app after env vars + DB connection are set up so server.js's own
  // connectDB() call targets the in-memory instance.
  app = require('../server');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Auth API', () => {
  const candidate = {
    name: 'Test Candidate',
    email: 'test.candidate@example.com',
    password: 'Password123',
    role: 'candidate',
  };

  test('POST /api/auth/register creates a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(candidate);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(candidate.email);
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('POST /api/auth/register rejects a duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(candidate);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login succeeds with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: candidate.email, password: candidate.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('POST /api/auth/login rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: candidate.email, password: 'WrongPassword' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/profile requires authentication', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/profile succeeds with a valid access token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: candidate.email, password: candidate.password });
    const token = loginRes.body.data.accessToken;

    const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(candidate.email);
  });
});
