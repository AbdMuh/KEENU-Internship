import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirect
import { Link } from "react-router-dom";
import { useEffect } from "react"; // Already likely imported
import { useAuth } from "AuthProvider";

// @mui components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// MD Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout
import AuthLayout from "layouts/authentication/components/AuthLayout";

// Assets
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// API
import apiService from "services/apiService";

function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      localStorage.removeItem("user");
      console.log("Cleared existing user from localStorage.");
    }
  }, []);

  const handleChange = (e) => {
    // Clear field-specific errors when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
    // Clear API error when user modifies form
    if (apiError) {
      setApiError("");
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.trim().length < 3) {
      newErrors.password = "Password must be at least 3 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous API errors
    setApiError("");

    // Validate form first
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = await apiService.login(formData); //error
      console.log("Login result:", result);

      if (result.success) {
        login(result.user);
        navigate("/dashboard");
      } else {
        setApiError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            {[FacebookIcon, GitHubIcon, GoogleIcon].map((IconComponent, index) => (
              <Grid item xs={2} key={index}>
                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                  <IconComponent color="inherit" />
                </MDTypography>
              </Grid>
            ))}
          </Grid>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                fullWidth
                disabled={loading}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                fullWidth
                disabled={loading}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={loading}
              />
              <MDTypography
                variant="button"
                color="text"
                sx={{
                  cursor: loading ? "default" : "pointer",
                  userSelect: "none",
                  ml: -1,
                  opacity: loading ? 0.6 : 1,
                }}
                onClick={() => !loading && setRememberMe(!rememberMe)}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>

            {apiError && (
              <MDBox mt={2} p={2} bgcolor="error.light" borderRadius="md">
                <MDTypography variant="button" color="error">
                  {apiError}
                </MDTypography>
              </MDBox>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </MDButton>
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </AuthLayout>
  );
}

export default SignIn;
