import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// Fetches a list of all users from the database
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();  // Query the database to get all users
    res.status(200).json(users);  // Respond with the list of users
  } catch (err) {
    console.log(err);  // Log any errors that occur during the query
    res.status(500).json({ message: "Failed to get users!" });  // Respond with a 500 status code if there is an error
  }
};

// Fetches a single user by their ID
export const getUser = async (req, res) => {
  const id = req.params.id;  // Extract the user ID from the request parameters
  try {
    const user = await prisma.user.findUnique({
      where: { id },  // Find the user with the specified ID
    });
    res.status(200).json(user);  // Respond with the user data
  } catch (err) {
    console.log(err);  // Log any errors that occur during the query
    res.status(500).json({ message: "Failed to get user!" });  // Respond with a 500 status code if there is an error
  }
};

// Updates a user's details, including their password and avatar
export const updateUser = async (req, res) => {
  const id = req.params.id;  // Extract the user ID from the request parameters
  const tokenUserId = req.userId;  // Get the user ID from the token
  const { password, avatar, ...inputs } = req.body;  // Extract password, avatar, and other input data from the request body

  if (id !== tokenUserId) {
    // Check if the ID in the request matches the ID from the token
    return res.status(403).json({ message: "Not Authorized!" });  // Respond with a 403 status code if the user is not authorized
  }

  let updatedPassword = null;  // Initialize a variable for the hashed password
  try {
    if (password) {
      // If a new password is provided, hash it
      updatedPassword = await bcrypt.hash(password, 10);  // Hash the password with a salt factor of 10
    }

    const updatedUser = await prisma.user.update({
      where: { id },  // Specify the user to update
      data: {
        ...inputs,  // Apply the other input changes
        ...(updatedPassword && { password: updatedPassword }),  // Update the password if a new one is provided
        ...(avatar && { avatar }),  // Update the avatar if a new one is provided
      },
    });

    // Exclude the password field from the response
    const { password: userPassword, ...rest } = updatedUser;
    res.status(200).json(rest);  // Respond with the updated user data
  } catch (err) {
    console.log(err);  // Log any errors that occur during the update
    res.status(500).json({ message: "Failed to update users!" });  // Respond with a 500 status code if there is an error
  }
};

// Deletes a user if the user is authorized
export const deleteUser = async (req, res) => {
  const id = req.params.id;  // Extract the user ID from the request parameters
  const tokenUserId = req.userId;  // Get the user ID from the token

  if (id !== tokenUserId) {
    // Check if the ID in the request matches the ID from the token
    return res.status(403).json({ message: "Not Authorized!" });  // Respond with a 403 status code if the user is not authorized
  }

  try {
    await prisma.user.delete({
      where: { id },  // Specify the user to delete
    });
    res.status(200).json({ message: "User deleted" });  // Respond with a success message confirming the user was deleted
  } catch (err) {
    console.log(err);  // Log any errors that occur during the deletion
    res.status(500).json({ message: "Failed to delete users!" });  // Respond with a 500 status code if there is an error
  }
};

// Toggles a post between saved and unsaved for the authenticated user
export const savePost = async (req, res) => {
  const postId = req.body.postId;  // Extract the post ID from the request body
  const tokenUserId = req.userId;  // Get the user ID from the token

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      // If the post is already saved, remove it from the saved list
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });  // Respond with a success message confirming the post was removed
    } else {
      // If the post is not saved, add it to the saved list
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });  // Respond with a success message confirming the post was saved
    }
  } catch (err) {
    console.log(err);  // Log any errors that occur during the save/delete process
    res.status(500).json({ message: "Failed to delete users!" });  // Respond with a 500 status code if there is an error
  }
};

// Fetches both the posts created by the user and the posts saved by the user
export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;  // Get the user ID from the token
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },  // Find posts created by the user
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },  // Find saved posts by the user
      include: {
        post: true,  // Include the post details in the saved posts
      },
    });

    const savedPosts = saved.map((item) => item.post);  // Extract the post data from the saved posts
    res.status(200).json({ userPosts, savedPosts });  // Respond with both user-created and saved posts
  } catch (err) {
    console.log(err);  // Log any errors that occur during the query
    res.status(500).json({ message: "Failed to get profile posts!" });  // Respond with a 500 status code if there is an error
  }
};

// Counts the number of unread notifications for the user
export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;  // Get the user ID from the token
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],  // Find chats where the user is a participant
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],  // Exclude chats that have been seen by the user
          },
        },
      },
    });
    res.status(200).json(number);  // Respond with the number of unread notifications
  } catch (err) {
    console.log(err);  // Log any errors that occur during the count
    res.status(500).json({ message: "Failed to get profile posts!" });  // Respond with a 500 status code if there is an error
  }
};
