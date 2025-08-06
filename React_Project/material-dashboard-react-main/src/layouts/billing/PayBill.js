// React & Hooks
import { useState, useEffect } from "react";

// MUI Components
import {
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

// Dashboard Layout Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Context & Services
import { useAlert } from "context/AlertContext";
import apiService from "services/apiService";

function BillsDashboard() {
  const [outstandingBills, setOutstandingBills] = useState([]);
  const [clearedBills, setClearedBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { showAlert } = useAlert();

  // Fetch both cleared and outstanding bills
  const fetchBills = async () => {
    try {
      const [outRes, clrRes] = await Promise.all([
        apiService.getOutstandingBills(),
        apiService.getClearedBills(),
      ]);

      if (outRes.success) {
        setOutstandingBills(outRes.data);
        console.log("Outstanding Bills:", outRes.data);
      } else showAlert("Failed to fetch outstanding bills", "error");

      if (clrRes.success) setClearedBills(clrRes.data);
      else showAlert("Failed to fetch cleared bills", "error");
    } catch (err) {
      showAlert("Error fetching bills", "error");
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBills(); // Reset to default
      return;
    }
    console.log("Searching for:", searchTerm.trim());
    const res = await apiService.getChallanByNumber(searchTerm.trim());
    if (res.success) {
      const bill = res.data;
      if (bill.isPaid) {
        setClearedBills([bill]);
        setOutstandingBills([]);
      } else {
        setOutstandingBills([bill]);
        setClearedBills([]);
      }
    } else {
      showAlert("No bill found with that challan number", "error");
    }
  };

  // Handle payment
  const handlePay = async (challanNumber) => {
    const res = await apiService.payBill(challanNumber);
    if (res.success) {
      showAlert("Bill paid successfully", "success");
      closeModal();
      fetchBills();
    } else {
      showAlert(res.error || "Payment failed", "error");
    }
  };

  // Modal handlers
  const openModal = (bill) => {
    setSelectedBill(bill);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBill(null);
    setModalOpen(false);
  };

  const renderBillCard = (bill) => (
    <Grid item xs={12} md={8} lg={6} key={bill.id}>
      <Card onClick={() => openModal(bill)} sx={{ cursor: "pointer", height: "100%" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {bill.description}
          </Typography>
          <Typography variant="overline" sx={{ display: "block", mb: 0 }}>
            Challan #: {bill.challanNumber}
          </Typography>
          <Typography variant="overline" sx={{ display: "block", mb: 0 }}>
            Due Date: {bill.dueDate.slice(0, 10)}
          </Typography>

          <Typography variant="body2">
            Amount: <strong>${bill.amount.toFixed(2)} — </strong>
            <strong style={{ color: bill.status === "Paid" ? "green" : "orange" }}>
              {bill.status === "Paid" ? "Cleared" : "Outstanding"}
            </strong>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Search Bar */}
        <Grid container spacing={2} alignItems="center" mb={3}>
          <Grid item xs={10} md={6}>
            <TextField
              fullWidth
              label="Search by Challan Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </Grid>
          <Grid item xs={2}>
            <MDButton variant="contained" onClick={handleSearch} color="primary">
              Search
            </MDButton>
          </Grid>
        </Grid>

        {/* Outstanding Bills */}
        <Typography variant="h5" mb={2}>
          Outstanding Bills
        </Typography>
        <Grid container spacing={3}>
          {outstandingBills.length > 0 ? (
            outstandingBills.map(renderBillCard)
          ) : (
            <Typography variant="body2" m={2} sx={{ textAlign: "center" }}>
              No outstanding bills.
            </Typography>
          )}
        </Grid>

        {/* Cleared Bills */}
        <Typography variant="h5" mt={5} mb={2}>
          Cleared Bills
        </Typography>
        <Grid container spacing={3}>
          {clearedBills.length > 0 ? (
            clearedBills.map(renderBillCard)
          ) : (
            <Typography variant="body2" m={2} sx={{ textAlign: "center" }}>
              No cleared bills.
            </Typography>
          )}
        </Grid>
      </MDBox>

      {/* Modal for Bill Detail */}
      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Bill Details</DialogTitle>

        <DialogContent dividers sx={{ px: 4, py: 2 }}>
          {selectedBill && (
            <MDBox display="flex" flexDirection="column" gap={1.5}>
              <Typography variant="subtitle1" align="center" fontWeight="medium">
                Challan #: {selectedBill.challanNumber}
              </Typography>

              <Typography variant="body1">
                <strong>Type:</strong> {selectedBill.description}
              </Typography>

              <Typography variant="body1">
                <strong>Amount:</strong> ${selectedBill.amount.toFixed(2)}
              </Typography>

              <Typography variant="body1">
                <strong>Due Date:</strong> {selectedBill.dueDate.slice(0, 10)}
              </Typography>

              <Typography variant="body1">
                <strong>Status:</strong>{" "}
                <MDBox
                  component="span"
                  fontWeight="bold"
                  color={selectedBill.status === "Paid" ? "green" : "orange"}
                >
                  {selectedBill.status === "Paid" ? "Cleared" : "Outstanding"}
                </MDBox>
              </Typography>
            </MDBox>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 3 }}>
          <MDButton onClick={closeModal} color="secondary">
            Close
          </MDButton>

          {selectedBill?.status === "Pending" && (
            <MDButton
              onClick={() => handlePay(selectedBill.challanNumber)}
              color="primary"
              variant="contained"
            >
              Pay
            </MDButton>
          )}
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default BillsDashboard;
