import jwt from "jsonwebtoken";

// Middleware to check if the user is logged in
export const shouldBeLoggedIn = async (req, res) => {
  // Log the userId from the request for debugging purposes
  console.log(req.userId);

  // Respond with a success message indicating the user is authenticated
  res.status(200).json({ message: "You are Authenticated" });
};

// Middleware to check if the user is an admin
export const shouldBeAdmin = async (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.token;

  // Check if the token exists
  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  // VERIFY THE TOKEN AND CHECK IF THE USER IS AN ADMIN
  // Verify the token using the JWT secret key
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" }); // If token verification fails, respond with error
    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not authorized!" }); // If the user is not an admin, respond with error
    }
  });

  // Respond with a success message indicating the user is authenticated
  res.status(200).json({ message: "You are Authenticated" });
};
