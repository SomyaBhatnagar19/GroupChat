/* /client/Components/js/ChatWindow.js */

import React from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Stack,
} from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import chatAppBg from "../assets/chatAppBg.png";
import Header from "./header";
import "../css/chatWindow.css";
import Chat from "./chat";

const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Charlie", active: true },
];

const ChatWindow = () => {
  return (
    <>
      <Header />
      <Container fluid className="chat-window-container">
        <Row className="h-100">
          <Col xs={3} className="bg-custom-blue d-flex flex-column">
            <Stack direction="vertical" gap={1}>
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user ${user.active ? "active" : ""}`}
                  style={{
                    backgroundColor: user.active ? "#c4b5fd" : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    padding: "0.5rem",
                    border: "solid #5b21b6 1px",
                    position: "relative",
                  }}
                >
                  {user.name}
                  {user.active && <span className="green-dot"></span>}
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
