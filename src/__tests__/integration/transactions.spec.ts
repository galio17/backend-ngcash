import request from "supertest";
import { server } from "../../app";
import { ITransferRequest } from "../../interfaces";
import {
  invalidAuthorizationMock,
  transferMock,
  userMock,
  userToTransferMock,
} from "../mocks";

let authorization = "Bearer ";

beforeAll(async () => {
  await request(server).post("/users").send(userMock);

  const login = await request(server).post("/login").send(userMock);
  authorization += login.body.token;

  await request(server).post("/users").send(userToTransferMock);
  transferMock.to = userToTransferMock.username;
});

describe("POST /transactions/transfer", () => {
  test("should be able to transfer credits to other user", async () => {
    const response = await request(server)
      .post("/transactions/transfer")
      .send(transferMock)
      .set("Authorization", authorization);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      from: userMock.username,
      to: userToTransferMock.username,
      value: expect.any(Number),
      releaseDate: expect.any(Date),
    });
  });

  describe("should not be able to transfer credits", () => {
    test("without required fields ", async () => {
      const response = await request(server).post("/transactions/transfer");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: expect.arrayContaining([
          expect.stringMatching(/^(?=.*to(\s|$))(?=.*required?(\s|$)).*$/i),
          expect.stringMatching(/^(?=.*value(\s|$))(?=.*required?(\s|$)).*$/i),
        ]),
      });
    });

    test("without fields matches", async () => {
      const response = await request(server).post("/transactions/transfer");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: expect.arrayContaining([
          expect.stringMatching(
            /^(?=.*value(\s|$))(?=.*min(imum)?(\s|$))(?=.*(0[.,]01|1\scents?)(\s|$)).*$/i
          ),
        ]),
      });
    });

    test("without authentication", async () => {
      const response = await request(server).post("/transactions/transfer");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*miss(ing)?(\s|$))(?=.*authorization(\s|$)).*$/i
        ),
      });
    });

    test("with invalid/expired authentication", async () => {
      const response = await request(server)
        .post("/transactions/transfer")
        .set("Authorization", invalidAuthorizationMock);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*expired?(\s|$))(?=.*invalid(\s|$))(?=.*token(\s|$)).*$/
        ),
      });
    });

    test("with insufficient balance", async () => {
      const invalidTransfer: ITransferRequest = {
        ...transferMock,
        value: 200,
      };

      const response = await request(server)
        .post("/transactions/transfer")
        .send(invalidTransfer)
        .set("Authorization", authorization);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=transfer(\s|$))(?=balance(\s|$))(?=insufficient(\s|$)).*$/
        ),
      });
    });

    test("to yourself", async () => {
      const invalidTransfer: ITransferRequest = {
        ...transferMock,
        to: userMock.username,
      };

      const response = await request(server)
        .post("/transactions/transfer")
        .send(invalidTransfer)
        .set("Authorization", authorization);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=transfer(\s|$))(?=you(rself)?(\s|$)).*$/
        ),
      });
    });
  });
});

describe("GET /transactions", () => {
  test("should be able to list own transactions", async () => {
    const response = await request(server)
      .get("/transactions")
      .set("Authorization", authorization);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        from: userMock.username,
        to: userToTransferMock.username,
        value: expect.any(Number),
        releaseDate: expect.any(Date),
      },
    ]);
  });

  describe("should not be able to list own transactions", () => {
    test("without authentication", async () => {
      const response = await request(server).get("/transactions");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*miss(ing)?(\s|$))(?=.*authorization(\s|$)).*$/i
        ),
      });
    });

    test("with invalid/expired authentication", async () => {
      const response = await request(server)
        .get("/transactions")
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
