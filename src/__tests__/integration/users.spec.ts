import request from "supertest";
import { server } from "../../app";
import { IUserRequest } from "../../interfaces";
import { userMock } from "../mocks";

let userId: string;

describe("POST /users", () => {
  test("should be able to create a user", async () => {
    const response = await request(server).post("/users").send(userMock);
    userId = response.body.id;
    userId;

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      username: expect.any(String),
      balance: expect.any(Number),
    });
  });

  describe("should not be able to create a user", () => {
    test("without required fields", async () => {
      const response = await request(server).post("/users");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: expect.arrayContaining([
          expect.stringMatching(
            /^(?=.*username(\s|$))(?=.*required?(\s|$)).*$/i
          ),
          expect.stringMatching(
            /^(?=.*password(\s|$))(?=.*required?(\s|$)).*$/i
          ),
        ]),
      });
    });

    test("without fields matches", async () => {
      const invalidUser: IUserRequest = {
        username: "a",
        password: "a",
      };

      const response = await request(server).post("/users").send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: expect.arrayContaining([
          expect.stringMatching(/^(?=.*username(\s|$))(?=.*3|three(\s|$)).*$/i),
          expect.stringMatching(
            /^(?=.*password(\s|$))(?=.*8|height(\s|$)).*$/i
          ),
          expect.stringMatching(/^(?=.*password(\s|$))(?=.*number(\s|$)).*$/i),
          expect.stringMatching(
            /^(?=.*password(\s|$))(?=.*(capital(ize)?|upper)(\s|$)).*$/i
          ),
        ]),
      });
    });

    test("with existing username", async () => {
      const response = await request(server).post("/users").send(userMock);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        message: expect.stringMatching(/^(?=already|exists?|used?).*$/i),
      });
    });
  });
});
