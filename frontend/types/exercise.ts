export type ExerciseInfo = {
    exercise_id: number,
    name: string,
    muscle_group: string,
    equipment: string,
    difficulty?: string | null,
    custom: number,
    instructions?: string | null,
    created_by: number,
    video_id?: string | null
}