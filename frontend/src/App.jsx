import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Profile from "./Profile";
import "./App.css";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Index from "./Index";
import UserDashboard from "./UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AddCategory from "./AddCategory";
import AddExpense from "./AddExpense";

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" 
          element={
            <ProtectedRoute>
          <UserDashboard />
          </ProtectedRoute>} />

          <Route path="/category" 
          element={
            <ProtectedRoute>
          <AddCategory/>
          </ProtectedRoute>} />

          <Route path="/expense"
          element={
            <ProtectedRoute>
            <AddExpense/>
            </ProtectedRoute>
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
