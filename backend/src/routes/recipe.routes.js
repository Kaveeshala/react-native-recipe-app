import express from "express";
import multer from "multer";
import path from "path";
import { getRecipes, addRecipe, getRecipe } from "../controllers/recipe.controller.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", getRecipes);
router.post("/", upload.single("image"), addRecipe);
router.get("/:id", getRecipe )

export default router;
