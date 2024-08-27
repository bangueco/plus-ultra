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

class TemplatesDatabase extends Database {
  constructor(database_name: string) {
    super(database_name)
  }

  async seed() {
    try {
      await this.db.execAsync(`
        DROP TABLE IF EXISTS templates;
        DROP TABLE IF EXISTS template_items;
        CREATE TABLE IF NOT EXISTS templates (
          template_id INTEGER PRIMARY KEY NOT NULL,
          template_name VARHCAR(255) NOT NULL,
          custom VARCHAR NOT NULL
        );

        CREATE TABLE IF NOT EXISTS template_items(
          item_id INTEGER PRIMARY KEY NOT NULL,
          item_name VARCHAR(255) NOT NULL,
          muscleGroup VARCHAR(255) NOT NULL,
          sets INTEGER NOT NULL,
          reps INTEGER NOT NULL,
          template_id INTEGER NOT NULL,
          exercise_id INTEGER NOT NULL,
          FOREIGN KEY (template_id) REFERENCES templates(template_id),
          FOREIGN KEY(exercise_id) REFERENCES exercise(id)
        );

        INSERT INTO templates(template_name, custom) VALUES ('Push Day', 'false');
        INSERT INTO templates(template_name, custom) VALUES ('Pull Day', 'false');
        INSERT INTO templates(template_name, custom) VALUES ('Leg Day', 'false');

        INSERT INTO template_items(item_name, muscleGroup, sets, reps, template_id, exercise_id)
        VALUES 
          ('Incline Dumbbell Bench Press', 'Chest', 3, 12, 1, 2),
          ('Flat Dumbbell Bench Press', 'Chest', 3, 12, 1, 1),
          ('Dumbbell Flyes', 'Chest', 3, 12, 1, 6),
          ('Shoulder Press', 'Shoulders', 3, 12, 1, 14),
          ('Lateral Raise', 'Shoulders', 3, 12, 1, 15);
      `)
    } catch (error) {
      console.error(error)
    }
  }
}

const exercisesDatabase = new ExerciseDatabase('exercises')
const templatesDatabase = new TemplatesDatabase('templates')

export {
  exercisesDatabase,
  templatesDatabase
}