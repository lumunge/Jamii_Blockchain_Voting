import { useDispatch, useSelector } from "react-redux";
import { add_notification } from "../store/notification_slice";
import { Alert } from "@mui/material";

const Notification = () => {
  const dispatch = useDispatch();

  const show_notification = useSelector((state) => state.notification.open);
  const type_notification = useSelector((state) => state.notification.type);
  const message_notification = useSelector(
    (state) => state.notification.message
  );

  const handleClose = () => {
    dispatch(
      add_notification({
        open: false,
        type: "",
        message: "",
      })
    );
  };

  return (
    <>
      <div>
        {show_notification && (
          <Alert onClose={handleClose} severity={type_notification}>
            {message_notification}
          </Alert>
        )}
      </div>
    </>
  );
};

export default Notification;
