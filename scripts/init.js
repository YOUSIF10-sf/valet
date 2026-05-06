const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

async function init() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  console.log("Connecting to Turso...");

  const schemaPath = path.join(__dirname, "../src/lib/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  // Split by semicolon but ignore inside strings if possible. 
  // For a simple schema, splitting by semicolon is usually fine.
  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await client.execute(statement);
    } catch (err) {
      console.error(`Error executing statement: ${err.message}`);
    }
  }

  console.log("Database initialized successfully!");
  process.exit(0);
}

init();
