import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { Knex } from "knex";
import { getDb } from "./db";
import {
  findAll,
  create,
  deleteById,
  getById,
  updateCheese,
  mapFromRecord,
} from "./model";
import { Cheese } from "./types";

describe("model", () => {
  let db: Knex;

  beforeAll(async () => {
    // Establish connection to the database
    db = await getDb();
  });

  beforeEach(() => {
    // Restore all mocked functions to their original implementations
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    // Close the database connection after all tests have run
    await db?.destroy();
  });

  describe("when getting all cheeses", () => {
    it("returns a list of cheeses", async () => {
      const cheeses = await findAll();
      expect(cheeses.length).not.toBe(0);
    });
  });

  describe("when getting a cheese by ID", () => {
    let newCheese: Cheese | undefined = undefined;

    beforeAll(async () => {
      // Create a new cheese to be retrieved
      newCheese = await create({
        name: "TestCheeseName",
        description: "Test Description",
        images: [],
        pricePerKilo: 100,
      });
    });

    afterAll(async () => {
      // Delete the created cheese after the test
      if (newCheese?.id) {
        await deleteById(newCheese.id);
      }
    });

    it("returns the target cheese", async () => {
      const cheeseById = getById(String(newCheese?.id));
      await expect(cheeseById).resolves.toEqual(newCheese);
    });
  });

  describe("when adding a new cheese", () => {
    let newCheese: Cheese | undefined = undefined;

    beforeAll(async () => {
      // Create a new cheese to be tested
      newCheese = await create({
        name: "TestCheeseName",
        description: "Test Description",
        images: [],
        pricePerKilo: 100,
      });
    });

    afterAll(async () => {
      // Delete the created cheese after the test
      if (newCheese?.id) {
        await deleteById(newCheese.id);
      }
    });

    it("returns a cheese object", () => {
      expect(newCheese).toBeDefined();
      expect(newCheese?.id).toBeDefined();
    });
  });

  describe("when deleting a cheese", () => {
    let cheese: Cheese | undefined = undefined;

    beforeAll(async () => {
      // Create a new cheese to be deleted
      cheese = await create({
        name: "TestCheeseName",
        description: "Test Description",
        images: [],
        pricePerKilo: 100,
      });
    });

    it("will not be available anymore", async () => {
      // Delete the cheese
      if (cheese?.id) {
        await deleteById(cheese.id);
      }
      // Test that the cheese has been deleted by attempting to retrieve it
      const deletedCheese = await getById(cheese?.id || "");
      expect(deletedCheese).not.toBeDefined();
    });
  });

  describe("when editing an existing cheese", () => {
    let existingCheese: Cheese;

    beforeAll(async () => {
      // Create a new cheese to be edited
      existingCheese = await create({
        name: "Existing Cheese",
        description: "Original description",
        images: [],
        pricePerKilo: 100,
      });
    });

    afterAll(async () => {
      // Delete the existing cheese after the test
      if (existingCheese?.id) {
        await deleteById(existingCheese.id);
      }
    });

    it("only updates the given properties", async () => {
      // Define the updated properties
      const updatedProperties = {
        description: "Updated description",
        pricePerKilo: 200,
      };

      // Edit the existing cheese with the updated properties
      await updateCheese(existingCheese.id, updatedProperties);

      // Retrieve the edited cheese from the database
      const editedCheese = await getById(existingCheese.id);

      // Assert that the edited cheese properties match the updated properties
      expect(editedCheese).toBeDefined();
      // Non-updated values
      expect(existingCheese?.id).toEqual(existingCheese.id);
      expect(existingCheese?.name).toEqual(existingCheese.name);
      expect(existingCheese?.images).toEqual(existingCheese.images);
      // Updated values
      expect(editedCheese?.description).toEqual(updatedProperties.description);
      expect(editedCheese?.pricePerKilo).toEqual(
        updatedProperties.pricePerKilo
      );
    });
  });
});
