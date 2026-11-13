import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/**
 * Base URL of the Global Inc API (server-side only, read at build time). The browser never calls it
 * directly: /api/* is proxied there, so session cookies stay first-party on the web domain.
 */
const apiUrl = process.env.API_URL?.replace(/\/+$/, "");
if (!apiUrl || !/^https?:\/\//.test(apiUrl)) {
  throw new Error("API_URL must be set to the API base URL, e.g. http://localhost:4000");
}

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

export default withNextIntl(nextConfig);
