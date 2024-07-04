import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

// Create an instance of the Express Router
const router = express.Router();

// Define route to get all users
// Handles GET requests to /
// No authentication required
router.get("/", getUsers);

// Define route to update a user
// Handles PUT requests to /:id
// Requires token verification
router.put("/:id", verifyToken, updateUser);

// Define route to delete a user
// Handles DELETE requests to /:id
// Requires token verification
router.delete("/:id", verifyToken, deleteUser);

// Define route to save a post
// Handles POST requests to /save
// Requires token verification
router.post("/save", verifyToken, savePost);

// Define route to get profile posts
// Handles GET requests to /profilePosts
// Requires token verification
router.get("/profilePosts", verifyToken, profilePosts);

// Define route to get notification number
// Handles GET requests to /notification
// Requires token verification
router.get("/notification", verifyToken, getNotificationNumber);

// Export the router to be used in other parts of the application
export default router;
