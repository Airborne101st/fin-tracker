import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import NavigationBar from "./navbar";
import Footer from "./footer";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVICE, // Assuming your backend API base URL
});

const AddCategory = () => {
    const userId = localStorage.getItem("user_id");
  const [formData, setFormData] = useState({
    name: "",
    monthly_target: "",
    unit: "",
    user_id: userId
  });
  const [categories, setCategories] = useState([]); // State to hold categories
  const [message, setMessage] = useState(""); // State to display success/error messages

  // Fetch existing categories on component mount
  const fetchCategories = async () => {
    const userId = localStorage.getItem("user_id"); // Get user_id from localStorage

    if (!userId) {
      setMessage({ type: "danger", text: "User not authenticated" });
      return;
    }

    try {
      const response = await apiClient.get(`/expenses/category/${userId}`); // Fetch categories for the logged-in user
      setCategories(response.data); // Update categories state
    } catch (error) {
      console.error("Error fetching categories", error);
      setMessage({ type: "danger", text: "Could not load categories" });
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when component mounts
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      user_id: localStorage.getItem("user_id")
    });
  };

  // Handle adding a new category
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("user_id"); // Get user_id from localStorage
    if (!userId) {
      setMessage({ type: "danger", text: "User not authenticated" });
      return;
    }

    try {
      // Add new category via API
      const response = await apiClient.post('/expenses/category', formData);
      // Update the categories list with the newly added category
      setCategories([...categories, response.data]);
      // Clear the form fields
      setFormData({
        name: "",
        monthly_target: "",
        unit: "",
        user_id: userId
      });
      setMessage({ type: "success", text: "Category added successfully!" });
    } catch (error) {
      console.error("Error adding category", error);
      setMessage({ type: "danger", text: "Could not add category" });
    }
  };

  return (
    <>
    <NavigationBar/>
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="8">
          {/* List of Existing Categories */}
          <Card className="mt-4">
            <Card.Header>
              <h5>Existing Categories</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>{category.name}</li> // Display category names
                ))}
              </ul>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <h3 className="text-center">Add Category</h3>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant={message.type}>{message.text}</Alert>}
              <Form onSubmit={handleSubmit}>
                {/* Category Name Field */}
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

                {/* Monthly Target Field */}
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

                {/* Unit Field */}
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
    <Footer/>
    </>
  );
};

export default AddCategory;
