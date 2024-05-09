import { knex } from "knex";
import type { Knex } from "knex";
import { DATABASE_URL } from "./environment";

let client: Knex | undefined = undefined;

export async function initDb(): Promise<Knex> {
  const client = knex({
    client: "pg",
    connection: DATABASE_URL,
  });

  return client;
}

export async function getDb(): Promise<Knex> {
  if (!client) {
    client = await initDb();
  }
  return client;
}
