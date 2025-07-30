// Transactions.js

import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Transaction from "layouts/billing/components/Transaction";

function Transactions({ transactions }) {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Your Transactions
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Last 30 Days
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        {transactions.length === 0 ? (
          <MDTypography variant="body2" color="text" px={2}>
            No transactions to display.
          </MDTypography>
        ) : (
          <MDBox
            component="ul"
            display="flex"
            flexDirection="column"
            p={0}
            m={0}
            sx={{ listStyle: "none" }}
          >
            {transactions.map((tx, index) => (
              <Transaction
                key={index}
                color="success"
                icon="attach_money"
                name={`From ${tx.senderName} to ${tx.receiverName}`}
                description={new Date(tx.transactionDate).toLocaleString()}
                value={`+ $${tx.amount}`}
              />
            ))}
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      senderName: PropTypes.string,
      receiverName: PropTypes.string,
      amount: PropTypes.number,
      transactionDate: PropTypes.string,
    })
  ),
};

export default Transactions;
