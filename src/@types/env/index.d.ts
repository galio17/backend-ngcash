declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET?: string;
      DATABASE_URL?: string;
      PORT?: string;
    }
  }
}

export {};
