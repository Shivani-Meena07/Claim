const { generateChatbotResponse } = require("../services/geminiService");

const chatWithBot = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // Generate AI response
    const response = await generateChatbotResponse(
      message,
      conversationHistory || []
    );

    res.status(200).json({
      response,
    });
  } catch (error) {
    console.error("Chatbot controller error:", error);

    res.status(500).json({
      message: "Failed to generate chatbot response",
    });
  }
};

module.exports = {
  chatWithBot,
};