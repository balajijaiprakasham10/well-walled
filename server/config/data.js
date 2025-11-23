import { DataAPIClient } from "@datastax/astra-db-ts";
import dotenv from "dotenv";
dotenv.config();

// Make sure your ENV variables are loaded correctly
const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
const endpoint = process.env.ASTRA_DB_API_ENDPOINT;

if (!token || !endpoint) {
  console.error("❌ Missing Astra DB Env Variables");
}

const client = new DataAPIClient(token);
export const db = client.db(endpoint);

console.log("🚀 Astra Data API Connected via config");
