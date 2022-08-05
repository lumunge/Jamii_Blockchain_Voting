import { useSelector } from "react-redux";

import { Grid, Button, Typography, Paper } from "@mui/material";

// icons

// Components
import Notification from "../components/Notification";

// styleshee
import styles from "../styles/create_ballot.module.css";

const RightSideBar = () => {
  const connected = useSelector((state) => state.auth.is_connected);
  const ballots = useSelector((state) => state.ballot.ballots);

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
        >
          Preview Ballot
        </Button>
        <Button
          variant="outlined"
          color="success"
          className={styles.right_btns}
        >
          Print Results
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
