enum ErrorHttpStatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

class ApiError extends Error {
  readonly name: string;
  readonly httpCode: ErrorHttpStatusCode;

  constructor(name: string, httpCode: ErrorHttpStatusCode, message: string) {
    super(message);

    this.name = name;
    this.httpCode = httpCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export { ApiError };
