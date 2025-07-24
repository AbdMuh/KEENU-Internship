import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// Services
import apiService from "services/apiService";

function Cover() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear API error when user modifies form
    if (apiError) {
      setApiError("");
    }

    // Clear success message when user modifies form
    if (successMessage) {
      setSuccessMessage("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Agreement validation
    if (!formData.agree) {
      newErrors.agree = "You must agree to the terms and conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setSuccessMessage("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const userData = {
      id: 0,
      name: formData.name.trim(),
      email: formData.email.trim(),
      loginUser: {
        id: 0,
        username: formData.username.trim(),
        password: formData.password.trim(),
        role: "",
        userId: 0,
      },
    };

    try {
      const result = await apiService.createUser(userData);

      if (result.success) {
        setSuccessMessage("Account created successfully! Redirecting to sign in...");

        setFormData({
          name: "",
          email: "",
          username: "",
          password: "",
          agree: false,
        });

        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 2000);
      } else {
        setApiError(result.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to register
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3} sx={{ width: "100%" }}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                name="name"
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                disabled={isSubmitting}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                name="email"
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                disabled={isSubmitting}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                name="username"
                type="text"
                label="Username"
                variant="standard"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                disabled={isSubmitting}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                name="password"
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                disabled={isSubmitting}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <MDTypography
                variant="button"
                fontWeight="light"
                color="text"
                sx={{
                  cursor: isSubmitting ? "default" : "pointer",
                  userSelect: "none",
                  ml: -1,
                  opacity: isSubmitting ? 0.6 : 1,
                }}
                onClick={() =>
                  !isSubmitting && setFormData((prev) => ({ ...prev, agree: !prev.agree }))
                }
              >
                <MDTypography variant="caption" color="text" fontWeight="light" ml={1} mr={0.5}>
                  I agree to the
                </MDTypography>
                <MDTypography
                  component="a"
                  href="#"
                  variant="caption"
                  fontWeight="bold"
                  color="info"
                  textGradient
                >
                  Terms and Conditions
                </MDTypography>
              </MDTypography>
            </MDBox>

            {errors.agree && (
              <MDBox mt={1}>
                <MDTypography variant="caption" color="error">
                  {errors.agree}
                </MDTypography>
              </MDBox>
            )}

            {apiError && (
              <MDBox mt={2} p={2} bgcolor="error.light" borderRadius="md">
                <MDTypography variant="button" color="error">
                  {apiError}
                </MDTypography>
              </MDBox>
            )}

            {successMessage && (
              <MDBox mt={2} p={2} bgcolor="success.light" borderRadius="md">
                <MDTypography variant="button" color="success">
                  {successMessage}
                </MDTypography>
              </MDBox>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </MDButton>
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
