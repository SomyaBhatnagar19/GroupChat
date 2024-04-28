/* /client/Components/js/groupChat.js */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendGroupChatMessages } from "../store/groupStore";

const GroupChat = ({ groupId }) => {
    const [newMessage, setNewMessage] = useState(""); // Define newMessage state
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("userResData"));
    const userId = user.id;
  
    // Use selector to get messages from Redux store
    const messages = useSelector((state) => state.groupStoreCreation.messages);
  
    // Function to send message
    const sendMessage = async (e) => {
      e.preventDefault(); // Prevent form submission
      try {
        if (!newMessage.trim()) {
          return;
        }
        await dispatch(sendGroupChatMessages(groupId, newMessage));
        setNewMessage(""); // Clear input field after sending message
      } catch (error) {
        console.log("Error sending message:", error);
      }
    };
  
    useEffect(() => {
      // Dispatch fetchMessages action when groupId or userId changes
      console.log("Fetching messages for group:", groupId, "and user:", userId);
      dispatch(fetchMessages(groupId));
    }, [dispatch, groupId, userId]);
  
    console.log("Messages:", messages); // Log messages to console for debugging
  
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
                  message.userId === userId ? "sent" : "received" // Check if message is sent by current user
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
        <Form className="message-form" onSubmit={sendMessage}>
          <Form.Control
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="primary" type="submit">
            <FaPaperPlane />
          </Button>
        </Form>
      </>
    );
  };
  
  export default GroupChat;
  