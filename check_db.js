const { createClient } = require("@libsql/client");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env.local") });

async function checkDB() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    const client = createClient({ url, authToken });

    console.log("Checking settings table...");
    const res = await client.execute("SELECT * FROM settings");
    console.log("Settings rows:", res.rows);

    if (res.rows.length === 0) {
        console.log("Inserting default settings manually...");
        await client.execute({
            sql: "INSERT INTO settings (key, value) VALUES (?, ?), (?, ?)",
            args: ["admin_username", "admin", "admin_password", "valet2026"]
        });
        console.log("Done!");
    }
}

checkDB().catch(console.error);
