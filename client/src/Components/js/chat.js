import React from "react";
import { Form, Button } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import "../css/chat.css";

const Chat = () => {
    const messages = [
        { id: 1, userId: 1, text: "Hello!", timestamp: "10:00 AM" },
        { id: 2, userId: 2, text: "Hi there!", timestamp: "10:05 AM" },
        { id: 3, userId: 1, text: "How are you?", timestamp: "10:10 AM" },
      ];
  return (
    <>
      <div className="chat-header">Group Chat</div>
      <hr style={{ marginBottom: "1rem", marginTop: "0" }} />
      <div className="flex-grow-1 overflow-auto messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.userId === 1 ? "sent" : "received"}`}
          >
            <p>{message.text}</p>
            <small className="timestamp">{message.timestamp}</small>
          </div>
        ))}
      </div>
      <Form className="message-form">
        <Form.Control type="text" placeholder="Type your message..." />
        <Button variant="primary" type="submit">
          <FaPaperPlane />
        </Button>
      </Form>
    </>
  );
};

export default Chat;
