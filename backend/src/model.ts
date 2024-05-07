import { Cheese } from "./types";
import { getDb } from "./db";
import { randomUUID } from "crypto";

type CheeseRecord = {
  id: string;
  name: string;
  images: string[];
  description: string;
  price_per_kilo: number;
  created_at: Date;
};

export const TABLE_NAME = "cheeses";

export async function findAll(): Promise<Cheese[]> {
  try {
    const db = await getDb();
    const cheeses = await db(TABLE_NAME).select();
    return cheeses.map(mapFromRecord);
  } catch (error) {
    throw new Error("Internal server error");
  }
}

export async function getById(id: string): Promise<Cheese | undefined> {
  try {
    const db = await getDb();
    const result = await db(TABLE_NAME).where("id", id).first();
    if (result) {
      return mapFromRecord(result);
    }
  } catch (error) {
    console.error("Couldn't get cheese by ID", error);
    throw error;
  }
}

export async function create(
  cheese: Pick<Cheese, "name" | "description" | "images" | "pricePerKilo">
): Promise<Cheese> {
  try {
    const db = await getDb();
    const result = await db(TABLE_NAME)
      .insert({
        id: randomUUID(),
        name: cheese.name,
        description: cheese.description,
        images: cheese.images,
        price_per_kilo: cheese.pricePerKilo,
        created_at: new Date(),
      })
      .returning("*");

    const cleanedCheese = mapFromRecord(result?.[0]);
    return cleanedCheese;
  } catch (err) {
    const message = err instanceof Error ? err?.message : err;
    throw new Error(`Could not create cheese, ${message}`);
  }
}

export type UpdateCheeseInput = Partial<
  Pick<Cheese, "name" | "images" | "description" | "pricePerKilo">
>;

export async function updateCheese(id: string, input: UpdateCheeseInput) {
  try {
    const db = await getDb();
    // Convert properties from program to db variant
    const updateInput = { ...input, price_per_kilo: input.pricePerKilo };
    delete updateInput.pricePerKilo;
    await db(TABLE_NAME).where("id", id).update(updateInput);
  } catch (err) {
    const message = err instanceof Error ? err?.message : err;
    throw new Error(`Could not update cheese, ${message}`);
  }
}

export async function deleteById(id: string): Promise<void> {
  const db = await getDb();
  const deletedRowsCount = await db(TABLE_NAME).where("id", id).delete();
  // Check if the DELETE statement affected any rows
  if (deletedRowsCount === 0) {
    throw new Error("Cheese not found");
  }
}

export function mapFromRecord(record: CheeseRecord): Cheese {
  return {
    id: record.id,
    name: record.name,
    images: Array.isArray(record.images) ? record.images : [record.images],
    description: record.description,
    pricePerKilo: record.price_per_kilo,
    createdAt: record.created_at,
  };
}
