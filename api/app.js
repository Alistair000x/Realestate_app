import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

// Create an instance of the Express application
const app = express();

// Use CORS middleware to allow requests from the client URL
// Credentials: true allows cookies to be sent
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Define route handlers
// Authentication routes
app.use("/api/auth", authRoute);

// User routes
app.use("/api/users", userRoute);

// Post routes
app.use("/api/posts", postRoute);

// Test routes
app.use("/api/test", testRoute);

// Chat routes
app.use("/api/chats", chatRoute);

// Message routes
app.use("/api/messages", messageRoute);

// Start the server and listen on port 8800
app.listen(8800, () => {
  console.log("Server is running!");
});
