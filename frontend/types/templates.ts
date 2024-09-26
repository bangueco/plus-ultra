export type TemplatesType = {
  template_id: number,
  template_name: string,
  custom: number | null
}

export type TemplateItem = {
  template_item_id: number,
  template_item_name: string,
  muscle_group: string,
  template_id: number,
  exercise_id: number,
}

export type ExerciseSets = {
  exercise_set_id: number,
  reps: number,
  weight: number,
  template_item_id: number,
  template_id: number
}

export type NewTemplateItem = {
  template_name: string, 
  exercises: Array<{
    exercise_id: number
    item_name: string,
    muscleGroup: string
  }>
}