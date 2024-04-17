/* /client/App.js */

import React from "react";
import Login from "./Components/js/login";
import ChatWindow from "./Components/js/chatWindow";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/ChatWindow" element={<ChatWindow />}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
