import { ItemCollection } from "../models/Item.js";
import { ObjectId } from "mongodb";

// Get all items
export const getItems = async (req, res) => {
  try {
    const items = await ItemCollection.find({}).toArray();
    res.json(items);
  } catch (err) {
    console.error("❌ Fetch Items Error:", err);
    res.status(500).json({ msg: "Failed to fetch items" });
  }
};

// Create item
export const addItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    console.log("📌 Incoming Item Data:", { title, description, category });
    console.log("📸 Uploaded Files:", req.files);

    if (!title || !description || !category) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!req.files || req.files.length < 5) {
      return res.status(400).json({ msg: "Minimum 5 images required" });
    }

    const imageUrls = req.files.map((file) => file.path);

    const result = await ItemCollection.insertOne({
      title,
      description,
      category,
      images: imageUrls,
      createdAt: new Date(),
    });

    console.log("✅ Item Insert Success:", result);

    return res.status(201).json({
      msg: "Item created successfully!",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("🔥 Add Item FULL ERROR:");
    console.error(err); // This prints full stack + Cloudinary/Astra message

    return res.status(500).json({
      msg: err.message || "Server Error",
    });
  }

};

// Delete Item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ItemCollection.deleteOne({
      _id: id, // ❌ ObjectId removed
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Item not found" });
    }

    res.json({ msg: "Item deleted" });
  } catch (err) {
    console.error("❌ Delete Item Error:", err);
    res.status(500).json({ msg: "Failed to delete item" });
  }
};


// Get Items by Category
export const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const results = await ItemCollection.find({ category }).toArray();
    res.json(results);
  } catch (err) {
    console.error("❌ Fetch Items by Category Error:", err);
    res.status(500).json({ msg: "Failed to fetch items" });
  }
};
