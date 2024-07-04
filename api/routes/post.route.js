import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

// Create an instance of the Express Router
const router = express.Router();

// Define route to get all posts
// Handles GET requests to /
router.get("/", getPosts);

// Define route to get a specific post by ID
// Handles GET requests to /:id
router.get("/:id", getPost);

// Define route to add a new post (requires token verification)
// Handles POST requests to /
router.post("/", verifyToken, addPost);

// Define route to update a specific post by ID (requires token verification)
// Handles PUT requests to /:id
router.put("/:id", verifyToken, updatePost);

// Define route to delete a specific post by ID (requires token verification)
// Handles DELETE requests to /:id
router.delete("/:id", verifyToken, deletePost);

// Export the router to be used in other parts of the application
export default router;
