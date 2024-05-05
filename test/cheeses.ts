import { randomUUID } from "crypto";
import { Cheese } from "../src/types";

export function mockCheese(overrides: Partial<Cheese> = {}): Cheese {
  return {
    id: randomUUID(),
    name: "brie",
    description: "Tasty brie",
    pricePerKilo: 3.0,
    images: ["http://example.com/brie.jpg"],
    ...overrides,
  };
}
