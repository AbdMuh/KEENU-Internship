import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grid, Card, TextField, Button, Alert, MenuItem } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import apiService from "services/apiService";

function AddCard() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    holderName: "",
    cardNumber: "",
    expirationDate: "",
    setAsDefault: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setFormData((prev) => ({
      ...prev,
      holderName: user?.name || "",
    }));
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "setAsDefault" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.holderName.trim()) errors.holderName = "Card holder name is required.";
    if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required.";
    else if (!/^\d{15,19}$/.test(formData.cardNumber))
      errors.cardNumber = "Card number must be 15–19 digits and contain only numbers.";

    if (!formData.expirationDate.trim()) errors.expirationDate = "Expiration date is required.";

    return errors;
  };

  const addForm = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const payload = {
      id: 0,
      userId: userId,
      holderName: formData.holderName,
      cardNumber: formData.cardNumber,
      expirationDate: formData.expirationDate,
      setAsDefault: formData.setAsDefault,
    };

    console.log("Card payload to send:", payload);

    try {
      const res = await apiService.addCard(payload);
      if (res.success) {
        setSuccess(res.data);
        setFormData({
          holderName: formData.holderName,
          cardNumber: "",
          expirationDate: "",
          setAsDefault: 0,
        });
        navigate("/billing");
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while adding the card.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    await addForm();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {error && (
          <MDBox mb={2}>
            <Alert severity="error">{error}</Alert>
          </MDBox>
        )}
        {success && (
          <MDBox mb={2}>
            <Alert severity="success">{success}</Alert>
          </MDBox>
        )}

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Add New Card
                </MDTypography>
              </MDBox>

              <MDBox pt={3} pb={2} px={2}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Card Holder Name"
                        name="holderName"
                        value={formData.holderName}
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        fullWidth
                        error={!!validationErrors.cardNumber}
                        helperText={validationErrors.cardNumber}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Expiration Date"
                        name="expirationDate"
                        type="date"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!validationErrors.expirationDate}
                        helperText={validationErrors.expirationDate}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Set as Default"
                        name="setAsDefault"
                        value={formData.setAsDefault}
                        onChange={handleChange}
                        fullWidth
                      >
                        <MenuItem value={0}>No</MenuItem>
                        <MenuItem value={1}>Yes</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <MDBox mt={2} display="flex" gap={2}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          startIcon={<Icon>add</Icon>}
                        >
                          Add Card
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate("/billing")}
                          startIcon={<Icon>arrow_back</Icon>}
                        >
                          Back to Billing
                        </Button>
                      </MDBox>
                    </Grid>
                  </Grid>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AddCard;
