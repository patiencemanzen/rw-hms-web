import type { SchemaErrorResponseDto } from "./schema";

export type ApiErrorCode = SchemaErrorResponseDto["code"] | "NETWORK_ERROR";

/** A failed API call with the API's machine-readable error code. */
export class ApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly status: number,
    message: string,
    readonly details: SchemaErrorResponseDto["details"] = undefined,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function toApiError(error: unknown, response: Response | undefined): ApiError {
  if (error && typeof error === "object" && "code" in error && "message" in error) {
    const body = error as SchemaErrorResponseDto;
    return new ApiError(
      body.code,
      body.statusCode ?? response?.status ?? 0,
      body.message,
      body.details,
    );
  }
  return new ApiError("INTERNAL_ERROR", response?.status ?? 0, "Unexpected API response");
}

/** openapi-fetch rejects with a TypeError when the server cannot be reached at all. */
export function networkError(): ApiError {
  return new ApiError("NETWORK_ERROR", 0, "The API could not be reached");
}
