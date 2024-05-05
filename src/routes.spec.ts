import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import * as model from "./model";
import { mockCheese } from "../test/cheeses";
import { Cheese } from "./types";
import { app } from "./server";
import { Server } from "http";
import { mock } from "node:test";
import { response } from "express";

const PORT = 3000;

describe("routes", () => {
  let server: Server;

  beforeAll(() => {
    // Spin up the server locally to test the routes
    server = app.listen(PORT);
  });

  beforeEach(() => {
    // make sure that mocks from previous tests don't affect the next tests
    jest.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  describe("when requesting all cheeses", () => {
    const cheeses: Cheese[] = [mockCheese(), mockCheese()];
    let response: Response;

    beforeEach(async () => {
      // we're testing route functionality only, so it's safe to mock out the model
      jest.spyOn(model, "findAll").mockReturnValueOnce(cheeses);
      response = await callServer("/cheeses");
    });

    it("returns a list of cheeses", async () => {
      await expect(response.json()).resolves.toEqual(cheeses);
    });
  });

  describe("when requesting a cheese by its ID", () => {
    const targetCheese: Cheese = mockCheese();

    describe("and the cheese does not exist", () => {
      let response: Response;

      beforeEach(async () => {
        jest.spyOn(model, "getById").mockReturnValueOnce(undefined);
        response = await callServer(`/cheese/${targetCheese.id}`);
      });

      it("returns a 404 error", async () => {
        expect(response.status).toBe(404);
      });
    });

    describe("and the cheese exists", () => {
      let response: Response;

      beforeEach(async () => {
        jest.spyOn(model, "getById").mockReturnValueOnce(targetCheese);
        response = await callServer(`/cheeses/${targetCheese.id}`);
      });

      it("returns the cheese details", async () => {
        await expect(response.json()).resolves.toEqual(targetCheese);
      });
    });
  });

  describe("when deleting a cheese by its ID", () => {
    let response: Response;

    describe("and no id is given", () => {
      beforeEach(async () => {
        jest.spyOn(model, "deleteById").mockReturnValueOnce();
        response = await callServer(`/cheeses/${""}`, {
          method: "DELETE",
        });
      });

      it("the HTTP method will not be allowed", async () => {
        expect(response.status).toBe(405);
      });
    });

    describe("and an invalid id is given", () => {
      beforeEach(async () => {
        jest.spyOn(model, "deleteById").mockReturnValueOnce();
        response = await callServer(`/cheeses/${undefined}`, {
          method: "DELETE",
        });
      });

      it("the cheese will not be deleted", async () => {
        expect(response.status).toBe(404);
      });
    });

    describe("and a valid id is given", () => {
      const targetCheese: Cheese = mockCheese();
      beforeEach(async () => {
        jest.spyOn(model, "deleteById").mockReturnValueOnce();
        response = await callServer(`/cheeses/${targetCheese.id}`, {
          method: "DELETE",
        });
      });

      it("the cheese will be deleted", async () => {
        expect(response.status).toBe(204);
      });
    });
  });

  describe("when creating a cheese", () => {
    describe("and all fields are correctly inputted", () => {
      const cheese: Cheese = mockCheese();
      let response: Response;

      beforeEach(async () => {
        jest.spyOn(model, "create").mockReturnValueOnce(cheese);
        response = await callServer(`/cheeses`, {
          method: "POST",
          body: JSON.stringify(cheese),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      it("it returns the cheese details", async () => {
        await expect(response.json()).resolves.toEqual(cheese);
      });

      it("and a 201 status code", async () => {
        expect(response.status).toBe(201);
      });
    });

    describe("and the name field is empty", () => {
      let response: Response;
      const invalidCheese = {
        id: "1",
        name: "",
        images: ["image.png"],
        description: "description",
        pricePerKilo: 1,
      } as unknown as Cheese;

      beforeEach(async () => {
        jest.spyOn(model, "create").mockReturnValueOnce(invalidCheese);
        response = await callServer(`/cheeses`, {
          method: "POST",
          body: JSON.stringify(invalidCheese),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      it("throws a Bad Request error", async () => {
        expect(response.status).toBe(400);
      });
    });

    describe("and the images field is empty", () => {
      let response: Response;
      const invalidCheese = {
        id: "1",
        name: "Test Cheese",
        images: [],
        description: "description",
        pricePerKilo: 1,
      } as unknown as Cheese;

      beforeEach(async () => {
        jest.spyOn(model, "create").mockReturnValueOnce(invalidCheese);
        response = await callServer(`/cheeses`, {
          method: "POST",
          body: JSON.stringify(invalidCheese),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      it("throws a Bad Request error", async () => {
        expect(response.status).toBe(400);
      });
    });

    describe("and the description field is empty", () => {
      let response: Response;
      const invalidCheese = {
        id: "1",
        name: "Test Cheese",
        images: ["image.png"],
        description: "",
        pricePerKilo: 1,
      } as unknown as Cheese;

      beforeEach(async () => {
        jest.spyOn(model, "create").mockReturnValueOnce(invalidCheese);
        response = await callServer(`/cheeses`, {
          method: "POST",
          body: JSON.stringify(invalidCheese),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      it("throws a Bad Request error", async () => {
        expect(response.status).toBe(400);
      });
    });

    describe("and the price per kilo field is empty", () => {
      let response: Response;
      const invalidCheese = {
        id: "1",
        name: "Test Cheese",
        images: ["Image.png"],
        description: "Description",
        pricePerKilo: 0,
      } as unknown as Cheese;

      beforeEach(async () => {
        jest.spyOn(model, "create").mockReturnValueOnce(invalidCheese);
        response = await callServer(`/cheeses`, {
          method: "POST",
          body: JSON.stringify(invalidCheese),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      it("throws a Bad Request error", async () => {
        expect(response.status).toBe(400);
      });
    });
  });

  describe("when replacing a cheese", () => {
    describe("and all fields are correctly inputted", () => {
      const originalCheese: Cheese = mockCheese();
      const replacementCheese: Partial<Cheese> = {
        name: "New Name",
        description: "New Description",
        pricePerKilo: 5.0,
        images: ["http://example.com/new_image.jpg"],
      };
      let response: Response;

      beforeEach(async () => {
        // Return the original cheese
        jest.spyOn(model, "getById").mockReturnValueOnce(originalCheese);

        // Replace cheese data
        response = await callServer(`/cheeses/${originalCheese.id}`, {
          method: "PUT",
          body: JSON.stringify(replacementCheese),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      it("updates the cheese details", async () => {
        // Expect the response to be the updated cheese
        await expect(response.json()).resolves.toEqual({
          ...originalCheese, // Keep the same ID
          ...replacementCheese, // Update other fields
        });
      });

      it("returns a 200 status code", async () => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe("when calling an unknown route", () => {
    let response: Response;

    beforeEach(async () => {
      response = await callServer("/bad-route");
    });

    it("returns a 404 error", () => {
      expect(response.status).toBe(404);
    });
  });
});

/**
 * Helper function for testing routes against our server
 */
async function callServer(
  path: string,
  options?: RequestInit
): Promise<Response> {
  return await fetch(`http://localhost:${PORT}${path}`, options);
}
