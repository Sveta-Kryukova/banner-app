import { HttpErrorResponse } from "@angular/common/http";

/**
 * Normalizes API/network failures to a single human-readable string.
 * Matches Nest `HttpErrorBody` (`message` string or validation array).
 */
export function parseHttpErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return messageFromHttpErrorResponse(error);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

function messageFromHttpErrorResponse(error: HttpErrorResponse): string {
  const body: unknown = error.error;

  if (body !== null && typeof body === "object") {
    const raw = (body as { message?: unknown }).message;
    if (typeof raw === "string" && raw.length > 0) {
      return raw;
    }
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map(String).join(", ");
    }
  }

  if (error.status === 0) {
    return "Network error: server unreachable or CORS blocked the request.";
  }

  const statusText = error.statusText?.trim();
  if (statusText) {
    return `HTTP ${error.status}: ${statusText}`;
  }
  return `HTTP ${error.status}`;
}
