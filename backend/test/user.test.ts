import { test, describe, expect, } from 'vitest'

import app from '../src/app'
import supertest from 'supertest'
import { faker } from '@faker-js/faker'

const api = supertest(app)

describe('api testing for /api/user', () => {
  test('registering new user from POST: /api/user/register', async () => {

    const newUser = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    const response = await api
      .post('/api/user/register')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /\application\/json/)

    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()
    expect(response.body.username).toBe(newUser.username)
    expect(response.body.email).toBe(newUser.email)
  })
})