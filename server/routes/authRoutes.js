import express from "express";
import { adminLogin } from "../controller/authController.js";
const router = express.Router();

router.post("/login", adminLogin);

export default router;
