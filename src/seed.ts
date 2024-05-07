import path from "path";
import fs from "fs";
import { findAll, create, TABLE_NAME } from "./model";
import { Cheese } from "./types";
import { getDb } from "./db";

async function createTablesIfNotExists() {
  const db = await getDb();
  try {
    await db.raw(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      images VARCHAR(255)[] NOT NULL,
      price_per_kilo INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  } catch (error) {
    console.error("Table creation error:", error);
  }
}

async function dropAllTables() {
  const db = await getDb();
  try {
    // Retrieve all table names in the current schema
    const queryResult = await db.raw(`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = current_schema()
      `);

    // Generate and execute DROP TABLE statements for each table
    for (const row of queryResult.rows) {
      const tableName = row.tablename;
      await db.raw(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
      console.info(`Dropped table: ${tableName}`);
    }

    console.info("All tables dropped.");
  } catch (error) {
    console.error("Error dropping tables:", error);
  }
}

async function seedDataIfEmpty() {
  try {
    // Check if the cheeses table is empty
    const cheeses = await findAll();
    if (cheeses.length) {
      console.info("Cheeses table already populated.");
      return;
    }

    // If the table is empty, populate it with data from the JSON file
    const cheeseData = fs.readFileSync(
      path.join(__dirname, "cheeses.json"),
      "utf8"
    );
    const cheesesToAdd = JSON.parse(cheeseData);
    // Create cheeses
    await Promise.all(
      cheesesToAdd.map(({ id, ...values }: Cheese) => create(values))
    );
    console.info("Cheeses table populated successfully.");

    // Start your application here
  } catch (err) {
    console.error("Error occurred during startup:", err);
    process.exit(1); // Exit the process with a non-zero code to indicate failure
  }
}

(async () => {
  const db = await getDb();
  await createTablesIfNotExists();
  await seedDataIfEmpty();
  //   await dropAllTables();
  db.destroy();
})();
