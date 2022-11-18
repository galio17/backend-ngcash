import request from "supertest";
import { server } from "../../app";
import { ITransferRequest } from "../../interfaces";
import { prisma } from "../../prisma";
import {
  invalidAuthorizationMock,
  reverseTransferMock,
  transferMock,
  userMock,
  userToTransferMock,
} from "../mocks";

let authorization = "Bearer ";
let transactionId: string;

beforeAll(async () => {
  await request(server).post("/users").send(userMock);

  const login = await request(server).post("/login").send(userMock);
  authorization += login.body.token;

  await request(server).post("/users").send(userToTransferMock);
});

describe("POST /transactions/transfer", () => {
  test("should be able to transfer credits to other user", async () => {
    const response = await request(server)
      .post("/transactions/transfer")
      .send(transferMock)
      .set("Authorization", authorization);
    transactionId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      from: userMock.username,
      to: userToTransferMock.username,
      value: transferMock.value,
      releaseDate: expect.any(String),
    });

    const accounts = await prisma.accounts.findMany({
      include: { user: true },
    });

    expect(accounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user: expect.objectContaining({
            username: userToTransferMock.username,
          }),
          balance: 100 + transferMock.value,
        }),
        expect.objectContaining({
          user: expect.objectContaining({ username: userMock.username }),
          balance: 100 - transferMock.value,
        }),
      ])
    );
  });

  describe("should not be able to transfer credits", () => {
    test("without required fields ", async () => {
      const response = await request(server)
        .post("/transactions/transfer")
        .set("Authorization", authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: expect.arrayContaining([
          expect.stringMatching(/^(?=.*to(\s|$))(?=.*required?(\s|$)).*$/i),
          expect.stringMatching(/^(?=.*value(\s|$))(?=.*required?(\s|$)).*$/i),
        ]),
      });
    });

    test("without fields matches", async () => {
      const invalidTransfer: ITransferRequest = {
        to: "user",
        value: 0.00003,
      };

      const response = await request(server)
        .post("/transactions/transfer")
        .send(invalidTransfer)
        .set("Authorization", authorization);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: expect.arrayContaining([
          expect.stringMatching(
            /^(?=.*value(\s|$))(?=.*(min(imum)?|greater)(\s|$))(?=.*(0[.,]01|1\scents?)(\s|$)).*$/i
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
          /^(?=.*transfer(\s|$))(?=.*balance(\s|$))(?=.*insufficient(\s|$)).*$/
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
          /^(?=.*transfer(\s|$))(?=.*you(rself)?(\s|$)).*$/
        ),
      });
    });
  });
});

describe("GET /transactions", () => {
  test("should be able to list own transactions", async () => {
    const toTransferLogin = await request(server)
      .post("/login")
      .send(userToTransferMock);
    const toTransferAuthorization = `Bearer ${toTransferLogin.body.token}`;
    await request(server)
      .post("/transactions/transfer")
      .send(reverseTransferMock)
      .set("Authorization", toTransferAuthorization);

    const response = await request(server)
      .get("/transactions")
      .set("Authorization", authorization);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        from: userToTransferMock.username,
        to: userMock.username,
        value: reverseTransferMock.value,
        releaseDate: expect.any(String),
      },
      {
        id: expect.any(String),
        from: userMock.username,
        to: userToTransferMock.username,
        value: transferMock.value,
        releaseDate: expect.any(String),
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

describe("GET /transactions/:id", () => {
  test("should be able to get own transaction", async () => {
    const response = await request(server)
      .get(`/transactions/${transactionId}`)
      .set("Authorization", authorization);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: transactionId,
      from: userMock.username,
      to: userToTransferMock.username,
      value: transferMock.value,
      releaseDate: expect.any(String),
    });
  });

  describe("should not be able to get own transaction", () => {
    test("without authentication", async () => {
      const response = await request(server).get(
        `/transactions/${transactionId}`
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*miss(ing)?(\s|$))(?=.*authorization(\s|$)).*$/i
        ),
      });
    });

    test("with invalid/expired authentication", async () => {
      const response = await request(server)
        .get(`/transactions/${transactionId}`)
        .set("Authorization", invalidAuthorizationMock);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*expired?(\s|$))(?=.*invalid(\s|$))(?=.*token(\s|$)).*$/
        ),
      });
    });

    test("with invalid/non-own transactionId", async () => {
      const response = await request(server)
        .get(`/transactions/8a7c9748-392f-4bd7-8def-bb45059776f6`)
        .set("Authorization", authorization);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: expect.stringMatching(
          /^(?=.*transactions?(\s|$))(?=.*not\sfound(\s|$)).*$/
        ),
      });
    });
  });
});
