import { ProjectCollection } from "../models/Project.js";
import { cloudinary } from "../middleware/uploadCloud.js";
import { ObjectId } from "mongodb";
const getPublicId = (url) => {
  const parts = url.split("/");
  const file = parts[parts.length - 1]; // abc123.jpg
  const folder = parts[parts.length - 2]; // projects folder
  const name = file.split(".")[0];

  return `${folder}/${name}`;
};


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
// --- CREATE PROJECT ---
export const createProject = async (req, res) => {
  try {
    const { title, description, location, showOnHome } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "At least one image is required." });
    }

    const imageUrls = req.files.map(file => file.path); // Cloudinary URLs

    const newProject = {
      title,
      description,
      location,
      showOnHome: showOnHome === "true",
      images: imageUrls,   // ✅ ARRAY INSTEAD OF OBJECT
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
// --- UPDATE PROJECT ---
export const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await ProjectCollection.findOne({ _id: projectId });
        if (!project) return res.status(404).json({ msg: "Project not found." });

        const updates = {
            ...req.body,
            showOnHome: req.body.showOnHome === "true",
        };

        // ✅ If new images uploaded, replace old ones
        if (req.files && req.files.length > 0) {
            // 👇 ADD THIS CHECK: Ensure project.images is an array before iterating
            if (Array.isArray(project.images)) {
                for (const img of project.images) {
                    const id = getPublicId(img);
                    await cloudinary.uploader.destroy(id);
                }
            }

            updates.images = req.files.map((file) => file.path);
        }

        await ProjectCollection.updateOne({ _id: projectId }, { $set: updates });

        res.json({ msg: "Project updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Update failed", error: err.message });
    }
};

// --- DELETE PROJECT ---
// --- DELETE PROJECT ---
// --- DELETE PROJECT ---
export const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await ProjectCollection.findOne({ _id: projectId });
        if (!project) return res.status(404).json({ msg: "Project not found." });

        // ✅ DELETE IMAGES FROM CLOUDINARY
        // 👇 ADD THIS CHECK: Ensure project.images is an array before iterating
        if (Array.isArray(project.images)) {
            for (const imageUrl of project.images) {
                const publicId = getPublicId(imageUrl);
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await ProjectCollection.deleteOne({ _id: projectId });

        res.json({ msg: "Project & images deleted successfully." });
    } catch (err) {
        console.error("Cloudinary Delete Error:", err);
        res.status(500).json({ msg: "Delete failed", error: err.message });
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

export const getProjectById = async (req, res) => {
  try {
    const id = req.params.id.trim();
    console.log("Fetching project by UUID:", id);

    const project = await ProjectCollection.findOne({ _id: id });

    if (!project) {
      console.log("❌ Not found:", id);
      return res.status(404).json({ msg: "Project not found" });
    }

    console.log("✅ Found:", project.title);
    res.json(project);
  } catch (err) {
    console.error("GET PROJECT BY ID ERROR:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


export const getProjectBySlug = async (req, res) => {
  const slug = req.params.slug.replace(/-/g, " ");

  const project = await ProjectCollection.findOne({
    title: { $regex: new RegExp(`^${slug}$`, "i") },
  });

  if (!project) return res.status(404).json({ msg: "Project not found" });

  res.json(project);
};

