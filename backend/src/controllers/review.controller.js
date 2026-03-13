import { getCommentsByRecipeId, addComment } from "../models/review.model.js";

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
    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("Add comment error:", error.message);
    res.status(500).json({ message: "Server error adding comment" });
  }
};

export { getComments, createComment };
