import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  // Extract the current user's ID from the request object
  const tokenUserId = req.userId;
  // Extract the chat ID from the request parameters
  const chatId = req.params.chatId;
  // Extract the message text from the request body
  const text = req.body.text;

  try {
    // CHECK IF THE CHAT EXISTS AND IF THE USER IS A PARTICIPANT
    // Find the chat by its ID and verify that the current user is part of the chat
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId], // Ensure the user is part of the chat
        },
      },
    });

     // If the chat is not found or the user is not a participant, return a 404 error
    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // CREATE A NEW MESSAGE
    // Add a new message to the specified chat with the text provided
    const message = await prisma.message.create({
      data: {
        text, // The text of the new message
        chatId, // The ID of the chat the message belongs to
        userId: tokenUserId, // The ID of the user sending the message
      },
    });

    // UPDATE THE CHAT WITH THE NEW MESSAGE
    // Update the chat's `seenBy` field to include the current user and set the last message text
    await prisma.chat.update({
      where: {
        id: chatId, // The ID of the chat to update
      },
      data: {
        seenBy: [tokenUserId], // Mark the chat as seen by the current user
        lastMessage: text, // Set the text of the last message in the chat
      },
    });

     // RESPOND WITH THE NEWLY CREATED MESSAGE
    // Send the newly created message back to the client
    res.status(200).json(message);
  } catch (err) {
    // LOG ANY ERRORS AND RESPOND WITH A FAILURE MESSAGE
    console.log(err); // Log the error for debugging
    res.status(500).json({ message: "Failed to add message!" }); // Respond with an error message
  }
};
