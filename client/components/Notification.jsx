import React, { useState } from "react";
import { Alert } from "@mui/material";

const Notification = ({ type, message }) => {
  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });

  const handleClose = () => {
      setNotification({
          open: false,
          type: "",
          message: ""
      })
  };

  return (
    <>
      <div>
        {notification.open && (
          <Alert onClose={handleClose} severity={type}>
            {message}
          </Alert>
        )}
      </div>
    </>
  );
};

export default Notification;
