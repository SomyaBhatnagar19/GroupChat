/* /client/Components/js/Chat.js */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import { AiOutlinePaperClip } from "react-icons/ai";
import "../css/chat.css";
import { socket } from "../js/socket";

const Chat = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);


  
  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  
  const mediaTypes = {
    image: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/svg+xml",
    ],
    video: ["video/mp4", "video/webm", "video/ogg"],
    audio: ["audio/mpeg", "audio/ogg", "audio/wav"],
  };

  const getChat = async () => {
    try {
      // Fetch messages from local storage
      const storedMessages =
        JSON.parse(localStorage.getItem("chatMessages")) || [];
      setMessages(storedMessages);

      // Fetch new messages from the backend
      socket.emit("getMessage");

      socket.on("messages", async (chats) => {
        try {

  
          const limitedMessages = chats.slice(-10);

          // Update state with the recent chats
          setMessages(limitedMessages);

          // console.log(limitedMessages);
          // Save updated messages in local storage
          localStorage.setItem("chatMessages", JSON.stringify(limitedMessages));
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log("Error while fetching the chat:", err);
    }
  };

  //Making it realtime
  useEffect(() => {
    getChat();
    // const interval = setInterval(() => {
    //   fetchMessages();
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);

  async function messageSend(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const group = JSON.parse(localStorage.getItem("group"));
      // console.log("Group:", group);
      const groupId = group.id;
      console.log(groupId);
      const res = await axios.post(
        `http://localhost:4000/chat/sendMessage`,
        {
          message: messageText,
        },
        { headers: { Authorization: token } }
      );

      console.log("Message has been sent successfully!", res.data);

        // Update local storage with the new message
        const updatedMessages = [{ message: messageText }, ...messages];
        if (updatedMessages.length > 10) {
          updatedMessages.splice(0, updatedMessages.length - 10);
        }
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

        // Update state with the recent chats
        setMessages(updatedMessages);

       

        getChat();

       setMessageText("");
      
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }
   

  const sendFile = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      console.log("selected file is : ", selectedFile);

      if (selectedFile) {
        const formData = new FormData(); // Create a new FormData object
        formData.append("file", selectedFile, selectedFile.name); // Append the file with its name

        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        };

        const sendFile = await axios.post(
          "http://localhost:4000/chat/sendFile",
          formData, // Pass the formData object as the request body
          { headers }
        );

        console.log("File has been sent successfully!", sendFile.data);

        setSelectedFile(null);
        getChat();
      }
    } catch (err) {
      console.log("Error while sending the file:", err);
    }
  };

  const handleSend = (e) => {
    if (selectedFile) {
      sendFile(e);
    } else {
      messageSend(e)
    }
  };



  return (
    < >
      <div className="chat-header">Welcome to Wave. Create your own group & make a wave.</div>
      
      <hr style={{ marginBottom: "1rem", marginTop: "0" }} />
      <div style={{ maxHeight: "80vh", overflowY: "auto",scrollbarWidth:"none"}}>
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
            
             { message.type==="text" && 
             <div>
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
              </small></div>}
              
              {message.type && mediaTypes.image.includes(message.type) && (
                    <Stack gap={2}>
                    <img
                      src={message.message}
                      alt="Image"
                      className="message-image"
                      style={{
                        maxWidth: "50%",
                        maxHeight: "50%",
                        objectFit: "contain",
                      }}
                    /> 
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
                    </Stack>
                    
                  )}

                  {message.type && mediaTypes.video.includes(message.type) && (
                    <Stack gap={2}>
                    <video
                      controls
                      className="message-video"
                      style={{ maxWidth: "50%" }}
                    >
                      <source src={message.message} type={message.type} />
                      Your browser does not support the video tag.
                    </video>
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
                  </Stack>
                  )}

                  {message.type && mediaTypes.audio.includes(message.type) && (
                    <Stack gap={2}>
                    <audio controls className="message-audio">
                      <source src={message.message} type={message.type} />
                      Your browser does not support the audio tag.
                    </audio>
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
                  </Stack>
                  )}

            </div>
          ))}
      </div>
      <Form className="message-form">
        <Button onClick={handleToggleMenu}> 
        < AiOutlinePaperClip/>
        </Button>
        {isOpen && (
                <Form.Control
                  id="custom-file"
                  type="file"
                  label="Choose file"
                  style={{ display: "block" }}
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  accept="image/*,audio/*,video/*,.pdf"
                />
              )}
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <Button variant="primary" type="submit" 
        onClick={(e)=>handleSend(e)}
        onKeyDown={(e)=>{
          if(e.key==="Enter") {
            handleSend(e);
          }
        }}>
          <FaPaperPlane />
        </Button>
      </Form>
      </div>
    </>
  );
};

export default Chat;