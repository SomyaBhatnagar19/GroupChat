import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import axios from 'axios';
import "../css/chat.css";

const Chat = () => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);

  async function messageSend() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/chat/sendMessage",
        {
          message: messageText,
        },
        { headers: { Authorization: token } }
      );
      setMessageText(''); // Reset the message text after sending
      // Update messages state with the new message (if needed)
    } catch (error) {
      console.log("something went wrong");
    }
  }

  return (
    <>
      <div className="chat-header">Group Chat</div>
      <hr style={{ marginBottom: "1rem", marginTop: "0" }} />
      <div className="flex-grow-1 overflow-auto messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.userId === 1 ? "sent" : "received"}`}
          >
            <p>{message.text}</p>
            <small className="timestamp">{message.timestamp}</small>
          </div>
        ))}
      </div>
      <Form className="message-form">
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <Button variant="primary" type="submit" onClick={messageSend}>
          <FaPaperPlane />
        </Button>
      </Form>
    </>
  );
};

export default Chat;
