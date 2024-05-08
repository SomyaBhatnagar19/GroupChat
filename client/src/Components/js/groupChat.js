/* /client/Components/js/groupChat.js */

import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Form, Button, Dropdown, Stack, ListGroup } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendGroupChatMessages, makeMemberAdmin, removeUserFromGroup, addUserToGroup } from "../store/groupStore";
import { FaEllipsisV } from "react-icons/fa";
import AddMembersToGroup from "./addMembersToGroup";
import AddAdminToGroup from "./addAdminToGroup";

const GroupChat = ({ groupId }) => {
  const[showModalMember, setShowModalMember] = useState(false);
  const[showModalAdmin, setShowModalAdmin] = useState(false);
  const[showModalRemove, setShowModalRemove] = useState(false);
    const [newMessage, setNewMessage] = useState(""); // Define newMessage state
    const [selectedUser, setSelectedUser] = useState(null);
    const [addMemberBtnClicked, setAddMemberBtnClicked] = useState(false);

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("userResData"));
    const userId = user.id;
    
    const groupData = JSON.parse(localStorage.getItem('group'));
    const groupName = groupData && groupData.groupName ? groupData.groupName : '';
    
    
    
    
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
 
  //   const handleAction = (action) => {
  //     // Handle the selected action here
  //     console.log("Action selected:", action);
  // };

  // const handleAddUser = () => {
  //   if (selectedUser) {
  //     dispatch(addUserToGroup(groupId, selectedUser));
  //   }
  // };

  // const handleMakeAdmin = () => {
  //   if (selectedUser) {
  //     dispatch(makeMemberAdmin(groupId, selectedUser));
  //   }
  // };

  // const handleRemoveUser = () => {
  //   if (selectedUser) {
  //     dispatch(removeUserFromGroup(groupId, selectedUser));
  //   }
  // };
  // const showModalHandler = () => {
  //   setShowModal(!showModal);
  // }


  const addMemberHandler = () => {
    setShowModalMember(!showModalMember);
};

const addAdminHandler = () => {
    setShowModalAdmin(!showModalAdmin);
};


  const removeMemberHandler = () => {
    setShowModalRemove(!showModalRemove);
      }

    return (
      <>
        
        <div className="d-flex justify-content-between align-items-center">
                <div className="chat-header">{groupName}</div>
                {/* Right-aligned dropdown for actions */}
              <Stack direction="horizontal" gap={2}>
              {showModalMember && <AddMembersToGroup/> }
              {showModalAdmin && <AddAdminToGroup/> }
              <ListGroup>
            <ListGroup.Item action onClick={addMemberHandler}>
                Add User ➕  
            </ListGroup.Item>
            <ListGroup.Item action onClick={addAdminHandler}>
               Make Admin 👑 
            </ListGroup.Item>
            <ListGroup.Item action onClick={removeMemberHandler}>
                Remove User ➖
            </ListGroup.Item>
        </ListGroup>
              </Stack>
            </div>
        <hr style={{ marginBottom: "1rem", marginTop: "0" }} />
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
  