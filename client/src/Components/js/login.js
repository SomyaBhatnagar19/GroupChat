/* /client/src/Components/js/login.js */

import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import "../css/login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const toggleSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const toggleLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.status === 404) {
      alert('User doesnt exists.');
    } else if (response.status === 401){
      alert('Invalid password.');
    } else if (response.ok) {
      alert('Login Successful!!');
      console.log(data);
      localStorage.setItem('token', data.token);
      setEmail("");
      setPassword("");
      
      navigate('/ChatWindow');
    } else {
      console.error("Login failed:", data.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};

const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, number, email, password }), // Include the 'username' field
    });
    const data = await response.json();
    if (response.status === 409) {
      alert(data.message); // User already exists
    } else if (response.ok) {
      alert("User created, signup Successfull!!");
      console.log(data);
      setNumber("");
      setName("");
      setEmail("");
      setPassword("");
    } else {
      console.error("Signup failed:", data.message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
  }
};


  return (
    <div className="entry">
      {showLogin && (
        <div className="login-card">
           <h2 className="mb-5">Heya! Catch up the latest gossips here.</h2>
          <div className="login-container">
            <Card>
              <Card.Body>
              <Form onSubmit={handleLogin}>
                <h3>Login</h3>
                <Form.Text>Enter your credential to Sign in.</Form.Text>
                <Form.Group className="mt-3 mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <div className="mt-3 text-center">
                  <a href="/forgot-password">Forgot Password</a>
                </div>
                <div className="mt-3 text-center">
                  <Button className="btn" type="submit" onClick={handleLogin}>
                    Login
                  </Button>
                </div>

                <hr />

                <div className="mt-3 text-center">
                  <p>
                    Don't have an account?{" "}
                    <a
                      className="signUp-link"
                      variant="link"
                      onClick={toggleSignup}
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
      {showSignup && (
        <div className="signUp-card">
          <h2 className="mb-5">Unleash Your Voice, Unite in Conversation.</h2>
          <div className="signUp-container">
            <Card>
              <Card.Body>
              <Form onSubmit={handleSignup}>
                <h3>Sign Up</h3>
                <Form.Text>Enter your details to create a new user.</Form.Text>
                <Form.Group
                  className="mb-3 mt-3"
                  controlId="formBasicSignupName"
                >
                  <Form.Control type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Username" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSignupEmail">
                  <Form.Control type="text" 
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Phone No." />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSignupEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicSignupPassword"
                >
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <div className="mt-3 text-center">
                  <Button className="btn" type="submit" onClick={handleSignup}>
                    Sign Up
                  </Button>
                </div>
                <hr />
                <div className="mt-3 text-center">
                  <p>
                    Login?{" "}
                    <a href="/" onClick={toggleLogin}>
                      Back to Login
                    </a>
                  </p>
                </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

