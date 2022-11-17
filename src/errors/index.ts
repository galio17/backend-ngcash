class AppError {
  message: string | string[];
  statusCode: number = 400;

  constructor(message: string | string[], statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
