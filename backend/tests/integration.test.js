const request = require('supertest');
const mongoose = require('mongoose');
const { createApp } = require('../src/app');

let app;

beforeAll(async () => {
  // Connect to memory/test database or standard test URI
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/kumbhrakshak_test';
  await mongoose.connect(mongoUri);
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('KumbhRakshak Backend Integration Tests', () => {
  describe('Health Check', () => {
    it('GET /api/v1/health should return ok status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('ok');
    });
  });

  describe('Authentication Module', () => {
    const testUser = {
      phoneNumber: '9876543210',
      fullName: 'Test Pilgrim',
      bloodGroup: 'B+',
      ageGroup: '31-50',
    };

    it('POST /api/v1/auth/request-otp should return demo OTP info', async () => {
      const res = await request(app)
        .post('/api/v1/auth/request-otp')
        .send(testUser);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.otpSent).toBe(true);
    });

    it('POST /api/v1/auth/verify-otp should verify and return JWT token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({
          ...testUser,
          otp: '2027',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.fullName).toEqual('Test Pilgrim');
    });

    it('POST /api/v1/auth/guest should return emergency guest token', async () => {
      const res = await request(app).post('/api/v1/auth/guest');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.pilgrimId).toContain('KMB-GUEST-');
    });
  });

  describe('SOS Incident Module', () => {
    it('POST /api/v1/sos/dispatch should trigger SOS emergency dispatch', async () => {
      const res = await request(app)
        .post('/api/v1/sos/dispatch')
        .send({
          pilgrimName: 'Rahul Sharma',
          location: 'Ramkund Sector 4',
          emergencyType: 'Medical Emergency',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.incidentId).toContain('SOS-');
      expect(res.body.status).toEqual('DISPATCHED');
    });
  });

  describe('Core Data & Pilgrim Seva Endpoints', () => {
    it('GET /api/v1/safety/metrics should return real-time metrics', async () => {
      const res = await request(app).get('/api/v1/safety/metrics');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.crowdStatus).toBeDefined();
    });

    it('GET /api/v1/pois should return POI list', async () => {
      const res = await request(app).get('/api/v1/pois');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/temples should return temple directory', async () => {
      const res = await request(app).get('/api/v1/temples');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/services/water-stations should return water stations', async () => {
      const res = await request(app).get('/api/v1/services/water-stations');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('AI Safety Assistant', () => {
    it('POST /api/v1/ai/safety-assistant should return safety guidance', async () => {
      const res = await request(app)
        .post('/api/v1/ai/safety-assistant')
        .send({
          message: 'Where is the nearest hospital?',
          language: 'English',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.reply).toBeDefined();
    });
  });
});
