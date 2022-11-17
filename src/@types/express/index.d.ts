declare global {
  namespace Express {
    interface Request {
      validBody: any;
    }
  }
}

export {};
