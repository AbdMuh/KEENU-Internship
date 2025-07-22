import React from "react";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function GenericModal({ open, handleClose, card, setCard, handleSubmit }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Update Card
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Card Number"
            value={card?.cardNumber || ""}
            onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
            fullWidth
          />
          <TextField
            label="Expiration Date"
            type="date"
            value={card?.expirationDate ? card.expirationDate.slice(0, 10) : ""}
            onChange={(e) => setCard({ ...card, expirationDate: e.target.value })}
            fullWidth
          />
          <MDButton variant="contained" color="primary" onClick={handleSubmit}>
            Update Information
          </MDButton>
        </Stack>
      </Box>
    </Modal>
  );

  GenericModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    card: PropTypes.object,
    setCard: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
}
