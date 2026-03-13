import pool from "../config/db.js";

const createRecipe = async (title, description, category, cooking_time, image_url, user_id) => {
  const result = await pool.query(
    `INSERT INTO recipes (title, description, category, cooking_time, image_url, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, category, cooking_time, image_url, user_id]
  );
  return result.rows[0];
};

const getAllRecipes = async () => {
  const result = await pool.query(
    "SELECT * FROM recipes ORDER BY created_at DESC"
  );
  return result.rows;
};

//get one recipe by ID
const getRecipeById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM recipes WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export { createRecipe, getAllRecipes, getRecipeById };
