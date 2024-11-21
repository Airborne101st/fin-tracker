// Footer.js
import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <Container>
        <p>&copy; {new Date().getFullYear()} Fintracker. All Rights Reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
