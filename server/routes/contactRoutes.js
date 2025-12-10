// routes/contactRoutes.js
import express from "express";
import { submitContactForm } from "../controller/contactController.js";


const router = express.Router();

// POST /api/contact
router.post("/", submitContactForm);

export default router;
