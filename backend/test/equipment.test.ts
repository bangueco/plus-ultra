import { test, describe, expect } from 'vitest';
import path from 'node:path';
import equipmentService from '../src/services/equipment.service';
import serpApiResults from './helpers/google-lens.json'

import app from '../src/app'
import supertest from 'supertest'

const api = supertest(app)
const imagePath = path.resolve(__dirname, './helpers/img/dumbbell.jpg');

describe('unit testing for equipment', () => {
  test('identify equipment ', () => {
    const equipment = equipmentService.identifyEquipment(serpApiResults)

    expect(equipment.equipment_name).toBe('dumbbell')
    expect(equipment.count).toBe(39)
  })
})

describe('api testing for equipment', () => {
  test('uploading img to be identify', async () => {
    const response = await api.post('/api/equipment/identify').attach('image', imagePath)
    expect(response.status).toBe(200)
  })
})