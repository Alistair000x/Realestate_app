import express from "express";
import {
  addMessage
} from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

// Create an instance of the Express Router
const router = express.Router();

// Define route to add a message to a specific chat
// Handles POST requests to /:chatId (requires token verification)
router.post("/:chatId", verifyToken, addMessage);

// Export the router to be used in other parts of the application
export default router;
