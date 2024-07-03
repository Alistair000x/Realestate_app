import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  // Extract username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // HASH THE PASSWORD
    // Create a hashed version of the user's password with a salt factor of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword); // Log the hashed password for debugging

    // CREATE A NEW USER AND SAVE TO DB
    // Create a new user record in the database with the provided username, email, and hashed password
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser); // Log the newly created user for debugging

    // Respond to the client with a success message
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err); // Log any errors for debugging
    res.status(500).json({ message: "Failed to create user!" }); // Respond with an error message
  }
};

export const login = async (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    // Find a user in the database by their username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" }); // Respond with an error if the user does not exist

    // CHECK IF THE PASSWORD IS CORRECT
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" }); // Respond with an error if the password is incorrect

    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    // Define the expiration age of the token (7 days)
    const age = 1000 * 60 * 60 * 24 * 7;

    // Create a JWT token with the user's id and a flag indicating they are not an admin
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age } // Set the token to expire in 7 days
    );

    // Exclude the password from the user object to be sent in the response
    const { password: userPassword, ...userInfo } = user;

    // Set the JWT token as a cookie and respond with user information
    res
      .cookie("token", token, {
        httpOnly: true, // Make the cookie inaccessible to JavaScript
        // secure:true, // Uncomment this line to enable secure cookies (recommended for production)
        maxAge: age, // Set the maximum age of the cookie
      })
      .status(200)
      .json(userInfo); // Respond with the user information
  } catch (err) {
    console.log(err); // Log any errors for debugging
    res.status(500).json({ message: "Failed to login!" }); // Respond with an error message
  }
};

export const logout = (req, res) => {
  // Clear the JWT token cookie and respond with a success message
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
