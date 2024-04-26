/* /client/Components/js/Chat.js */

import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import "../css/chat.css";

const Chat = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/chat/getMessages", {
            headers: { Authorization: token },
        });
        if (Array.isArray(res.data.messages)) {
            const userIds = res.data.messages.map(message => message.userId);
            
            //functionality to fetch username from user id from user table through chat table
            const userDetailsPromises = userIds.map(async userId => {
                const userDetailsRes = await axios.get(`http://localhost:4000/${userId}`);
                return userDetailsRes.data.user.name;
            });
            const userNames = await Promise.all(userDetailsPromises);

            const updatedMessages = res.data.messages.map((message, index) => ({
                ...message,
                userName: userNames[index],
            }));
            setMessages(updatedMessages);
        } else {
            console.log("Invalid messages format:", res.data);
        }
    } catch (error) {
        console.log("Error fetching messages:", error);
    }
};

  //Making it realtime
  useEffect(() => {
    fetchMessages();
    // const interval = setInterval(() => {
    //   fetchMessages();
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Read messages from local storage on component mount
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(storedMessages);
  }, []);

  useEffect(() => {
    // Save messages to local storage whenever messages state changes
    let storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    storedMessages.push(...messages);
    if (storedMessages.length >= 10) {
      storedMessages = storedMessages.slice(-10); // Keeping only the most recent 10 messages
    }
    localStorage.setItem("chatMessages", JSON.stringify(storedMessages));
  }, [messages]);

  async function messageSend(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/chat/sendMessage",
        {
          message: messageText,
        },
        { headers: { Authorization: token } }
      );
      setMessageText("");
      // You may want to update messages state here if needed
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }

  return (
    <>
      <div className="chat-header">Group Chat</div>
      <hr style={{ marginBottom: "1rem", marginTop: "0" }} />
      <div className="flex-grow-1 overflow-auto messages">
        {messages &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.userId === 1 ? "sent" : "received"
              }`}
            >
              <p className="username">{message.userName}</p>
              <p>{message.message}</p>
              <small className="timestamp">
                {new Date(message.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
                {", "}
                {new Date(message.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </small>
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
