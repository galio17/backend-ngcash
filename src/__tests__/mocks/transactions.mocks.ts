import { ITransferRequest } from "../../interfaces";
import { userMock, userToTransferMock } from "./users.mocks";

export const transferMock: ITransferRequest = {
  to: userToTransferMock.username,
  value: 25.23,
};
export const reverseTransferMock: ITransferRequest = {
  to: userMock.username,
  value: 0.23,
};
