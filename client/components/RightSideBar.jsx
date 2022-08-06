import { useSelector, useDispatch } from "react-redux";

import { add_show_form, add_active_tab } from "../store/ballot_slice";

import { Grid, Box, Button, Typography, Paper } from "@mui/material";

// icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

// Components
import Notification from "../components/Notification";

// styleshee
import styles from "../styles/create_ballot.module.css";

const RightSideBar = () => {
  const dispatch = useDispatch();
  const connected = useSelector((state) => state.auth.is_connected);
  const ballots = useSelector((state) => state.ballot.ballots);

  const show_notification = useSelector((state) => state.notification.open);
  const type_notification = useSelector((state) => state.notification.type);
  const message_notification = useSelector(
    (state) => state.notification.message
  );

  const handle_add_show_form = () => {
    dispatch(add_active_tab(0));
    dispatch(add_show_form(true));
  };

  return (
    <>
      <Grid
        sx={{
          height: "100%",
          padding: "1rem 2rem",
          flexDirection: "column",
        }}
      >
        <Button
          variant="outlined"
          color="success"
          className={styles.right_btns}
          onClick={handle_add_show_form}
        >
          <Box sx={{ display: "flex" }} justifyContent="space-between">
            <>New</>{" "}
            <ContentCopyIcon sx={{ position: "relative", right: "-10px" }} />
          </Box>
        </Button>

        <Button
          variant="outlined"
          color="success"
          className={styles.right_btns}
        >
          Preview{" "}
          <VisibilityOutlinedIcon
            sx={{ position: "relative", right: "-10px" }}
          />
        </Button>
        <Button
          variant="outlined"
          color="success"
          className={styles.right_btns}
        >
          Print{" "}
          <PrintOutlinedIcon sx={{ position: "relative", right: "-10px" }} />
        </Button>
        <div>
          {!connected && (
            <>
              <Paper elevation={4} sx={{ padding: "10px" }}>
                <span>Connect Wallet to Create Ballot</span>
              </Paper>
            </>
          )}
        </div>
        <Typography variant="caption" pt={4} sx={{ textAlign: "center" }}>
          {3 - ballots.length} Test Ballots Left
        </Typography>
        {ballots.length === 3 && (
          <Notification
            open={show_notification}
            type={type_notification}
            message={message_notification}
          />
        )}
      </Grid>
    </>
  );
};

export default RightSideBar;
