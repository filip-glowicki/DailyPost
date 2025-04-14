export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  status: number;
};

export class ApiResponseBuilder {
  static success<T>(data: T, status: number = 200): ApiResponse<T> {
    return {
      success: true,
      data,
      status,
    };
  }

  static created<T>(data: T): ApiResponse<T> {
    return this.success(data, 201);
  }

  static error(
    error: string,
    status: number = 500,
    details?: unknown,
  ): ApiResponse<never> {
    const response: ApiResponse<never> = {
      success: false,
      error,
      status,
    };

    if (details !== undefined) {
      response.details = details;
    }

    return response;
  }

  static badRequest(error: string, details?: unknown): ApiResponse<never> {
    return this.error(error, 400, details);
  }

  static unauthorized(error: string = "Unauthorized"): ApiResponse<never> {
    return this.error(error, 401);
  }

  static forbidden(error: string = "Forbidden"): ApiResponse<never> {
    return this.error(error, 403);
  }

  static notFound(error: string = "Not found"): ApiResponse<never> {
    return this.error(error, 404);
  }

  static internalError(
    error: string = "Internal server error",
  ): ApiResponse<never> {
    return this.error(error, 500);
  }

  static validationError(details: unknown): ApiResponse<never> {
    return this.badRequest("Invalid input data", details);
  }
}
