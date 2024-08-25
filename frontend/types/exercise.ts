export type ExerciseInfo = {
    id: number,
    name: string,
    equipment: string,
    muscleGroup: string,
    difficulty?: string,
    custom: boolean,
    instructions?: string,
    tutorialLink?: string
}