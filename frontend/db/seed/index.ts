import { db } from '@/lib/drizzleClient'
import exercises from './data/exercises.json'
import pushDayExercises from './data/pushDayExercises.json'
import pullDayExercises from './data/pullDayExercises.json'
import legDayExercises from './data/legDayExercises.json'

import exerciseService from '@/services/exercise.service'
import templateService from '@/services/template.service'
import { exercise } from '../schema/exercise'
import templateItemService from '@/services/templateItem.service'
import { sql } from 'drizzle-orm'

export default async function seed() {
  try {
    // Clear all table rows
    await exerciseService.deleteAllExercise()
    await templateService.deleteAllTemplate()
    await templateItemService.deleteAllTemplateItem()

    // Reset table sequences
    db.run(sql`DELETE FROM sqlite_sequence WHERE name='Exercise';`)
    db.run(sql`DELETE FROM sqlite_sequence WHERE name='Template';`)
    db.run(sql`DELETE FROM sqlite_sequence WHERE name='TemplateItem';`)

    // Insert default dataset
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

    const pushDay = await templateService.createTemplate('Push Day', false)
    const pullDay = await templateService.createTemplate('Pull Day', false)
    const legDay = await templateService.createTemplate('Leg Day', false)

    await templateItemService.createTemplateItem(pushDay.lastInsertRowId, ...pushDayExercises)
    await templateItemService.createTemplateItem(pullDay.lastInsertRowId, ...pullDayExercises)
    await templateItemService.createTemplateItem(legDay.lastInsertRowId, ...legDayExercises)
  } catch (error: unknown) {
    console.error(error)
  }
}