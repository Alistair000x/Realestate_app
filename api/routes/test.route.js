import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

// Create an instance of the Express Router
const router = express.Router();

// Define route to check if the user should be logged in
// Handles GET requests to /should-be-logged-in
// Requires token verification
router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);

// Define route to check if the user should be an admin
// Handles GET requests to /should-be-admin
router.get("/should-be-admin", shouldBeAdmin);

// Export the router to be used in other parts of the application
export default router;
