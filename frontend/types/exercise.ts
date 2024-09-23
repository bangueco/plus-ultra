export type ExerciseInfo = {
    exercise_id: number,
    name: string,
    muscle_group: string,
    equipment: string,
    difficulty?: string,
    custom: number | null,
    instructions?: string | null,
    tutorialLink?: string
}