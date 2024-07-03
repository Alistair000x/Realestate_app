import prisma from "../lib/prisma.js";

// Function to get all chats for a user
export const getChats = async (req, res) => {
  const tokenUserId = req.userId; // Getting the user ID from the request

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId], // Finding chats where the user is a participant
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId); // Finding the ID of the other participant

      if (receiverId) {
        const receiver = await prisma.user.findUnique({
          where: {
            id: receiverId,
          },
          select: {
            id: true,
            username: true,
            avatar: true, // Selecting receiver's id, username, and avatar
          },
        });
        chat.receiver = receiver; // Adding receiver's info to the chat
      }
    }

    res.status(200).json(chats); // Sending the chats as response
  } catch (err) {
    console.log(err); // Logging the error
    res.status(500).json({ message: "Failed to get chats!" }); // Sending failure response
  }
};

// Function to get a specific chat
export const getChat = async (req, res) => {
  const tokenUserId = req.userId; // Getting the user ID from the request

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id, // Finding chat by ID
        userIDs: {
          hasSome: [tokenUserId], // Ensuring the user is a participant
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc", // Including messages ordered by creation time
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" }); // Sending error if chat doesn't exist
    }

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId], // Marking chat as seen by the user
        },
      },
    });

    res.status(200).json(chat); // Sending the chat as response
  } catch (err) {
    console.log(err); // Logging the error
    res.status 500).json({ message: "Failed to get chat!" }); // Sending failure response
  }
};

// Function to add a new chat
export const addChat = async (req, res) => {
  const tokenUserId = req.userId; // Getting the user ID from the request
  const { receiverId } = req.body; // Destructuring request body to get receiver ID

  if (!receiverId) {
    return res.status(400).json({ message: "receiverId is required" }); // Sending error if receiver ID is missing
  }

  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId], // Creating a chat with both user IDs
      },
    });
    res.status(200).json(newChat); // Sending the new chat as response
  } catch (err) {
    console.log(err); // Logging the error
    res.status(500).json({ message: "Failed to add chat!" }); // Sending failure response
  }
};

// Function to mark a chat as read
export const readChat = async (req, res) => {
  const tokenUserId = req.userId; // Getting the user ID from the request

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id, // Finding chat by ID
        userIDs: {
          hasSome: [tokenUserId], // Ensuring the user is a participant
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId], // Marking chat as read by the user
        },
      },
    });
    res.status(200).json(chat); // Sending the updated chat as response
  } catch (err) {
    console.log(err); // Logging the error
    res.status(500).json({ message: "Failed to read chat!" }); // Sending failure response
  }
};
