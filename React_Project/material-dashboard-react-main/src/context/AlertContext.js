// src/context/AlertContext.js
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

const AlertContext = createContext();

export function useAlert() {
  //custom hook
  return useContext(AlertContext); // encapsulates the react built-in useContext hook
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={alert.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
}
AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
