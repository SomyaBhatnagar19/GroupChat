/* /client/Components/js/ChatWindow.js */

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Stack } from "react-bootstrap";
import Header from "./header";
import "../css/chatWindow.css";
import Chat from "./chat";
import Group from "./group";
import { fetchAllUsers } from "../store/userStore";
import { useSelector, useDispatch } from "react-redux";

const ChatWindow = () => {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);

  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.userCreation.allUsers);

  useEffect(() => {
    // const fetchGroups = async () => {
    //   try {
    //     const response = await fetch("http://localhost:4000/group/getAllGroups");
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch groups");
    //     }
    //     const data = await response.json();
    //     setGroups(data.groups);
    //   } catch (error) {
    //     console.error("Error fetching groups:", error.message);
    //   }
    // };
    // fetchGroups();

    dispatch(fetchAllUsers());
  }, []);

  const handleShowGroupModal = () => {
    setShowGroupModal(true);
  };

  const handleCloseGroupModal = () => {
    setShowGroupModal(false);
  };

  const handleGroupFormSubmit = (groupData) => {
    // Handle group form submission (e.g., send data to server)
    console.log(groupData);
    setShowGroupModal(false);
  };

  return (
    <>
      <Header />
      <Container fluid className="chat-window-container">
        <Row className="h-100">
          <Col xs={3} className="bg-custom-blue d-flex flex-column">
            {/* <Stack direction="vertical" gap={1}>
              <Button onClick={handleShowGroupModal}>Create Group</Button>
              <hr />
             
              <Group show={showGroupModal} onHide={handleCloseGroupModal} onSubmit={handleGroupFormSubmit} />
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="group"
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    padding: "0.5rem",
                    border: "solid #5b21b6 1px",
                    position: "relative",
                  }}
                >
                  {group.groupName}
                </div>
              ))}
            </Stack> */}

            <Stack direction="vertical" gap={1}>
           
              <Button onClick={handleShowGroupModal}>Create Group</Button>
              <hr />
             
              <Group show={showGroupModal} onHide={handleCloseGroupModal} onSubmit={handleGroupFormSubmit} />
              {allUsers.map((users) => (
                <div
                  key={users.id}
                  className="group"
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    padding: "0.5rem",
                    border: "solid #5b21b6 1px",
                    position: "relative",
                  }}
                >
                  {users.name}
                </div>
              ))}
            </Stack>
          </Col>
          <Col xs={9} className="bg-custom-purple d-flex flex-column">
            <Chat />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatWindow;
