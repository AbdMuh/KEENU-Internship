/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import apiService from "services/apiService";
import { useAlert } from "context/AlertContext";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalTransactions: 0,
    totalIncoming: 0,
    totalOutgoing: 0,
    totalCards: 0,
  });

  const getUserDashboardData = async () => {
    try {
      const response = await apiService.getUserDashboardData();
      if (response.success) {
        setDashboardData(response.data); //UserDashboard Data
      } else {
        showAlert(response.error || "Failed to fetch dashboard data", "error");
      }
    } catch (error) {
      showAlert("Error Connecting to the API", "error");
    }
  };

  useEffect(() => {
    getUserDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <div onClick={() => navigate("/billing")} style={{ cursor: "pointer" }}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="account_balance"
                  title="Total Transactions"
                  count={dashboardData.totalTransactions}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "updated",
                  }}
                />
              </div>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <div onClick={() => navigate("/billing")} style={{ cursor: "pointer" }}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Total Incoming"
                  count={`$${dashboardData.totalIncoming.toFixed(2)}`}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "updated",
                  }}
                />
              </div>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <div onClick={() => navigate("/billing")} style={{ cursor: "pointer" }}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Total Outgoing"
                  count={`$${dashboardData.totalOutgoing.toFixed(2)}`}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "updated",
                  }}
                />
              </div>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="credit_card"
                title="Total Cards"
                count={dashboardData.totalCards}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
