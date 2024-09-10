export enum ErrorType {
  API_ERROR = 'ApiError',
  VALIDATION_ERROR = 'ValidationError',
}

export enum ErrorStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface ApiErrorOptions extends ErrorOptions {
  type: ErrorType;
  message: string;
  status: number | undefined;
  data?: any;
}

export class ApiError extends Error {
  type: ErrorType;
  status: ErrorStatus;
  redirectTo?: string;
  data?: any;
  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause });

    this.type = options.type || ErrorType.API_ERROR;
    this.status = options.status || ErrorStatus.INTERNAL_SERVER_ERROR;
    this.data = options.data || undefined;
  }
}
