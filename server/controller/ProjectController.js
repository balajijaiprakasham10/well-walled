const Project = require("../models/Project");
const fs = require("fs"); // For file system operations (deleting files)
const path = require("path"); // For resolving file paths

// --- Helper function to delete old files ---
const deleteOldFiles = (images) => {
  // Construct the absolute path to the directory where files were saved
  const uploadsDir = path.join(__dirname, "..", "uploads");

  // Loop through image fields and delete the files
  for (const key in images) {
    if (images[key]) {
      // images[key] is the path saved by Multer, e.g., 'uploads\filename.jpg'
      const filePath = path.join(uploadsDir, path.basename(images[key]));

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    }
  }
};

// 1. Logic for GET /api/projects (Get all projects)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ dateCreated: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 2. Logic for POST /api/projects (Create a new project)
const createProject = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!req.files || !req.files.before || !req.files.cad || !req.files.after) {
      return res
        .status(400)
        .json({ msg: "Missing one or more required images" });
    }

    const newProject = new Project({
      title,
      description,
      location,
      images: {
        before: req.files.before[0].path,
        cad: req.files.cad[0].path,
        after: req.files.after[0].path,
      },
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 3. Logic for PUT/PATCH /api/projects/:id (Update a project)
// --- UPDATE PROJECT ---
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const updates = { ...req.body };
    const files = req.files;

    if (!projectId) {
      return res
        .status(400)
        .json({ msg: "Project ID is required for update." });
    }

    // 1. Find the existing project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found." });
    }

    // 2. Handle file updates and old file deletion
    const oldImages = { ...project.images }; // Copy old paths

    for (const field of ["before", "cad", "after"]) {
      if (files && files[field] && files[field][0]) {
        const newPath = files[field][0].path.replace(/\\/g, "/");
        updates.images = { ...updates.images, [field]: newPath };

        // Delete old file if a new one was uploaded
        if (oldImages[field]) {
          const fullPath = path.join(__dirname, "..", oldImages[field]);
          fs.unlink(fullPath, (err) => {
            if (err)
              console.error(
                `Failed to delete old file: ${oldImages[field]}`,
                err
              );
          });
        }
      }
    }

    // Merge image updates with text updates
    const finalUpdates = {
      ...updates,
      images: { ...oldImages, ...updates.images },
    };

    // 3. Perform the update
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: finalUpdates },
      { new: true, runValidators: true }
    );

    res.json(updatedProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during update.");
  }
};


// --- DELETE PROJECT ---
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    // 1. Find the project to get file paths
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found." });
    }

    // 2. Delete the associated files from the uploads directory
    const imageFields = ["before", "cad", "after"];
    for (const field of imageFields) {
      const filePath = project.images[field];
      if (filePath) {
        const fullPath = path.join(__dirname, "..", filePath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error(`Failed to delete file: ${filePath}`, err);
        });
      }
    }

    // 3. Delete the project document from MongoDB
    await Project.findByIdAndDelete(projectId);

    res.json({ msg: "Project removed." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during deletion.");
  }
};
module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
