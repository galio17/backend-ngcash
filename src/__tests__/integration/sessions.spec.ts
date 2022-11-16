import request from "supertest";
import { server } from "../../app";
import { invalidAuthorizationMock, userMock } from "../mocks";

let authorization = "Bearer ";

beforeAll(async () => {
  await request(server).post("/users").send(userMock);
});

describe("POST /login", () => {
  test("should be able to login", async () => {
    const response = await request(server).post("/login").send(userMock);
    authorization += response.body.token;

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  describe("should not be able to login", () => {
    test("without required fields and matches", async () => {
      const response = await request(server).post("/login");

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

    test("with wrong password", async () => {
      const wrongUser: IUserRequest = {
        ...userMock,
        password: "wrong",
      };

      const response = await request(server).post("/login").send(wrongUser);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*username(\s|$))(?=.*password(\s|$))(?=.*match(\s|$)).*$/
        ),
      });
    });

    test("with wrong/inexistent username", async () => {
      const wrongUser: IUserRequest = {
        ...userMock,
        username: "wrong",
      };

      const response = await request(server).post("/login").send(wrongUser);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*username(\s|$))(?=.*password(\s|$))(?=.*match(\s|$)).*$/
        ),
      });
    });
  });
});

describe("GET /profile", () => {
  test("should be able to get profile", async () => {
    const response = await request(server)
      .get("/profile")
      .set("Authorization", authorization);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      username: expect.any(String),
      balance: expect.any(Number),
      transactions: expect.any(Array),
    });
  });

  describe("should not be able to get profile", () => {
    test("without authentication", async () => {
      const response = await request(server).get("/profile");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*miss(ing)?(\s|$))(?=.*authorization(\s|$)).*$/i
        ),
      });
    });

    test("with invalid/expired authentication", async () => {
      const response = await request(server)
        .get("/profile")
        .set("Authorization", invalidAuthorizationMock);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*expired?(\s|$))(?=.*invalid(\s|$))(?=.*token(\s|$)).*$/
        ),
      });
    });
  });
});
