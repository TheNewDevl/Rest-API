import { Response } from "express";

const request = require("supertest");
const app = require("./app");

describe("Test ", () => {
    test("It should response the GET method", () => {
        return request(app)
            .get("/")
            .then((response: Response) => {
                expect(response.statusCode).toBe(200);
            });
    });
});