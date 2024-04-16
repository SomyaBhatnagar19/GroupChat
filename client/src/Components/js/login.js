/* /client/src/Components/js/login.js */

import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import "../css/login.css";

function Login() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const toggleSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const toggleLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <div className="entry">
      {showLogin && (
        <div className="login-card">
           <h2 className="mb-5">Heya! Catch up the latest gossips here.</h2>
          <div className="login-container">
            <Card>
              <Card.Body>
                <h3>Login</h3>
                <Form.Text>Enter your credential to Sign in.</Form.Text>
                <Form.Group className="mt-3 mb-3" controlId="formBasicEmail">
                  <Form.Control type="email" placeholder="Email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <div className="mt-3 text-center">
                  <a href="/forgot-password">Forgot Password</a>
                </div>
                <div className="mt-3 text-center">
                  <Button className="btn" type="submit">
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
                <h3>Sign Up</h3>
                <Form.Text>Enter your details to create a new user.</Form.Text>
                <Form.Group
                  className="mb-3 mt-3"
                  controlId="formBasicSignupName"
                >
                  <Form.Control type="text" placeholder="Username" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSignupEmail">
                  <Form.Control type="text" placeholder="Phone No." />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSignupEmail">
                  <Form.Control type="email" placeholder="Email" />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicSignupPassword"
                >
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <div className="mt-3 text-center">
                  <Button className="btn" type="submit">
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
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
