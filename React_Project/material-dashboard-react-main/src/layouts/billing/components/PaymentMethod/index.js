// React
import React, { useState } from "react"; // ✅ FIX: Add React + useState import

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { useAlert } from "context/AlertContext";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Images
import masterCardLogo from "assets/images/logos/mastercard.png";
import visaLogo from "assets/images/logos/visa.png";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

import apiService from "services/apiService";
import GenericModal from "../GenericModal";

function PaymentMethod({
  paymentMethods = [],
  loading = false,
  error = null,
  onRefresh,
  handleAddCard,
  handleSetDefault,
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [selectedCard, setSelectedCard] = useState(-1);
  const { showAlert } = useAlert();
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return "****\u00A0\u00A0****\u00A0\u00A0****\u00A0\u00A0****";
    const lastFour = cardNumber.slice(-4);
    return `****\u00A0\u00A0****\u00A0\u00A0****\u00A0\u00A0${lastFour}`;
  };
  const getCardType = (cardNumber) => {
    if (!cardNumber) return "visa";
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === "4") return "visa";
    if (firstDigit === "5" || firstDigit === "2") return "mastercard";
    return "visa";
  };

  const getCardLogo = (cardNumber) => {
    const cardType = getCardType(cardNumber);
    return cardType === "mastercard" ? masterCardLogo : visaLogo;
  };

  const handleCardUpdate = (card) => {
    console.log("Updating card:", card); // open modal and set card data
    // This function should open a modal with the card details pre-filled for editing
    setSelectedUpdate(card);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUpdate(null);
  };

  const handleUpdateSubmit = async () => {
    const response = await apiService.updateCard(selectedUpdate);
    if (response.success) {
      showAlert(response.data, "success");
    } else {
      showAlert(`Error: ${response.error}`, "error");
    }
    onRefresh();
    handleModalClose();
  };

  async function handleChangeDefaultCard(cardId) {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    console.log("Setting default card for user:", userId, "Card ID:", cardId);
    var previousDefault = paymentMethods.find((card) => card.setAsDefault === 1);
    if (previousDefault.cardId === cardId) {
      showAlert("This card is already set as default", "info");
      return;
    }
    const response = await apiService.setDefaultCard({ userId, cardId });
    if (response.success) {
      showAlert(response.data, "success");
      handleSetDefault();
      onRefresh();
    } else {
      showAlert(`Error: ${response.error}`, "error");
    }
    setSelectedCard(-1);
  }

  return (
    <Card id="payment-methods">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Payment Method
        </MDTypography>
        <MDBox display="flex" gap={1}>
          {onRefresh && (
            <MDButton
              variant="outlined"
              color="info"
              size="small"
              onClick={onRefresh}
              disabled={loading}
            >
              <Icon sx={{ fontWeight: "bold" }}>refresh</Icon>
              &nbsp;refresh
            </MDButton>
          )}
          <MDButton variant="gradient" color="dark" onClick={handleAddCard}>
            <Icon sx={{ fontWeight: "bold" }}>add</Icon>
            &nbsp;add new card
          </MDButton>
          <MDButton
            variant="gradient"
            color={selectedCard === -1 ? "error" : "success"}
            onClick={() => handleChangeDefaultCard(selectedCard)}
            disabled={selectedCard === -1 || loading}
          >
            <Icon sx={{ fontWeight: "bold" }}>{selectedCard === -1 ? "clear" : "check"}</Icon>
            &nbsp;Make Default
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox p={2}>
        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="150px">
            <CircularProgress size={40} />
            <MDTypography variant="body2" ml={2}>
              Loading payment methods...
            </MDTypography>
          </MDBox>
        ) : error ? (
          <MDBox textAlign="center" py={3}>
            <MDTypography variant="body2" color="error">
              Error: {error}
            </MDTypography>
            {onRefresh && (
              <MDButton
                variant="outlined"
                color="error"
                size="small"
                onClick={onRefresh}
                sx={{ mt: 1 }}
              >
                Retry
              </MDButton>
            )}
          </MDBox>
        ) : paymentMethods.length === 0 ? (
          <MDBox textAlign="center" py={3}>
            <MDTypography variant="body2" color="text">
              No payment methods found
            </MDTypography>
          </MDBox>
        ) : (
          <Grid container spacing={3}>
            {paymentMethods.map((card, index) => (
              <Grid item xs={12} md={6} key={card.id || index}>
                <MDBox
                  borderRadius="lg"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={3}
                  position="relative"
                  sx={{
                    border: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                    backgroundColor:
                      card.setAsDefault === 1
                        ? darkMode
                          ? "rgba(76, 175, 80, 0.1)"
                          : "rgba(76, 175, 80, 0.05)"
                        : "transparent",
                    borderColor:
                      card.setAsDefault === 1
                        ? "success.main"
                        : selectedCard === card.id
                        ? "primary.main"
                        : "transparent",
                  }}
                  onClick={() => {
                    setSelectedCard(card.id);
                  }}
                >
                  {card.setAsDefault === 1 && (
                    <MDBox
                      position="absolute"
                      top="8px"
                      right="8px"
                      display="flex"
                      alignItems="center"
                    >
                      <MDTypography
                        variant="caption"
                        color="success"
                        fontWeight="bold"
                        sx={{ fontSize: "10px" }}
                      >
                        DEFAULT
                      </MDTypography>
                    </MDBox>
                  )}

                  <MDBox
                    component="img"
                    src={getCardLogo(card.cardNumber)}
                    alt={`${getCardType(card.cardNumber)} card`}
                    width="10%"
                    mr={2}
                  />

                  <MDBox flex={1}>
                    <MDTypography variant="h6" fontWeight="medium">
                      {formatCardNumber(card.cardNumber)}
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      {card.holderName || "Card Holder"}
                    </MDTypography>
                  </MDBox>

                  <MDBox
                    ml="auto"
                    lineHeight={0}
                    color={darkMode ? "white" : "dark"}
                    onClick={() => handleCardUpdate(card)}
                  >
                    <Tooltip title="Edit Card" placement="top">
                      <Icon sx={{ cursor: "pointer" }} fontSize="small">
                        edit
                      </Icon>
                    </Tooltip>
                  </MDBox>
                </MDBox>
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>
      <GenericModal
        open={isModalOpen}
        handleClose={handleModalClose}
        card={selectedUpdate}
        setCard={setSelectedUpdate}
        handleSubmit={handleUpdateSubmit}
      />
    </Card>
  );
}

PaymentMethod.propTypes = {
  paymentMethods: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRefresh: PropTypes.func,
  handleAddCard: PropTypes.func,
  handleSetDefault: PropTypes.func,
};

export default PaymentMethod;
