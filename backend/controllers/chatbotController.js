const { generateChatbotResponse } = require("../services/geminiService");
const Chat = require("../models/Chat");
const User = require("../models/User");

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // Get logged-in user
    const user = await User.findById(req.user.id).select("name");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get user's existing chat
    let chat = await Chat.findOne({
      user: req.user.id,
    });

    // Generate AI response
    const response = await generateChatbotResponse(
      message,
      chat ? chat.messages : []
    );

    // Create chat if it doesn't exist
    if (!chat) {
      chat = new Chat({
        user: req.user.id,
        messages: [],
      });
    }

    // Save user message
    chat.messages.push({
      role: "user",
      text: message.trim(),
    });

    // Save AI response
    chat.messages.push({
      role: "ai",
      text: response,
    });

    await chat.save();

    res.status(200).json({
      response,
      user: {
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Chatbot controller error:", error);

    res.status(500).json({
      message: "Failed to generate chatbot response",
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      messages: chat ? chat.messages : [],
    });
  } catch (error) {
    console.error("Get chatbot history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chatbot history",
    });
  }
};

module.exports = {
  chatWithBot,
  getChatHistory,
};