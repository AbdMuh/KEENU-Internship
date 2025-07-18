import { useLocation, useParams, useNavigate, useInRouterContext } from "react-router-dom";
import { useState } from "react";
import { Grid, Card, TextField, Button, Alert } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import apiService from "services/apiService";
import Icon from "@mui/material/Icon";
import { string } from "prop-types";

function UpdateUser() {
  const { id } = useParams();
  const { state } = useLocation(); // contains user data
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: state?.user?.name || "",
    email: state?.user?.email || "",
    username: state?.user?.username || "",
    password: state?.user?.password || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address.";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    const userUpdatePayload = {
      id: parseInt(id),
      name: formData.name,
      email: formData.email,
      loginUser: {
        id: parseInt(state.user.loginId) || 0,
        username: formData.username,
        password: formData.password,
        role: state.user.loginUser?.role || "user",
        userId: parseInt(id),
      },
    };
    console.log("User update payload:", userUpdatePayload);

    const res = await apiService.updateUser(id, userUpdatePayload);
    if (res.success) {
      setSuccess("User updated successfully!");
      setTimeout(() => navigate("/tables"), 1500);
    } else {
      setError(res.error || "Failed to update user.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Error/Success alerts at the top level */}
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
              {/* Header section with gradient background matching tables.js */}
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
                  Update User
                </MDTypography>
              </MDBox>

              {/* Form content */}
              <MDBox pt={3} pb={2} px={2}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!validationErrors.name}
                        helperText={validationErrors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        error={!!validationErrors.email}
                        helperText={validationErrors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        error={!!validationErrors.username}
                        helperText={validationErrors.username}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        error={!!validationErrors.password}
                        helperText={validationErrors.password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDBox mt={2} display="flex" gap={2}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          startIcon={<Icon>edit</Icon>}
                        >
                          Update User
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate("/tables")}
                          startIcon={<Icon>arrow_back</Icon>}
                        >
                          Back to Users
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

export default UpdateUser;
