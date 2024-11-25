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
import { useNavigate, Link } from "react-router-dom";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVICE,
  headers: {
    "Content-Type": "application/json", // Ensure sending JSON
  },
});

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    hashed_password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user_id", response.data.user_id);
      setMessage({ type: "success", text: "Login successful" });
      navigate("/dashboard");
    } catch (error) {
      console.error("ERROR", error); // Logs the entire error object for debugging
      let errorMsg = "An error occurred. Please try again.";
  
      // Check if there's a specific message in the response
      if (error.response && error.response.data) {
        if (typeof error.response.data.detail === "string") {
          errorMsg = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          // For lists, map to string or show the first message
          errorMsg = error.response.data.detail.map((err) => err.msg).join(", ");
        }
      }
  
      setMessage({ type: "danger", text: errorMsg });
    }
  };
  

  return (
    <Container className="mt-5" style={{maxWidth: "40%"}}>
      <Row className="justify-content-md-center">
        <Col md="12">
          <Card>
            <Card.Header>
              <h3 className="text-center">Login</h3>
            </Card.Header>
            <Card.Body>
              {/* Show alert if there's a message */}
              {message && <Alert variant={message.type}>{message.text}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Username input */}
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

                {/* Password input */}
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

                {/* Submit button */}
                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>

              {/* Link to registration page if user does not have an account */}
              <div className="mt-3">
                <p>
                  <small>
                    Don't have an account?
                    <Link to={`/register`}> Register</Link>
                  </small>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
