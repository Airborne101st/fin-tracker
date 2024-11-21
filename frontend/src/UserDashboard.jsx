import React, {useState, useEffect} from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios"
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./navbar";
import Footer from "./footer";
import AddCategory from "./AddCategory";
Chart.register(ArcElement, Tooltip, Legend);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVICE, // Assuming your backend API base URL
});

const UserDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token")

      try {
        const response = await apiClient.get(`/expenses/expense-summary/user/${userId}`);

        console.log(response.data);
        

        const categories = response.data.map((item) => item.category);
        const totals = response.data.map((item) => item.total);

        const options = {
                          plugins: {
                              title: {
                                  display: true,
                                  text: 'Doughnut Chart',
                                  color:'blue',
                                  font: {
                                      size:34
                                  },
                                  padding:{
                                      top:30,
                                      bottom:30
                                  },
                                  responsive:true,
                                  animation:{
                                      animateScale: true,
                                                }
                              }
                          }
      
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
  }, []);


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
        <Doughnut data={data}/>
        </div>
        </Col>
        <Col md={8}>
        </Col>
        </Row>
        <Row>
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserDashboard;
