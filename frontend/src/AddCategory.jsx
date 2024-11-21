import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import NavigationBar from "./navbar";
import Footer from "./footer";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVICE, // Backend API base URL
});

const AddCategory = () => {
  const userId = localStorage.getItem("user_id");
  const [formData, setFormData] = useState({
    name: "",
    monthly_target: "",
    unit: "",
    user_id: userId,
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch existing categories
  const fetchCategories = async () => {
    if (!userId) {
      setMessage({ type: "danger", text: "User not authenticated" });
      return;
    }

    try {
      const response = await apiClient.get(`/expenses/category/${userId}`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      setMessage({ type: "danger", text: "Could not load categories" });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      user_id: userId,
    });
  };

  // Handle adding a new category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage({ type: "danger", text: "User not authenticated" });
      return;
    }

    try {
      const response = await apiClient.post("/expenses/category", formData);
      setCategories([...categories, response.data]); // Add the new category
      setFormData({
        name: "",
        monthly_target: "",
        unit: "",
        user_id: userId,
      });
      setMessage({ type: "success", text: "Category added successfully!" });
    } catch (error) {
      console.error("Error adding category", error);
      setMessage({ type: "danger", text: "Could not add category" });
    }
  };

  return (
    <>
      <NavigationBar />
      <Container className="mt-5">
        <Row>
          {/* Scrollable Categories List */}
          <Col md={6}>
            <h3 className="text-center">Categories</h3>
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "5px",
              }}
            >
              {categories.map((category) => (
                <Card key={category.id} className="mb-2">
                  <Card.Body><b>{category.name}</b></Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          {/* Fixed Form for Adding Categories */}
          <Col md={6}>
            <Card className="sticky-top">
              <Card.Header>
                <h3 className="text-center">Add Category</h3>
              </Card.Header>
              <Card.Body>
                {message && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter category name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formMonthlyTarget" className="mb-3">
                    <Form.Control
                      type="number"
                      name="monthly_target"
                      placeholder="Enter Monthly Target"
                      value={formData.monthly_target}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formUnit" className="mb-3">
                    <Form.Control
                      type="text"
                      name="unit"
                      placeholder="Enter Unit"
                      value={formData.unit}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Add Category
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default AddCategory;
