export type TemplatesType = {
  template_id: number,
  template_name: string,
  custom: string
}

export type TemplateItem = {
  item_id: number,
  item_name: string,
  muscleGroup: string,
  sets: number,
  reps: number,
  template_id: number,
  exercise_id: number,
}