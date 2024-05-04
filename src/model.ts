import path from "path";
import fs from "fs";
import { Cheese } from "./types";

type CheeseRecord = {
  id: string;
  name: string;
  images: string[];
  description: string;
  price_per_kilo: number;
};

// Read cheeses data from JSON file
const cheesesData = fs.readFileSync(
  path.join(__dirname, "cheeses.json"),
  "utf8"
);
let cheeseRecords: CheeseRecord[] = JSON.parse(cheesesData);

export function findAll(): Cheese[] {
  return cheeseRecords.map(mapFromRecord);
}

export function getById(cheeseId: string): Cheese | undefined {
  const cheeses = findAll(); // @TODO replace with unique DB call
  return cheeses.find((cheese) => cheese.id === cheeseId);
}

export function create(cheese: Cheese): Cheese {
  const newCheese: CheeseRecord = {
    id: cheese.id,
    name: cheese.name,
    images: Array.isArray(cheese.images) ? cheese.images : [cheese.images],
    description: cheese.description,
    price_per_kilo: cheese.pricePerKilo,
  };

  cheeseRecords.push(newCheese);

  return mapFromRecord(newCheese);
}

export function deleteById(cheeseId: string): void {
  if (!getById(cheeseId)) {
    throw Error("Cheese not found");
  }
  cheeseRecords = cheeseRecords.filter((c) => c.id !== cheeseId);
}

function mapFromRecord(record: CheeseRecord): Cheese {
  return {
    id: record.id,
    name: record.name,
    images: Array.isArray(record.images) ? record.images : [record.images],
    description: record.description,
    pricePerKilo: record.price_per_kilo,
  };
}
