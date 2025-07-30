// React hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MUI components
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useAlert } from "context/AlertContext";

// Dashboard layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Billing components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";

// Services
import apiService from "services/apiService";
import { useAuth } from "AuthProvider";

function Billing() {
  const [displayCard, setDisplayCard] = useState(null);
  const [balance, setBalance] = useState(0);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferData, setTransferData] = useState({ receiverId: "", amount: "" });
  const [transferError, setTransferError] = useState("");

  const navigate = useNavigate();

  const formatExpirationDate = (dateStr) => {
    if (!dateStr) return "MM/YY";
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  const fetchDefaultCard = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const res = await apiService.getDefaultCard(user.id);
    if (res.success) setDisplayCard(res.data);
  };

  const fetchTransactions = async () => {
    const res = await apiService.getTransactions(user.id);
    if (res.success) {
      setTransactions(res.data);
    } else {
      console.error("Failed to fetch transactions:", res.error);
    }
  };

  const fetchPaymentMethods = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const res = await apiService.getCards(user.id);
    if (res.success) setPaymentMethods(res.data);
  };

  const fetchTransferUsers = async () => {
    const res = await apiService.getNames();
    console.log("Transfer users fetched:", res);
    if (res.success) setReceivers(res.data);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchDefaultCard(),
        fetchPaymentMethods(),
        fetchTransferUsers(),
        fetchTransactions(),
      ]);
      setBalance(user?.balance || 0);
      setLoading(false);
    };
    init();
  }, []);

  const cancelModal = () => {
    setIsTransferOpen(false);
    setTransferData({ receiverId: "", amount: "" });
    setTransferError("");
  };
  const handleTransfer = async () => {
    const { receiverId, amount } = transferData;
    const numericAmount = parseFloat(amount);

    if (!receiverId || numericAmount <= 0 || isNaN(numericAmount)) {
      setTransferError("Please enter a valid positive amount and select a receiver.");
      return;
    }

    try {
      console.log("Transferring money to:", receiverId, "Amount:", numericAmount);

      const response = await apiService.transferMoney({ receiverId, amount: numericAmount });
      if (response.success) {
        setBalance((prev) => prev - numericAmount);
        showAlert("Transfer successful!", "success");
        cancelModal();
      } else {
        setTransferError(response.error || "Transfer failed.");
      }
    } catch (err) {
      setTransferError("An error occurred while processing the transfer.");
    }
  };

  const defaultCard = displayCard || paymentMethods.find((card) => card.setAsDefault === 1);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={8}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} xl={6}>
                <MasterCard
                  number={Number(defaultCard?.cardNumber || "4562112245947852")}
                  holder={defaultCard?.holderName || "No Default Card"}
                  expires={formatExpirationDate(defaultCard?.expirationDate)}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultInfoCard
                  icon="account_balance"
                  title="Account Balance"
                  description="Current balance in your account"
                  value={`$${balance.toFixed(0)}`}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultInfoCard
                  icon="send"
                  title="Transfer Money"
                  description="Send money to friends"
                  value={
                    <MDButton
                      variant="contained"
                      color="primary"
                      onClick={() => setIsTransferOpen(true)}
                    >
                      Transfer
                    </MDButton>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <PaymentMethod
                  paymentMethods={paymentMethods}
                  loading={loading}
                  onRefresh={fetchPaymentMethods}
                  handleAddCard={() => navigate("/addCard")}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Invoices />
          </Grid>
        </Grid>
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions transactions={transactions} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />

      {/* Transfer Modal */}
      <Dialog
        open={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Transfer Money</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Select Receiver"
            select
            margin="normal"
            value={transferData.receiverId}
            onChange={(e) => setTransferData({ ...transferData, receiverId: e.target.value })}
          >
            {receivers.map((r) => (
              <MenuItem key={r.userId} value={r.userId}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            margin="normal"
            value={transferData.amount}
            onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
            inputProps={{ min: 0 }}
          />
          {transferError && (
            <MDTypography color="error" variant="caption">
              {transferError}
            </MDTypography>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => cancelModal()} color="secondary">
            Cancel
          </MDButton>
          <MDButton onClick={handleTransfer} color="primary">
            Transfer
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Billing;
