import { NewTemplateItem } from "@/types/templates";
import { template, } from "@/db/schema/template";
import { db } from "@/lib/drizzleClient";
import { templateItem } from "@/db/schema/templateItems";

const createTemplate = async (templateInfo: NewTemplateItem) => {
  console.log('it runs!?')
  await db.transaction(async (tx) => {
    const newTemplate = await tx.insert(template).values({
      template_name: templateInfo.template_name,
      custom: 1
    })
    templateInfo.exercises.map(async exercise => {
      await tx.insert(templateItem).values({
        template_item_name: templateInfo.template_name,
        muscle_group: exercise.muscleGroup,
        template_id: newTemplate.lastInsertRowId,
        exercise_id: exercise.exercise_id
      })
    })
  })
}

export default {
  createTemplate
}