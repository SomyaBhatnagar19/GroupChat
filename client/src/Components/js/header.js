/* /client/Component/js/Header.js */

import React from "react";
import { Navbar } from "react-bootstrap";
import wave from "../assets/wave.png";
import '../css/header.css';

const Header = () => {
  return (
    <Navbar expand="lg" className="header-nav">
      <Navbar.Brand>
        <img
          src={wave}
          alt="wave-logo"
          style={{ width: "40px", height: "40px", marginLeft: "1rem" }}
        />
        Wave Chat
      </Navbar.Brand>
    </Navbar>
  );
};

export default Header;
