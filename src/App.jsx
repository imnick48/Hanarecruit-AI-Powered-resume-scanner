import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Global styles
import "./styles/globals";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply/:linkId" element={<Apply />} />
      </Routes>
    </Router>
  );
}
