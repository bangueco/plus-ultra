export type TemplatesType = {
  template_id: number,
  template_name: string,
  custom: string
}

export type TemplateItem = {
  item_id: number,
  item_name: string,
  muscleGroup: string,
  template_id: number,
  exercise_id: number,
  custom: string
}

export type ExerciseSets = {
  id: number,
  reps: number,
  weight: number,
  item_id: number,
}

export type NewTemplateItem = {
  template_name: string, 
  exercises: Array<{
    exercise_id: number
    item_name: string,
    muscleGroup: string
  }>
}