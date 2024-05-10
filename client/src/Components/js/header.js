/* /client/Component/js/Header.js */

import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import wave from "../assets/wave.png";
import '../css/header.css';

const Header = () => {
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userResData");
    navigate("/"); // Redirect to the login screen
  };

  return (
    <Navbar expand="lg" className="header-nav" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Navbar.Brand>
        <img
          src={wave}
          alt="wave-logo"
          style={{ width: "40px", height: "40px", marginLeft: "1rem" }}
        />
        Wave Chat
      </Navbar.Brand>
      <Nav className="ml-auto">
  <Nav.Link onClick={handleLogout} className="text-right" style={{marginRight: '0.5rem', backgroundColor: '#e11d48', padding: '0.5rem', borderRadius: '2rem', color: 'white'}}>Logout</Nav.Link>
</Nav>

    </Navbar>
  );
};

export default Header;

