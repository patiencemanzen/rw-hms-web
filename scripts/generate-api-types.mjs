import { execFileSync } from "node:child_process";

const source = process.env.API_DOCS_URL ?? "http://localhost:4000/api/docs-json";

execFileSync(
  "npx",
  ["openapi-typescript", source, "--output", "lib/api/schema.d.ts", "--root-types"],
  { stdio: "inherit", shell: process.platform === "win32" },
);
