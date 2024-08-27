import request from 'supertest';
import { app, connectToDatabase } from '../../server/index';
import mongoose from 'mongoose';

describe('Server Tests', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET / should return 200 OK and welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Welcome to the API' });
  });

  it('GET /nonexistent should return 404 Not Found', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });
});