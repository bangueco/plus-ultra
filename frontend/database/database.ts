import * as SQLite from 'expo-sqlite';

class Database {
  protected database_name: string
  public db: SQLite.SQLiteDatabase;

  constructor(database_name: string) {
    this.database_name = database_name
    this.db = SQLite.openDatabaseSync(this.database_name)
  }
}

export default Database