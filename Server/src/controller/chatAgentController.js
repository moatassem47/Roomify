const { callAgent } = require("../agents/agent");

const StartChatSession = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const threadID = Date.now().toString();

    const response = await callAgent(message, threadID);

    res.json({
      response,
      threadID,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const ContinueConversation = async (req, res) => {
  try {
    const { message } = req.body;
    const { threadID } = req.params;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const response = await callAgent(message, threadID);

    res.json({
      response,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  StartChatSession,
  ContinueConversation,
};