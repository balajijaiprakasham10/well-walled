import { db } from "../config/data.js"; // Import from the CONFIG, not server.js

// Access the 'items' collection
const ItemCollection = db.collection("items");

export { ItemCollection };
