export type ExerciseInfo = {
    exercise_id: number,
    name: string,
    muscle_group: string,
    equipment: string,
    difficulty?: string | null,
    custom: number | null,
    instructions?: string | null,
    gifName?: string | null
}