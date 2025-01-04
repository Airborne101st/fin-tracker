import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  BarElement,
  Title,
  LinearScale,
} from "chart.js";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./navbar";
import Footer from "./footer";
import AddCategory from "./AddCategory";
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement,
  Title
);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVICE, // Assuming your backend API base URL
});

const Dropdown = ({ selectedOption, handleSelectChange }) => {
  return (
    <Form.Group>
      <Form.Label>Filter</Form.Label>
      <Form.Select value={selectedOption} onChange={handleSelectChange}>
        <option value="all">All</option>
        <option value="last_week">Last Week</option>
        <option value="last_month">Last Month</option>
        <option value="last_6_months">Last 6 Months</option>
        <option value="last_year">Last Year</option>
      </Form.Select>
    </Form.Group>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("all");

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      try {
        const response = await apiClient.get(
          `/expenses/expense-summary/user/${userId}/filter/${selectedOption}`
        );

        console.log(response.data);

        const categories = response.data.map((item) => item.category);
        const totals = response.data.map((item) => item.total);

        const options = {
          plugins: {
            title: {
              display: true,
              text: "Doughnut Chart",
              color: "blue",
              font: {
                size: 34,
              },
              padding: {
                top: 30,
                bottom: 30,
              },
              responsive: true,
              animation: {
                animateScale: true,
              },
            },
          },
        };

        setData({
          labels: categories,
          datasets: [
            {
              label: "Expenses by Category",
              data: totals,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#8E44AD",
                "#E67E22",
                "#2ECC71",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#8E44AD",
                "#E67E22",
                "#2ECC71",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching expense summary", error);
      }
    };

    fetchData();
  }, [selectedOption]);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Dashboard Content */}
      <Container className="mt-5" fluid>
        <Row>
          <Col md={4}>
            <div className="chart-container">
              <Doughnut data={data} />
            </div>

            <div>
              <Dropdown
                selectedOption={selectedOption}
                handleSelectChange={handleSelectChange}
              />
            </div>
          </Col>
          <Col md={8}>
            <Bar data={data} />
          </Col>
        </Row>
        <Row></Row>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserDashboard;
