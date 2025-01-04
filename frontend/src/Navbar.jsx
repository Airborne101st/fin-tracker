// Navbar.js
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; 

const NavigationBar = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/login"; 
  };


  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Fintracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/category">Categories</Nav.Link>
            <Nav.Link as={Link} to="/expense">Expenses</Nav.Link>
            <Nav.Item>
            <Button
              variant="link"
              onClick={handleLogout}
              style={{
                color: "white",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaSignOutAlt /> {/* Logout icon */}
            </Button>
          </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
