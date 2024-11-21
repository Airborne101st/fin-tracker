import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from "react-bootstrap";
import NavigationBar from "./navbar";
import Footer from "./footer";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVICE, // Backend API base URL
});

const AddExpense = () => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category_id: "",
    user_id: localStorage.getItem("user_id"),
  });
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setMessage({ type: "danger", text: "User not authenticated" });
      return;
    }

    try {
      const response = await apiClient.get(`/expenses/category/${userId}`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage({ type: "danger", text: "Could not load categories" });
    }
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setMessage({ type: "danger", text: "User not authenticated" });
      return;
    }

    try {
      const response = await apiClient.get(`/expenses/expense/${userId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setMessage({ type: "danger", text: "Could not load expenses" });
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  // Handle form field changes
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
      const response = await apiClient.post("/expenses/add-expense", formData);
      setExpenses((prev) => [...prev, response.data]); // Optimistically update the expense list
      setMessage({ type: "success", text: "Expense added successfully!" });
      setFormData({
        description: "",
        amount: "",
        date: "",
        category_id: "",
        user_id: localStorage.getItem("user_id"),
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      setMessage({ type: "danger", text: "Could not add expense" });
    }
  };

  return (
    <>
      <NavigationBar />
      <Container className="mt-5">
        {message && <Alert variant={message.type}>{message.text}</Alert>}

        <Row>
          {/* Expense List */}
          <Col md="12" className="mb-4">
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "5px",
              }}
            >
              {expenses.map((expense) => (
                <Card key={expense.id} className="mb-3 p-2" style={{ width: "100%" }}>
                <Card.Body>
                  <Card.Text>
                  <b>{expense.category.unit}{expense.amount}</b>
                    &nbsp;&nbsp;
                    {expense.description}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <small>{format(new Date(expense.create_date), "MMMM dd, yyyy HH:mm")}</small>
                    &nbsp;
                    <Badge pill bg="primary">{expense.category.name}</Badge>
                  </Card.Text>
                </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          {/* Add Expense Form */}
          <Col md="12">
            <Card className="p-3">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="3">
                      <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Control
                          type="text"
                          name="description"
                          placeholder="Enter description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md="3">
                      <Form.Group controlId="formAmount" className="mb-3">
                        <Form.Control
                          type="number"
                          name="amount"
                          placeholder="Enter amount"
                          value={formData.amount}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md="3">
                      <Form.Group controlId="formDate" className="mb-3">
                        <Form.Control
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md="3">
                      <Form.Group controlId="formCategory" className="mb-3">
                        <Form.Control
                          as="select"
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md="12">
                      <Button variant="primary" type="submit" className="w-100">
                        Add Expense
                      </Button>
                    </Col>
                  </Row>
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

export default AddExpense;
