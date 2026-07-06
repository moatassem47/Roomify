import { useState, useEffect, useRef } from "react";
import { Bot, Send, X, MessageSquare } from "lucide-react";
import "../../styles/ChatWidget.css";
import api from "../../utils/axios";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [threadId, setThreadId] = useState(null);

  const messagesEndRef = useRef(null);




  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
  setIsOpen(prev => {
    const next = !prev;

    if (next && messages.length === 0) {
      setMessages([
        {
          text: "Hello! I'm your shopping assistant. How can I help you?",
          isAgent: true,
        },
      ]);
    }

    return next;
  });
};

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const messageText = inputValue.trim();
    if (!messageText) return;

   
    const userMessage = {
      text: messageText,
      isAgent: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const endpoint = threadId
      ? `/chatBot/${threadId}`
      : "/chatBot";

    try {
     
      const response = await api.post(endpoint, {
        message: messageText,
      });

      const data = response.data;

      
      const agentMessage = {
        text: data?.response || "No response",
        isAgent: true,
      };

      setMessages((prev) => [...prev, agentMessage]);

     
      if (data?.threadId) {
        setThreadId(data.threadId);
      }
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          text: "Something went wrong. Try again.",
          isAgent: true,
        },
      ]);
    }
  };

  return (
    <div className={`chat-widget-container ${isOpen ? "open" : ""}`}>
      {isOpen ? (
        <div className="chat-box">
          <div className="chat-header">
            <div className="chat-title">
              <Bot />
              <h3 className="text-white">Shop Assistant</h3>
            </div>

            <button className="close-button" onClick={toggleChat}>
              <X />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className="message-wrapper">
                <div
                  className={`message ${
                    message.isAgent
                      ? "message-bot"
                      : "message-user"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="chat-input-container"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              className="message-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
            />

            <button
              type="submit"
              className="send-button"
              disabled={!inputValue.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        <button className="chat-button" onClick={toggleChat}>
          <MessageSquare />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;