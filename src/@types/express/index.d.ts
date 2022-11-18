interface IReqUser {
  id: string;
  username: string;
  account: string;
}

declare global {
  namespace Express {
    interface Request {
      validBody: any;
      user: IReqUser;
    }
  }
}

export {};
