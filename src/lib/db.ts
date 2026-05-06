import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.warn("⚠️ TURSO_DATABASE_URL is not defined. Database features will not work until environment variables are configured.");
}

export const db = createClient({
  url: url || "libsql://dummy-url",
  authToken: authToken || "",
});
