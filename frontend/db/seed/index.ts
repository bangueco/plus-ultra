import { db } from '@/lib/drizzleClient'
import exercises from './data/exercises.json'

import exerciseService from '@/services/exercise.service'
import templateService from '@/services/template.service'
import { exercise } from '../schema/exercise'

export default async function seed() {
  try {
    // Default exercises seed
    await exerciseService.deleteAllExercise()
    await Promise.all(exercises.map(async (e) => {
      await db.insert(exercise).values({
        name: e.name,
        muscle_group: e.muscleGroup,
        custom: 0,
        difficulty: e.difficulty,
        equipment: e.equipment,
        instructions: e.instructions
      });
    }));

    // Default template seed
    await templateService.deleteAllTemplate()
    const pushDay = await templateService.createTemplate('Push Day')
    const pullDay = await templateService.createTemplate('Pull Day')
    const legDay = await templateService.createTemplate('Leg Day')

    // Default template items seed
    // TODO: Add default template items seed
  } catch (error: unknown) {
    console.error(error)
  }
}