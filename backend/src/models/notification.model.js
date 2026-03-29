import pool from "../config/db.js";

const createNotification = async (owner_id, recipe_id, commenter_name, recipe_title) => {
  const result = await pool.query(
    `INSERT INTO notifications (owner_id, recipe_id, commenter_name, recipe_title)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [owner_id, recipe_id, commenter_name, recipe_title]
  );
  return result.rows[0];
};

const getNotificationsByOwner = async (owner_id) => {
  const result = await pool.query(
    `SELECT * FROM notifications WHERE owner_id = $1 ORDER BY created_at DESC`,
    [owner_id]
  );
  return result.rows;
};

const markAllAsRead = async (owner_id) => {
  await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE owner_id = $1`,
    [owner_id]
  );
};

export { createNotification, getNotificationsByOwner, markAllAsRead };
