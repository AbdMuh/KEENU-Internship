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

// React hooks
import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";

// API Service
import apiService from "services/apiService";

function Billing() {
  const [displayCard, setDisplayCard] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [apiError, setApiError] = useState({
    displayCardError: null,
    paymentMethodError: null,
    addNewCardError: null,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Helper function to format card number for display
  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return "****\u00A0\u00A0****\u00A0\u00A0****\u00A0\u00A0****";
    const lastFour = cardNumber.slice(-4);
    return `****\u00A0\u00A0****\u00A0\u00A0****\u00A0\u00A0${lastFour}`;
  };

  // Helper function to format expiration date
  const formatExpirationDate = (expirationDate) => {
    if (!expirationDate) return "MM/YY";
    try {
      const date = new Date(expirationDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "MM/YY";
    }
  };

  // Fetch default card
  async function fetchDefaultCard() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setApiError((prev) => ({
          ...prev,
          displayCardError: "User not found in localStorage",
        }));
        return;
      }
      const user = JSON.parse(userStr);
      const response = await apiService.getDefaultCard(user.id);
      console.log("Default card userId:", user.id);

      if (response.success) {
        setDisplayCard(response.data);
        // Clear error on successful fetch
        setApiError((prev) => ({
          ...prev,
          displayCardError: null,
        }));
      } else {
        setApiError((prev) => ({
          ...prev,
          displayCardError: response.error || "Failed to fetch default card.",
        }));
      }
    } catch (error) {
      setApiError((prev) => ({
        ...prev,
        displayCardError: "Error fetching default card: " + error.message,
      }));
    }
  }

  async function handleAddCard() {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      setApiError((prev) => ({
        ...prev,
        addNewCardError: "User not found in localStorage",
      }));
    } else {
      navigate("/addCard");
    }
  }

  // Fetch all payment methods
  async function fetchPaymentMethods() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setApiError((prev) => ({
          ...prev,
          paymentMethodError: "User not found in localStorage",
        }));
        return;
      }

      const user = JSON.parse(userStr);
      const response = await apiService.getCards(user.id);

      if (response.success) {
        setPaymentMethods(response.data || []);
        setDisplayCard(fetchDefaultCard()); // Ensure displayCard is set
        // Clear error on successful fetch
        setApiError((prev) => ({
          ...prev,
          paymentMethodError: null,
        }));
      } else {
        setApiError((prev) => ({
          ...prev,
          paymentMethodError: response.error || "Failed to fetch payment methods.",
        }));
      }
    } catch (error) {
      setApiError((prev) => ({
        ...prev,
        paymentMethodError: "Error fetching payment methods: " + error.message,
      }));
    }
  }

  // Clear specific errors
  const clearError = (errorType) => {
    setApiError((prev) => ({
      ...prev,
      [errorType]: null,
    }));
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDefaultCard(), fetchPaymentMethods()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Find default card from payment methods if displayCard is not set
  const defaultCard = displayCard || paymentMethods.find((card) => card.setAsDefault === 1);

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        {/* Error Display Section */}
        {(apiError.displayCardError || apiError.paymentMethodError) && (
          <MDBox mb={3}>
            <Grid container spacing={2}>
              {apiError.displayCardError && (
                <Grid item xs={12}>
                  <MDBox
                    bgColor="error"
                    color="white"
                    p={2}
                    borderRadius="lg"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <MDTypography variant="body2" color="white" fontWeight="medium">
                      <strong>Default Card Error:</strong> {apiError.displayCardError}
                    </MDTypography>
                    <MDBox
                      component="button"
                      onClick={() => clearError("displayCardError")}
                      sx={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: 0,
                      }}
                    >
                      ×
                    </MDBox>
                  </MDBox>
                </Grid>
              )}
              {apiError.paymentMethodError && (
                <Grid item xs={12}>
                  <MDBox
                    bgColor="error"
                    color="white"
                    p={2}
                    borderRadius="lg"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <MDTypography variant="body2" color="white" fontWeight="medium">
                      <strong>Payment Methods Error:</strong> {apiError.paymentMethodError}
                    </MDTypography>
                    <MDBox
                      component="button"
                      onClick={() => clearError("paymentMethodError")}
                      sx={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: 0,
                      }}
                    >
                      ×
                    </MDBox>
                  </MDBox>
                </Grid>
              )}
            </Grid>
          </MDBox>
        )}

        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  {loading ? (
                    <MDBox
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="200px"
                      sx={{
                        backgroundColor: "grey.100",
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: "grey.300",
                      }}
                    >
                      <MDBox textAlign="center">
                        <MDTypography variant="body2" color="text">
                          Loading default card...
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  ) : defaultCard ? (
                    <MasterCard
                      number={Number(defaultCard.cardNumber) || Number("4562112245947852")}
                      holder={defaultCard.holderName || "Card Holder"}
                      expires={formatExpirationDate(defaultCard.expirationDate)}
                    />
                  ) : (
                    <MasterCard
                      number="4562112245947852"
                      holder="No Default Card"
                      expires="MM/YY"
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="account_balance"
                    title="salary"
                    description="Belong Interactive"
                    value="+$2000"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="paypal"
                    title="paypal"
                    description="Freelance Payment"
                    value="$455.00"
                  />
                </Grid>
                <Grid item xs={12}>
                  <PaymentMethod
                    paymentMethods={paymentMethods}
                    loading={loading}
                    error={apiError.paymentMethodError}
                    onRefresh={fetchPaymentMethods}
                    handleAddCard={handleAddCard}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Invoices />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
