/**
 * Client-side session state shared by the API client and the auth hooks. The session itself lives
 * in httpOnly cookies set by the API; only the CSRF token and the chosen facility are kept here.
 */

const FACILITY_STORAGE_KEY = "rwhms.activeFacilityId";

let csrfToken: string | null = null;
let activeFacilityId: string | null = null;
const sessionLostListeners = new Set<() => void>();

export function getCsrfToken(): string | null {
  return csrfToken;
}

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

export function getActiveFacilityId(): string | null {
  if (activeFacilityId) return activeFacilityId;
  try {
    activeFacilityId = window.localStorage.getItem(FACILITY_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); fall back to memory only.
  }
  return activeFacilityId;
}

export function setActiveFacilityId(facilityId: string | null): void {
  activeFacilityId = facilityId;
  try {
    if (facilityId) window.localStorage.setItem(FACILITY_STORAGE_KEY, facilityId);
    else window.localStorage.removeItem(FACILITY_STORAGE_KEY);
  } catch {
    // See getActiveFacilityId.
  }
}

/** Called when a refresh fails mid-session, so the UI can send the user back to sign in. */
export function onSessionLost(listener: () => void): () => void {
  sessionLostListeners.add(listener);
  return () => sessionLostListeners.delete(listener);
}

export function notifySessionLost(): void {
  csrfToken = null;
  sessionLostListeners.forEach((listener) => listener());
}
