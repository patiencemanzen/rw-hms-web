import createClient from "openapi-fetch";
import type { paths, SchemaAuthSessionDto } from "./schema";
import {
  getActiveFacilityId,
  getCsrfToken,
  notifySessionLost,
  setCsrfToken,
} from "./session-store";

const AUTH_PREFIX = "/api/v1/auth/";
/** Auth calls that must never trigger an automatic refresh-and-retry. */
const NO_RETRY_PATHS = new Set(
  ["login", "refresh", "logout", "forgot-password", "reset-password"].map((p) => AUTH_PREFIX + p),
);
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

let refreshInFlight: Promise<SchemaAuthSessionDto | null> | null = null;

/**
 * Rotates the session cookies. Concurrent callers share one request, because the API treats a
 * second use of the same refresh token as a race only within a short grace window.
 */
export function refreshSession(): Promise<SchemaAuthSessionDto | null> {
  refreshInFlight ??= fetch(`${AUTH_PREFIX}refresh`, { method: "POST", credentials: "same-origin" })
    .then(async (response) => {
      if (!response.ok) return null;
      const session = (await response.json()) as SchemaAuthSessionDto;
      setCsrfToken(session.csrfToken);
      return session;
    })
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

function withSessionHeaders(request: Request): Request {
  const csrf = getCsrfToken();
  if (csrf && UNSAFE_METHODS.has(request.method)) request.headers.set("X-CSRF-Token", csrf);
  const facilityId = getActiveFacilityId();
  if (facilityId) request.headers.set("X-Facility-Id", facilityId);
  return request;
}

/**
 * Adds the CSRF and facility headers. When the short-lived access token has expired (401) or
 * the CSRF token is stale (403), it refreshes the session once and retries the request.
 */
async function sessionFetch(request: Request): Promise<Response> {
  const retry = request.clone();
  const response = await fetch(withSessionHeaders(request));
  if (NO_RETRY_PATHS.has(new URL(request.url).pathname)) return response;

  if (response.status === 401) {
    const session = await refreshSession();
    if (!session) {
      notifySessionLost();
      return response;
    }
    return fetch(withSessionHeaders(retry));
  }

  if (response.status === 403) {
    const body = (await response
      .clone()
      .json()
      .catch(() => null)) as { code?: string } | null;
    if (body?.code === "CSRF_TOKEN_INVALID" && (await refreshSession())) {
      return fetch(withSessionHeaders(retry));
    }
  }
  return response;
}

/**
 * Calls go to the web app's own origin; next.config.ts rewrites /api/* to the API. That keeps the
 * session cookies first-party wherever the two apps are hosted.
 */
export const apiClient = createClient<paths>({
  credentials: "same-origin",
  fetch: sessionFetch,
});
