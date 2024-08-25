import { Alert } from "react-native";
import Database from "./database";
import exercisesData from '@/database/seed/exercises.json'

class ExerciseDatabase extends Database {
  constructor(database_name: string) {
    super(database_name)
  }

  async seed() {
    try {
      await this.db.execAsync(`
          DROP TABLE IF EXISTS exercise;
          CREATE TABLE IF NOT EXISTS exercise (
          id INTEGER PRIMARY KEY NOT NULL,
          name VARCHAR(255) NOT NULL,
          muscleGroup VARCHAR(255) NOT NULL,
          equipment VARCHAR(255) NOT NULL,
          difficulty VARCHAR(255),
          custom VARCHAR,
          instructions VARCHAR,
          tutorialLink VARCHAR(255)
        );
    
        ${exercisesData.map(exercise => {
          return `
            INSERT INTO exercise(name, muscleGroup, equipment, difficulty, custom, instructions, tutorialLink)
            VALUES ('${exercise.name}', '${exercise.muscleGroup}', '${exercise.equipment}', '${exercise.difficulty}', '${exercise.custom}', '${exercise.instructions}', '${exercise.tutorialLink}');
          `;
        }).join('\n')}
      `)
    } catch (error: unknown) {
      console.error(error)
    }
  }
}

const exercisesDatabase = new ExerciseDatabase('exercises')

export {
  exercisesDatabase
}