import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema/*',
  out: './db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;