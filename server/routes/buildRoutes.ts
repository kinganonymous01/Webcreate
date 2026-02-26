import express from "express";
import { buildWebsite } from "../controllers/buildController.js";

const router = express.Router();

router.post("/", buildWebsite);

export default router;
