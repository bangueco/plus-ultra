import { exercisesDatabase, templatesDatabase } from "@/database";
import { NewTemplateItem } from "@/types/templates";

const createTemplate = async (template: NewTemplateItem) => {
  // initialize creating template
  const initTemplate = await templatesDatabase.db.runAsync(`
    INSERT INTO templates(template_name, custom) 
    VALUES (${template.template_name}, 'true');`
  )

  // insert all exercises
  const insertExercises = template.exercises.map(async exercise => {
    const getMuscleGroup = await exercisesDatabase.db.getFirstAsync<{muscleGroup: string}>(`SELECT muscleGroup FROM exercise WHERE id=${exercise.exercise_id}`)
    await templatesDatabase.db.runAsync(`
      INSERT INTO template_items(item_name, muscleGroup, template_id, exercise_id)
      VALUES ('${template.template_name}', '${getMuscleGroup?.muscleGroup}')`
    )
  })
}

export {
  createTemplate
}