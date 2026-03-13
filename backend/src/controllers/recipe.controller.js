import { createRecipe, getAllRecipes } from "../models/recipe.model.js";

// GET all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Get recipes error:", error.message);
    res.status(500).json({ message: "Server error fetching recipes" });
  }
};

// POST add recipe
const addRecipe = async (req, res) => {
  const { title, description, category, cooking_time, user_id } = req.body;

  try {
    if (!title || !description || !category || !cooking_time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // image_url: if file uploaded use path, else use URL string from body
    const image_url = req.file
      ? `uploads/${req.file.filename}`
      : req.body.image_url || null;

    const recipe = await createRecipe(
      title,
      description,
      category,
      parseInt(cooking_time),
      image_url,
      user_id || null
    );

    res.status(201).json({ message: "Recipe added successfully", recipe });

  } catch (error) {
    console.error("Add recipe error:", error);
    res.status(500).json({ message: "Server error adding recipe" });
  }
};

export { getRecipes, addRecipe };
