// import React from "react";
// import { useState } from "react";
// import { Snackbar, Alert, Button } from "@mui/material";
// import PropTypes from "prop-types";

// function CustomAlert({ open, onClose, message, severity = "success", autoHideDuration = 3000 }) {
//   return (
//     <Snackbar
//       open={open}
//       autoHideDuration={autoHideDuration}
//       onClose={onClose}
//       anchorOrigin={{ vertical: "top", horizontal: "right" }}
//     >
//       <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
//         {message}
//       </Alert>
//     </Snackbar>
//   );
// }

// CustomAlert.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   message: PropTypes.string.isRequired,
//   severity: PropTypes.oneOf(["success", "error", "warning", "info"]),
//   autoHideDuration: PropTypes.number,
// };

// export default CustomAlert;
