import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from 'expo-sqlite/next';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

import migrations from '@/db/migrations/migrations';

const expoDb = openDatabaseSync("final.db");
export const db = drizzle(expoDb)

export const useDrizzleStudioHelper = () => {

  if (process.env.EXPO_PUBLIC_ENVIRONMENT !== 'development') return

  return useDrizzleStudio(expoDb)
}

export const useMigrationHelper = () => {

  return useMigrations(db as ExpoSQLiteDatabase, migrations);
}