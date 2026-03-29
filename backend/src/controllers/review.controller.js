import { getCommentsByRecipeId, addComment } from "../models/review.model.js";
import { createNotification } from "../models/notification.model.js";
import { getRecipeById } from "../models/recipe.model.js";
import pool from "../config/db.js"

const sendPushNotification = async (pushToken, title, body) => {
  if (!pushToken) return; // no token, skip silently

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: pushToken,
      title,
      body,
      sound: "default",
    }),
  });
};


const getComments = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const comments = await getCommentsByRecipeId(recipeId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error.message);
    res.status(500).json({ message: "Server error fetching comments" });
  }
};

const createComment = async (req, res) => {
  const { recipeId } = req.params;
  const { user_id, username, comment } = req.body;
  try {
    if (!user_id || !username || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newComment = await addComment(recipeId, user_id, username, comment);

    // Create notification for recipe owner
    const recipe = await getRecipeById(recipeId);

    //console.log("Recipe found:", recipe);
    //console.log("Recipe user_id:", recipe?.user_id);
    //console.log("Commenter user_id:", user_id);
    //console.log("Are they different?", recipe?.user_id !== parseInt(user_id));

    // Only notify if commenter is NOT the owner
    if (recipe && recipe.user_id && recipe.user_id !== parseInt(user_id)) {
      await createNotification(recipe.user_id, recipeId, username, recipe.title);

      // Get owner's push token
      const ownerResult = await pool.query(
        "SELECT push_token FROM users WHERE id = $1",
        [recipe.user_id]
      );
      const pushToken = ownerResult.rows[0]?.push_token;

      // Send push notification to owner's phone
      await sendPushNotification(
        pushToken,
        "New Comment",
        `${username} commented on your recipe "${recipe.title}"`
      );
    }

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("Add comment error:", error.message);
    res.status(500).json({ message: "Server error adding comment" });
  }
};

export { getComments, createComment };
