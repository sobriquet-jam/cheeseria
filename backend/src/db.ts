import { knex } from "knex";
import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing connection string, is DATABASE_URL set?");
}
let client: Knex | undefined = undefined;

export async function initDb(): Promise<Knex> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not defined in the environment variables."
    );
  }

  const client = knex({
    client: "pg",
    connection: connectionString,
  });

  return client;
}

export async function getDb(): Promise<Knex> {
  if (!client) {
    client = await initDb();
  }
  return client;
}
