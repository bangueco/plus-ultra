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
          description VARCHAR(255), 
          image_link VARCHAR(255), 
          equipment VARCHAR(255) NOT NULL, 
          target_muscles VARCHAR(255),
          muscle_group VARCHAR(255) NOT NULL
        );
  
        INSERT INTO exercise (name, description, image_link, equipment, target_muscles, muscle_group)
        VALUES
          ('Flat Barbell Bench Press', 'A compound chest exercise that primarily targets the middle chest.', 'https://www.example.com/', 'Barbell', 'Chest, Shoulder and Triceps', 'Chest'),
          ('Incline Barbell Bench Press', 'A compound chest exercise that primarily targets the upper chest.', 'https://www.example.com/', 'Barbell', 'Chest, Shoulder and Triceps', 'Chest'),
          ('Decline Barbell Bench Press', 'A compound chest exercise that primarily targets the lower chest.', 'https://www.example.com/', 'Barbell', 'Chest, Shoulder and Triceps', 'Chest'),
          ('High to Low Cable Fly', 'A chest exercise that primarily targets the lower chest.', 'https://www.example.com/', 'Cable Machine', 'Chest', 'Chest'),
          ('Barbell Row', 'A back exercise that targets the upper back', 'https://www.example.com/', 'Barbell', 'Back, Biceps', 'Back'),
          ('Lat Pulldown', 'An isolation exercise that targets the latissimus dorsi muscles.', 'https://www.example.com/', 'Lat Pulldown Machine', 'Back and Biceps', 'Back'),
          ('Deadlift', 'A compound exercise that targets the posterior chain, including the lower back, glutes, hamstrings, and traps.', 'https://www.example.com/', 'Barbell', 'Back, Glutes, Hamstrings, Traps', 'Back'),
          ('Dumbbell Shoulder Press', 'An overhead press exercise that primarily targets the shoulders.', 'https://www.example.com/', 'dumbbell', 'Shoulders, Triceps', 'Shoulders'),
          ('Lateral Raise', 'An isolation exercise for the deltoid muscles, primarily targeting the lateral head.', 'https://www.example.com/', 'dumbbell', 'Shoulders', 'Shoulders'),
          ('Barbell Squat', 'A compound lower-body exercise that primarily targets the quadriceps, hamstrings, and glutes.', 'https://www.example.com/', 'Barbell', 'Quadriceps, Hamstrings, Glutes', 'Legs'),
          ('Leg Press', 'A machine-based exercise that targets the quadriceps, hamstrings, and glutes.', 'https://www.example.com/', 'Leg Press Machine', 'Quadriceps, Hamstrings, Glutes', 'Legs'),
          ('Romanian Deadlift', 'A deadlift variation that primarily targets the hamstrings and glutes.', 'https://www.example.com/', 'Barbell or dumbbell', 'Hamstrings, Glutes', 'Legs'),
          ('Barbell Curl', 'An isolation exercise for the biceps.', 'https://www.example.com/', 'Barbell', 'Biceps', 'Arms'),
          ('Skull Crushers', 'An isolation exercise for the triceps.', 'https://www.example.com/', 'E-Z Curl Bar', 'Triceps', 'Arms'),
          ('Seated Cable Row', 'A back exercise that targets the middle back and biceps.', 'https://www.example.com/', 'Cable Machine', 'Back, Biceps', 'Back'),
          ('Bent Over Rows', 'A compound back exercise that targets the upper back and biceps.', 'https://www.example.com/', 'Barbell', 'Back, Biceps', 'Back'),
          ('Leg Extension', 'An isolation exercise that targets the quadriceps.', 'https://www.example.com/', 'Leg Extension Machine', 'Quadriceps', 'Legs'),
          ('Hamstring Curl', 'An isolation exercise for the hamstrings.', 'https://www.example.com/', 'Hamstring Curl Machine', 'Hamstrings', 'Legs'),
          ('Calf Raise', 'An isolation exercise for the calf muscles.', 'https://www.example.com/', 'Calf Raise Machine', 'Calves', 'Legs'),
          ('Plank', 'A core exercise that engages the abdominals and stabilizer muscles.', 'https://www.example.com/', 'Bodyweight', 'Abdominals, Core', 'Core'),
          ('Push-Up', 'A bodyweight exercise that targets the chest, shoulders, and triceps.', 'https://www.example.com/', 'Bodyweight', 'Chest, Shoulders, Triceps', 'Chest'),
          ('Pull-Up', 'A bodyweight exercise that targets the back and biceps.', 'https://www.example.com/', 'Pull-Up Bar', 'Back, Biceps', 'Back'),
          ('Russian Twist', 'An exercise that targets the obliques and core muscles.', 'https://www.example.com/', 'Medicine Ball or Bodyweight', 'Obliques, Core', 'Core'),
          ('Reverse Fly', 'An exercise that targets the rear deltoids and upper back.', 'https://www.example.com/', 'dumbbell', 'Shoulders, Upper Back', 'Shoulders'),
          ('Bench Press', 'A compound exercise that targets the chest, shoulders, and triceps.', 'https://www.example.com/', 'Barbell or dumbbell', 'Chest, Shoulders, Triceps', 'Chest'),
          ('Leg Curl', 'An isolation exercise for the hamstrings.', 'https://www.example.com/', 'Leg Curl Machine', 'Hamstrings', 'Legs'),
          ('Machine Chest Press', 'A machine-based exercise that targets the chest.', 'https://www.example.com/', 'Chest Press Machine', 'Chest', 'Chest'),
          ('Tricep Dip', 'An exercise that targets the triceps and shoulders.', 'https://www.example.com/', 'Parallel Bars or Dip Machine', 'Triceps, Shoulders', 'Arms');
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