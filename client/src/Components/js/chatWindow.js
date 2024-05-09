/* /client/Components/js/ChatWindow.js */

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Stack } from "react-bootstrap";
import Header from "./header";
import "../css/chatWindow.css";
import Chat from "./chat";
import Group from "./group";
import { fetchAllUsers } from "../store/userStore";
import { getAllGroups, toggleGroup } from "../store/groupStore";
import { useSelector, useDispatch } from "react-redux";
import GroupChat from "./groupChat";

const ChatWindow = () => {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.userCreation.allUsers);
  const allGroups = useSelector((state) => state.groupStoreCreation.allGroups);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllGroups());
  }, []);

  const handleShowGroupModal = () => {
    setShowGroupModal(true);
  };

  const handleCloseGroupModal = () => {
    setShowGroupModal(false);
  };

  const handleGroupFormSubmit = (groupData) => {
    console.log(groupData);
    setShowGroupModal(false);
  };

  const handleGroupClick = (groupId) => {
    setSelectedGroupId(groupId);
  };

  return (
    <>
      <Header />
      <Container fluid className="chat-window-container">
        <Row className="h-100" >
          <Col xs={3} className="bg-custom-blue d-flex flex-column">
            <Stack direction="vertical" gap={1}>
              <Button onClick={handleShowGroupModal}>Create Group</Button>
              <hr />
              <Group
                show={showGroupModal}
                onHide={handleCloseGroupModal}
                onSubmit={handleGroupFormSubmit}
              />
              <h5 className="heading-sub">Your Groups</h5>
              {allGroups.map((group) => (
                <div
                  key={group.id}
                  className="group"
                  onClick={() => {
                    dispatch(toggleGroup(group));
                    handleGroupClick(group.id);
                  }}
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
              <h5 className="heading-sub mt-3">User List</h5>
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className="group"
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    padding: "0.5rem",
                    border: "solid #5b21b6 1px",
                    position: "relative",
                  }}
                >
                  {user.name}
                </div>
              ))}
            </Stack>
          </Col>
          <Col xs={9} className="bg-custom-purple d-flex flex-column">
            {selectedGroupId ? <GroupChat groupId={selectedGroupId} /> : <Chat />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatWindow;