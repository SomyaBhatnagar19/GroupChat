/* /client/Components/js/groupChat.js */

import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup, ListGroupItem, Stack } from "react-bootstrap";
import { FaPaperPlane,FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendGroupChatMessages } from "../store/groupStore";
import AddAdminToGroup from "./addAdminToGroup";
import AddMembersToGroup from "./addMembersToGroup";
import RemoveUserFromGroup from "./removeMember";
import axios from "axios";
import { socket } from "./socket";
import { AiOutlinePaperClip } from "react-icons/ai";

const GroupChat = () => {
  const[showMember, setShowMember] = useState(false);
  const[showAdmin, setShowAdmin] = useState(false);
  const[showRemove, setShowRemove] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const[isOpen,setIsOpen] = useState(false);
  const [messages,setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // Define newMessage state
  const [selectedFile, setSelectedFile] = useState(null);

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("userResData"));
    const userId = user.id;
    
    const groupData = JSON.parse(localStorage.getItem('group'));

    const groupName = groupData && groupData.groupName ? groupData.groupName : '';

    const groupId = groupData && groupData.id ? groupData.id : null;


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
    
  
  
    useEffect(() => {
      const getAdminInfo = async () => {
        try {
          const res = await axios.get(
            `http://localhost:4000/connection/getAdminDetails?userId=${userId}&groupId=${groupId}`
          );
  
          const data = res.data.adminData[0];
  
          console.log(data);
  
          setIsAdmin(data.isAdmin);
  
          console.log("isAdmin : ", isAdmin);
        } catch (err) {
          console.log("Err occured while fetching the admin info : ", err);
        }
      };
      getAdminInfo();
    }, []);


    const getChat = () => {
      try {
        const groupId = JSON.parse(localStorage.getItem("group")).id;
  
        const groupName = JSON.parse(localStorage.getItem("group")).groupName;
  
        console.log("group id is : ", groupId);
  
        socket.emit("getGroupMessage", { groupId, groupName });
  
        socket.on("groupmessages", (chats) => {
          try {
            const limitedMessages = chats.slice(-10);
  
            // Update state with the recent chats
            setMessages(limitedMessages);
  
            // Save updated messages in local storage
            localStorage.setItem(
              "groupChatMessages",
              JSON.stringify(limitedMessages)
            );
          } catch (err) {
            console.log(err);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
  
    useEffect(() => {
      getChat();
      // const interval = setInterval(() => {
      //     getChat();
      // }, 1000);
  
      // return () => clearInterval(interval);
    }, []);
  

    const sendMessage = async (e) => {
     e.preventDefault();
      try {
        const user = JSON.parse(localStorage.getItem("userResData"));
        const name = user.name;

        const token = localStorage.getItem("token");
  
        if (newMessage.trim() !== "") {
          const headers = {
            "Content-Type": "application/json",
            Authorization: token,
          };
  

          console.log("data to be sent is : ", {
            message: newMessage,
            groupId: groupId,
            isShared: false,
            userId: user.id,
            name: name,
          });

          const sentMessage = await axios.post(
            "http://localhost:4000/chat/sendGroupMessages",
            {
              message: newMessage,
              groupId: groupId,
              isShared: false,
              userId: user.id,
              name: name,
            },
            { headers }
          );
  
          console.log(
            "Message has been sent successfully!",
            sentMessage.data.groupChat
          );
  
          const newMsg = sentMessage.data.groupMessages;
  
          // Update state with the recent chats
          setMessages((prevMessages) => {
            const updatedMessages = [newMsg, ...prevMessages];
            if (updatedMessages.length > 10) {
              updatedMessages.splice(10);
            }
            return updatedMessages;
          });
  
          console.log("set messages  : ", messages.slice(-10));
  
          setNewMessage("");
  
          getChat();
        }
      } catch (err) {
        console.log("Error while sending the message:", err);
      }
    };


    const sendFile = async (e) => {
      e.preventDefault();
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
  
        console.log("selected file is : ", selectedFile);
  
        if (selectedFile) {
          const formData = new FormData(); // Create a new FormData object
          formData.append("file", selectedFile, selectedFile.name); // Append the file with its name
          formData.append("groupId", groupId); // Append the file with its name
  
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
        setSelectedFile(null);
      } else {
        sendMessage(e);
      }
    };
  
    const handleToggleMenu = () => {
      setIsOpen(!isOpen);
    };
  

 const addMemberHandler = () => {
    if(isAdmin){
      setShowMember((prev)=>!prev);
    }else {
      alert("You are not the admin  of this group.");
    }
   
};

const addAdminHandler = () => {
   if(isAdmin){
    setShowAdmin((prev)=>!prev);
   }else {
    alert("You are not the admin  of this group.");
   }
   
};


  const removeMemberHandler = () => {
    if(isAdmin){
      setShowRemove((prev)=>!prev);
    }else{
      alert("You are not the admin  of this group.");
    }
 }

 const menuToggleHandler = ()=> {
  setIsOpen((prev)=>!prev);
 }


    return (
      <>
        
        <div className="d-flex justify-content-between align-items-center">
                <div className="chat-header">{groupName.toUpperCase()}</div>
                {/* Right-aligned dropdown for actions */}
              <Stack direction="horizontal" gap={2}>
              {showMember && <AddMembersToGroup/> }
              {showAdmin && <AddAdminToGroup/> }
              {showRemove && <RemoveUserFromGroup/>}
              {isOpen &&<ListGroup>
            <ListGroupItem  onClick={()=>addMemberHandler()}>
                Add User ➕  
            </ListGroupItem>
            <ListGroupItem  onClick={addAdminHandler}>
               Make Admin 👑 
            </ListGroupItem>
            <ListGroupItem  onClick={removeMemberHandler}>
                Remove User ➖
            </ListGroupItem>
        </ListGroup>}
        <FaBars onClick={menuToggleHandler}/>
              </Stack>
            </div>
        <hr style={{ marginBottom: "1rem", marginTop: "0" }} />
        <div style={{maxHeight:"85vh",overflowY:"auto",scrollbarWidth:"none"}}>
        <div className="flex-grow-1 overflow-auto messages">
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.userId === userId ? "sent" : "received" 
                }`}
              >
                <p className="username">{message.userName}</p>
                {message.type==="text" && <Stack direction="vertical" gap={2}>
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
                </Stack>}
              
                {message.type && mediaTypes.image.includes(message.type) && <Stack direction="vertical" gap={2}>           
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
                  </Stack>}
                  { message.type && mediaTypes.video.includes(message.type) && <Stack direction="vertical" gap={2}>
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
                    </Stack>}
                    {  message.type && mediaTypes.audio.includes(message.type) && 
                      <Stack direction="vertical" gap={2}>
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
                    }
              </div>
            ))}
        </div>
        <Form className="message-form" 
        onSubmit={(e)=>handleSend(e)}
        onKeyDown={(e)=>{
          if(e.key==="Enter"){
            handleSend(e);
          }
        }
        }
        >
          <Button onClick={handleToggleMenu}>
            <AiOutlinePaperClip/>
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="primary" type="submit">
            <FaPaperPlane />
          </Button>
        
        </Form>
        </div>
      </>
    );
  };
  
  export default GroupChat;
  