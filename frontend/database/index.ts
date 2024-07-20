import { Alert } from "react-native";
import Database from "./database";

// This is where to initialize databases and seeds

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
          description VARCHAR(255) NOT NULL, 
          image_link VARCHAR(255), 
          equipment VARCHAR(255) NOT NULL, 
          target_muscles VARCHAR(255) NOT NULL,
          muscle_group VARCHAR(255) NOT NULL
        );
  
        INSERT INTO exercise (name, description, image_link, equipment, target_muscles, muscle_group)
        VALUES
          ('Flat Barbell Bench Press', 'A compound chest exercise that primarily targets the middle chest.', 'https://www.example.com/', 'Barbell', 'Chest, Shoulder and Triceps', 'Chest'),
          ('Incline Barbell Bench Press', 'A compound chest exercise that primarily targets the upper chest.', 'https://www.example.com/', 'Barbell', 'Chest, Shoulder and Triceps', 'Chest'),
          ('Decline Barbell Bench Press', 'A compound chest exercise that primarily targets the lower chest.', 'https://www.example.com/', 'Barbell', 'Chest, Shoulder and Triceps', 'Chest'),
          ('High to Low Cable Fly', 'A chest exercise that primarily targets the lower chest.', 'https://www.example.com/', 'Cable Machine', 'Chest', 'Chest'),
          ('Barbell Row', 'A back exercise that targets the upper back', 'https://www.example.com/', 'Barbell', 'Back, Biceps', 'Back'),
          ('Lat Pulldown', 'An isolation exercise that targets the latissimus dorsi muscles.', 'https://www.example.com/', 'Lat Pulldown Machine', 'Back and Biceps', 'Back');
      `)

      return true
    } catch (error: unknown) {
      Alert.alert(`${error}`)
    }
  }
}

const exercisesDatabase = new ExerciseDatabase('exercises')

export {
  exercisesDatabase
}