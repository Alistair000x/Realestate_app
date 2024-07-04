import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

// Create an instance of the Express Router
const router = express.Router();

// Define route for user registration
// Handles POST requests to /register
router.post("/register", register);

// Define route for user login
// Handles POST requests to /login
router.post("/login", login);

// Define route for user logout
// Handles POST requests to /logout
router.post("/logout", logout);

// Export the router to be used in other parts of the application
export default router;
