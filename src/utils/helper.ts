/**
 * Check if app runs in development mode
 */
export function isDev(): boolean {
  return Boolean(
    (typeof import.meta !== "undefined" && import.meta.env && (import.meta.env.DEV || import.meta.env.MODE === "development")) ||
    (typeof process !== "undefined" && process.env?.NODE_ENV === "development")
  );
}

/**
 * Add corsproxy only in dev
 */
export function CorsIfDev(url: string): string {
  if (isDev()) {
    return `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
  }
  return url;
}