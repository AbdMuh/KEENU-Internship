import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Grid, Card, TextField, Button, Alert } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import apiService from "services/apiService";
import Icon from "@mui/material/Icon";

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
        username: formData.username,
        password: formData.password,
      },
    };

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
      <MDBox py={6} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="h5" gutterBottom>
                Update User
              </MDTypography>

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} mt={1}>
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
                    <Button type="submit" variant="contained" color="primary">
                      <Icon>edit</Icon>&nbsp;Update
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UpdateUser;
