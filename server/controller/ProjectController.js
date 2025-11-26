import { ProjectCollection } from "../models/Project.js";


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
    const { title, description, location, showOnHome } = req.body;

    if (!req.files?.before || !req.files?.cad || !req.files?.after) {
      return res
        .status(400)
        .json({ msg: "Missing one or more required images" });
    }

    const newProject = {
      title,
      description,
      location,
      showOnHome: showOnHome === "true",
      images: {
        // ⭐ CHANGE: Use the Cloudinary URL (req.files[0].path) and remove path manipulation
        before: req.files.before[0].path, 
        cad: req.files.cad[0].path, 
        after: req.files.after[0].path, 
      },
      dateCreated: new Date(),
    };

    const result = await ProjectCollection.insertOne(newProject);
    newProject._id = result.insertedId;

    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// --- UPDATE PROJECT ---
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const files = req.files;

    const updates = {
      ...req.body,
      showOnHome: req.body.showOnHome === "true",
    };

    const project = await ProjectCollection.findOne({ _id: projectId });
    if (!project) return res.status(404).json({ msg: "Project not found." });

    const updatedImages = { ...project.images };
    const imagesToDelete = []; // Array to hold Cloudinary public IDs for deletion

    for (const key of ["before", "cad", "after"]) {
      if (files?.[key]?.[0]) {
        // ⭐ CHANGE 1: Capture the old image URL for deletion
        const oldUrl = project.images[key];
        if (oldUrl) imagesToDelete.push(oldUrl); 

        // ⭐ CHANGE 2: Save the new Cloudinary URL
        updatedImages[key] = files[key][0].path;
      }
    }

    // NOTE: Cloudinary deletion logic is complex (needs public_id extraction and API call). 
    // For simplicity, we skip remote deletion here, but in a production app, you must
    // implement `cloudinary.uploader.destroy(public_id)` before updating the image.

    await ProjectCollection.updateOne(
      { _id: projectId },
      { $set: { ...updates, images: updatedImages } }
    );

    res.json({ msg: "Project updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};

// --- DELETE PROJECT ---
export const deleteProject = async (req, res) => {
    

    try {
        const projectId = req.params.id;

        const project = await ProjectCollection.findOne({ _id: projectId });
        if (!project) return res.status(404).json({ msg: "Project not found." });

        /* // ⚠️ REMOVED LOCAL FILE DELETION LOGIC (MUST BE REPLACED BY CLOUDINARY DELETION)
        for (const key of ["before", "cad", "after"]) {
            const filePath = project.images[key];
            if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        */

        await ProjectCollection.deleteOne({ _id: projectId });

        res.json({ msg: "Project deleted." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Delete failed" });
    }
};

// --- GET HOME PROJECTS ONLY ---
export const getHomeProjects = async (req, res) => {
  try {
    const projects = await ProjectCollection.find(
      { showOnHome: true },
      { sort: { dateCreated: -1 } }
    ).toArray();

    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
