import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import axios from "axios";

// Axios client with base URL set from environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVICE, // Ensure this is set in your .env file
  headers: {
    "Content-Type": "application/json", // Ensure data is sent as JSON
  },
});

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    hashed_password: "",
  });
  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending POST request with JSON body
      const response = await apiClient.post("/auth/register", formData);
      console.log(response);
      setMessage({ type: "success", text: "Registration successful!" });
    } catch (error) {
      console.error("ERROR", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setMessage({ type: "danger", text: error.response.data.detail });
      } else {
        setMessage({ type: "danger", text: "An error occurred" });
      }
    }
  };

  return (
    <Container className="mt-5" style={{maxWidth: "40%"}}>
      <Row className="justify-content-md-center">
        <Col md="12">
          <Card>
            <Card.Header>
              <h3 className="text-center">Register</h3>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant={message.type}>{message.text}</Alert>}
              <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formFullname" className="mb-3">
                  <Form.Control
                    type="text"
                    name="full_name"
                    placeholder="Enter Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Control
                    type="password"
                    name="hashed_password"
                    placeholder="Password"
                    value={formData.hashed_password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
