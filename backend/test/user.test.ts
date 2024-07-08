import { test, describe, expect, beforeEach, } from 'vitest'

import app from '../src/app'
import supertest from 'supertest'
import userHelper from './helpers/user.helper'

const api = supertest(app)

const fakeUser = {
  username: 'aybandotnet',
  email: 'aybankalbo@gmail.com',
  password: 'aybanwalangpassword'
}

describe('api testing for /api/user', () => {
  beforeEach(async () => {
    console.log('runs')
    await userHelper.deleteUsersFromDB()
  })

  test('registering new user from POST: /api/user/register', async () => {

    const response = await api
      .post('/api/user/register')
      .send(fakeUser)
      .expect(201)
      .expect('Content-Type', /\application\/json/)

    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()
    expect(response.body.username).toBe(fakeUser.username)
    expect(response.body.email).toBe(fakeUser.email)
  })

  test('authenticating existing user from database POST: /api/user/login', async () => {

    await api.post('/api/user/register').send(fakeUser)

    const response = await api
      .post('/api/user/login')
      .send({username: fakeUser.username, password: fakeUser.password})
      .expect(200)
    
    expect(response.status).toBe(200)
  })
})