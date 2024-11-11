import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from "react-bootstrap";
import NavigationBar from "./navbar";
import Footer from "./footer";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVICE, // Assuming your backend API base URL
});

const AddExpense = () => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category_id: "",
    user_id: localStorage.getItem("user_id")
  });

  const [expenses, setExpenses] = useState([]); // State to hold fetched expenses
  const [categories, setCategories] = useState([]); // State to hold categories
  const [message, setMessage] = useState(""); // State for displaying messages

  // Fetch categories for the dropdown
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
      console.error("Error fetching categories", error);
      setMessage({ type: "danger", text: "Could not load categories" });
    }
  };

  // Fetch expenses on component mount
  const fetchExpenses = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setMessage({ type: "danger", text: "User not authenticated" });
      return;
    }

    try {
      const response = await apiClient.get(`/expenses/expense/${userId}`);
      setExpenses(response.data); // Update expenses state with the fetched data
    } catch (error) {
      console.error("Error fetching expenses", error);
      setMessage({ type: "danger", text: "Could not load expenses" });
    }
  };

  // Fetch categories and expenses when component mounts
  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      user_id: localStorage.getItem("user_id")
    });
  };

  // Handle form submission to add new expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setMessage({ type: "danger", text: "User not authenticated" });
      return;
    }

    try {
      // Submit the form data to add a new expense
      const response = await apiClient.post('/expenses/add-expense', formData);
      // Update the expenses list with the new expense
      setExpenses([...expenses, response.data]);
      // Clear form after successful submission
      setFormData({
        description: "",
        amount: "",
        date: "",
        category_id: "",
        user_id: localStorage.getItem("user_id")
      });
      setMessage({ type: "success", text: "Expense added successfully!" });
    } catch (error) {
      console.error("Error adding expense", error);
      setMessage({ type: "danger", text: "Could not add expense" });
    }
  };

  return (
    <>
    <NavigationBar/>
    <Container className="mt-5">
      {/* Display message (Success/Error) */}
      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Row>
        {/* Vertical List of Expense Cards */}
        <Col md="12" className="mb-4">
          {/* <h3>Existing Expenses</h3> */}
          <div style={{
              maxHeight: "100%",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "1rem",
              paddingBottom: "80px",
              borderRadius: "5px",
            }}>
            {expenses.map((expense) => (
              <Card key={expense.id} className="mb-3 p-2" style={{ width: "100%" }}>
                <Card.Body>
                  {/* <Card.Title>{expense.description}</Card.Title> */}
                  <Card.Text>
                  <b>${expense.amount}</b>
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

        {/* Horizontal Form to Add New Expense */}
        <Col md="12">
          {/* <h3>Add New Expense</h3> */}
          <Card className="p-1">
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
    <Footer/>
    </>
  );
};

export default AddExpense;
