import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

// Create an instance of the Express Router
const router = express.Router();

// Define route to get all chats for the authenticated user
// Handles GET requests to / (requires token verification)
router.get("/", verifyToken, getChats);

// Define route to get a specific chat by its ID
// Handles GET requests to /:id (requires token verification)
router.get("/:id", verifyToken, getChat);

// Define route to create a new chat
// Handles POST requests to / (requires token verification)
router.post("/", verifyToken, addChat);

// Define route to mark a chat as read by its ID
// Handles PUT requests to /read/:id (requires token verification)
router.put("/read/:id", verifyToken, readChat);

// Export the router to be used in other parts of the application
export default router;
