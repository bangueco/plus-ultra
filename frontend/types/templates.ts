export type TemplatesType = {
  template_id: number,
  template_name: string,
  custom: number | null,
  created_by: number
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

export type EditTemplateItem = {
  template_id: number,
  template_name: string,
  exercises: Array<{
    template_item_id: number,
    exercise_id: number,
    item_name: string,
    muscleGroup: string
  }>
}

export type TemplateItemProps = {
  item_name: string
  muscleGroup: string
  exercise_id: number
}

export type TemplateTrainerProps = {
  template_id: number,
  template_name: string,
  custom: number,
  difficulty: string,
  creatorId: number
  client_name: string | number
}

export type TemplateTrainerItemProps = {
  template_item_id: number;
  template_item_name: string;
  muscle_group: string;
  template_id: number;
  exercise_id: number;
}