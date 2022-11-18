export interface ITransferRequest {
  to: string;
  value: number;
}

export interface ITransferEmitter {
  to: string;
  transactionId: string;
}
