import { test, describe, expect } from 'vitest';
import path from 'node:path';

import app from '../src/app'
import supertest from 'supertest'

const api = supertest(app)
const imagePath = path.resolve(__dirname, './helpers/img/dumbbell.jpg');

describe('api testing for equipment', () => {
  test('uploading img to be identify', async () => {
    const response = await api.post('/api/equipment/identify').attach('image', imagePath)
    expect(response.status).toBe(200)
  })
})