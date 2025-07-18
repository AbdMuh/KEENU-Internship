import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import usersTableData from "layouts/tables/data/usersTableData";
import apiService from "services/apiService";
import { useNavigate } from "react-router-dom"; // ✅ Add this

function Tables() {
  const [userData, setUserData] = useState([]);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = () => {
    apiService
      .getUsers()
      .then((res) => {
        if (res.success) {
          setUserData(res.data);
        } else {
          setApiError(res.error);
        }
      })
      .catch((err) => setApiError(err));
  };

  const handleDelete = async (userId) => {
    const res = await apiService.apiCall("delete", `/Users/delete/${userId}`);
    if (res.success) {
      alert("User deleted successfully.");
      fetchUsers(); // Refresh table
    } else {
      alert("Failed to delete user: " + res.error);
    }
  };

  const handleUpdate = (id, user) => {
    console.log(user);
    navigate(`/updateUser/${id}`, { state: { user } });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { columns, rows } = usersTableData(userData, handleDelete, handleUpdate);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {apiError && (
          <MDBox mb={2}>
            <Alert severity="error">{apiError}</Alert>
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
                  Users Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted
                  entriesPerPage
                  showTotalEntries
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
