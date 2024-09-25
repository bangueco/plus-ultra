import {ExerciseInfo} from "@/types/exercise";

export default function sortByMuscleGroup (exercises: Array<ExerciseInfo>) {
    let sections: Array<{title: string, data: Array<{id: number, name: string}>}> = []

    exercises.map(exercise => {
        if (sections.some(e => e.title === exercise.muscle_group)) {
            sections[sections.findIndex(e => e.title === exercise.muscle_group)].data.push({id: exercise.exercise_id, name: exercise.name})
        } else {
            sections.push({title: exercise.muscle_group, data: [{id: exercise.exercise_id, name: exercise.name}]})
        }
    })

    return sections
}