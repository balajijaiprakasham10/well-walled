import { ProjectCollection } from "../models/Project.js";
import fs from "fs";
import path from "path";
import { ObjectId } from "@datastax/astra-db-ts";

// --- GET ALL PROJECTS ---
export const getProjects = async (req, res) => {
  try {
    const projects = await ProjectCollection.find(
      {},
      { sort: { dateCreated: -1 } }
    ).toArray();
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// --- CREATE PROJECT ---
export const createProject = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!req.files || !req.files.before || !req.files.cad || !req.files.after) {
      return res
        .status(400)
        .json({ msg: "Missing one or more required images" });
    }

    const newProject = {
      title,
      description,
      location,
      images: {
        before: req.files.before[0].path.replace(/\\/g, "/"),
        cad: req.files.cad[0].path.replace(/\\/g, "/"),
        after: req.files.after[0].path.replace(/\\/g, "/"),
      },
      dateCreated: new Date(),
    };

    const result = await ProjectCollection.insertOne(newProject);
    newProject._id = result.insertedId;

    res.status(201).json(newProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// --- UPDATE PROJECT ---
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const updates = { ...req.body };
    const files = req.files;

    const project = await ProjectCollection.findOne({
      _id: new ObjectId(projectId),
    });
    if (!project) {
      return res.status(404).json({ msg: "Project not found." });
    }

    const updatedImages = { ...project.images };

    for (const key of ["before", "cad", "after"]) {
      if (files?.[key]?.[0]) {
        const newPath = files[key][0].path.replace(/\\/g, "/");

        if (updatedImages[key]) {
          const oldPath = path.join(__dirname, "..", updatedImages[key]);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        updatedImages[key] = newPath;
      }
    }

    const updateData = {
      ...updates,
      images: updatedImages,
    };

    await ProjectCollection.updateOne(
      { _id: new ObjectId(projectId) },
      { $set: updateData }
    );

    res.json({ msg: "Project updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during update.");
  }
};

// --- DELETE PROJECT ---
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await ProjectCollection.findOne({
      _id: new ObjectId(projectId),
    });
    if (!project) {
      return res.status(404).json({ msg: "Project not found." });
    }

    for (const field of ["before", "cad", "after"]) {
      const filePath = project.images[field];
      if (filePath) {
        const absolute = path.join(__dirname, "..", filePath);
        if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
      }
    }

    await ProjectCollection.deleteOne({ _id: new ObjectId(projectId) });

    res.json({ msg: "Project removed." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during deletion.");
  }
};
