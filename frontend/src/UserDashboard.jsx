import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./navbar";
import Footer from "./footer";
import AddCategory from "./AddCategory";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleAddCategory = () => {
    navigate("/category");
  };

  const handleAddExpense = () => {
    navigate("/expense");
  };

  return (
    <>
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Dashboard Content */}
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h2 className="mb-4">User Dashboard</h2>
                <Row>
                  <Col>
                    <Button
                      variant="primary"
                      className="w-100 mb-3"
                      onClick={handleAddCategory}
                    >
                      Add Category
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      className="w-100 mb-3"
                      onClick={handleAddExpense}
                    >
                      Add Expense
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserDashboard;
