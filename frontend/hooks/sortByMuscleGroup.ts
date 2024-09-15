import {ExerciseInfo} from "@/types/exercise";

export default function sortByMuscleGroup (exercises: Array<ExerciseInfo>) {
    let sections: Array<{title: string, data: Array<{id: number, name: string}>}> = []

    exercises.map(exercise => {
        if (sections.some(e => e.title === exercise.muscleGroup)) {
            sections[sections.findIndex(e => e.title === exercise.muscleGroup)].data.push({id: exercise.id, name: exercise.name})
        } else {
            sections.push({title: exercise.muscleGroup, data: [{id: exercise.id, name: exercise.name}]})
        }
    })

    return sections
}