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
          id int AUTO_INCREMENT PRIMARY KEY, 
          name VARCHAR(255) NOT NULL, 
          description VARCHAR(255), 
          image_link VARCHAR(255) NOT NULL, 
          equipment VARCHAR(255) NOT NULL, 
          target_muscles VARCHAR(255) NOT NULL
        );
  
        INSERT INTO exercise (name, description, image_link, equipment, target_muscles)
        VALUES
          ('bicep curl', 'bla bla bla', 'www.google.com', 'dumbbell', 'biceps'),
          ('bicep curl', 'bla bla bla', 'www.google.com', 'dumbbell', 'biceps'),
          ('bicep curl', 'bla bla bla', 'www.google.com', 'dumbbell', 'biceps'),
          ('bicep curl', 'bla bla bla', 'www.google.com', 'dumbbell', 'biceps'),
          ('bicep curl', 'bla bla bla', 'www.google.com', 'dumbbell', 'biceps'),
          ('bicep curl', 'bla bla bla', 'www.google.com', 'dumbbell', 'biceps'),
          ('bicep curl', 'bla bla bla', 'www.google.com', 'dumbbell', 'biceps'),
          ('bicep curl', 'bla bla bla', 'www.google.com', 'dumbbell', 'biceps');
      `)

      return console.log(`Table: exercise seeded successfully`)
    } catch (error) {
      console.error(error)
    }
  }
}

const exercisesDatabase = new ExerciseDatabase('exercises')

export {
  exercisesDatabase
}