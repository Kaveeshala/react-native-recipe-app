import pool from "../config/db.js";

const getCommentsByRecipeId = async (recipe_id) => {
  const result = await pool.query(
    `SELECT * FROM reviews WHERE recipe_id = $1 ORDER BY created_at DESC`,
    [recipe_id]
  );
  return result.rows;
};

const addComment = async (recipe_id, user_id, username, comment) => {
  const result = await pool.query(
    `INSERT INTO reviews (recipe_id, user_id, username, comment)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [recipe_id, user_id, username, comment]
  );
  return result.rows[0];
};

export { getCommentsByRecipeId, addComment };
