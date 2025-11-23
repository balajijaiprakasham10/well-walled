import { CategoryCollection } from "../models/Category.js";
import { ObjectId } from "mongodb";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const result = await CategoryCollection.find({}).toArray();
    res.json(result);
  } catch (err) {
    console.error("Fetch Categories Error:", err);
    res.status(500).json({ msg: "Failed to fetch categories" });
  }
};

// Create category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await CategoryCollection.insertOne({ name });

    res.json({
      msg: "Category added",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Add Category Error:", err);
    res.status(500).json({ msg: "Failed to add category" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await CategoryCollection.updateOne(
      { _id: id }, // <-- Fix: no ObjectId()
      { $set: { name } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json({ msg: "Category updated" });
  } catch (err) {
    console.error("Update Category Error:", err);
    res.status(500).json({ msg: "Failed to update category" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await CategoryCollection.deleteOne({ _id: id }); // <-- Fix: use result

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.json({ msg: "Category deleted" });
  } catch (err) {
    console.error("Delete Category Error:", err);
    res.status(500).json({ msg: "Failed to delete category" });
  }
};