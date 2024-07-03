import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Get all posts based on query parameters
export const getPosts = async (req, res) =>
{
  // Extract query parameters from the request
  const query = req.query;

  try
  {
    // FETCH POSTS BASED ON QUERY PARAMETERS
    // Use Prisma to find posts matching the query parameters
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined, // Filter by city if provided
        type: query.type || undefined, // Filter by type if provided
        property: query.property || undefined, // Filter by property type if provided
        bedroom: parseInt(query.bedroom) || undefined, // Filter by number of bedrooms if provided
        price: {
          gte: parseInt(query.minPrice) || undefined, // Filter posts with a price greater than or equal to minPrice
          lte: parseInt(query.maxPrice) || undefined, // Filter posts with a price less than or equal to maxPrice
        },
      },
    });

    // Send the posts back to the client
    res.status(200).json(posts);
  } catch (err)
  {
    // Log the error and respond with a failure message
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get a single post by its ID
export const getPost = async (req, res) =>
{
  // Extract the post ID from the request parameters
  const id = req.params.id;
  try
  {
    // FETCH A SINGLE POST WITH DETAILS AND USER INFORMATION
    // Find the post by ID and include related post details and user info
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true, // Include the related post details
        user: {
          select: {
            username: true, // Select the username of the user who created the post
            avatar: true, // Select the avatar of the user who created the post
          },
        },
      },
    });

    // Extract the token from cookies if it exists
    const token = req.cookies?.token;

    if (token)
    {
      // VERIFY THE TOKEN AND CHECK IF THE POST IS SAVED BY THE USER
      // Verify the token and check if the post is saved by the user
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) =>
      {
        if (!err)
        {
          // Check if the post is saved by the user
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id, // Get the user ID from the token payload
              },
            },
          });
          // Respond with the post data and a flag indicating if the post is saved
          res.status(200).json({ ...post, isSaved: saved ? true : false });
        }
      });
    }
    // Respond with the post data and a flag indicating that the post is not saved
    res.status(200).json({ ...post, isSaved: false });
  } catch (err)
  {
    // Log the error and respond with a failure message
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Add a post to the saved posts list
export const addPost = async (req, res) =>
{
  // Extract the post data from the request body and user ID from the token
  const body = req.body;
  const tokenUserId = req.userId;

  try
  {
    // CHECK IF THE SAVED POST ALREADY EXISTS
    // Check if the post is already saved by the user
    const existingSavedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId, // User ID from the token
          postId: body.postData.id, // Extract post ID from request body
        },
      },
    });

    if (existingSavedPost)
    {
      // If the post is already saved, return an error response
      return res.status(400).json({ message: "SavedPost already exists" });
    }

    // CREATE A NEW SAVED POST
    // Create a new saved post record for the user
    const newSavedPost = await prisma.savedPost.create({
      data: {
        userId: tokenUserId, // User ID from the token
        postId: body.postData.id, // Extract post ID from request body
      },
    });

    // Respond with the newly created saved post record
    res.status(200).json(newSavedPost);
  } catch (err)
  {
    // Log the error and respond with a failure message
    console.log(err);
    res.status(500).json({ message: "Failed to create SavedPost" });
  }
};

// Update a post (functionality not implemented)
export const updatePost = async (req, res) =>
{
  try
  {
    // Respond with a success status (no update functionality implemented)
    res.status(200).json();
  } catch (err)
  {
    // Log the error and respond with a failure message
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

// Delete a post by its ID
export const deletePost = async (req, res) =>
{
  // Extract the post ID from the request parameters and user ID from the token
  const id = req.params.id;
  const tokenUserId = req.userId;

  try
  {
    // FETCH THE POST BY ITS ID
    // Find the post to check if the current user is the owner
    const post = await prisma.post.findUnique({
      where: { id },
    });

    // CHECK IF THE USER IS AUTHORIZED TO DELETE THE POST
    // Ensure that the current user is the owner of the post
    if (post.userId !== tokenUserId)
    {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // DELETE THE POST
    // Delete the post from the database
    await prisma.post.delete({
      where: { id },
    });

    // Respond with a success message
    res.status(200).json({ message: "Post deleted" });
  } catch (err)
  {
    // Log the error and respond with a failure message
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
