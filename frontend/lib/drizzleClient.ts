import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from 'expo-sqlite/next';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import migrations from '@/db/migrations/migrations';

const expoDb = openDatabaseSync("database.db");
export const db = drizzle(expoDb)

export const useMigrationHelper = () => {

  return useMigrations(db as ExpoSQLiteDatabase, migrations);
}