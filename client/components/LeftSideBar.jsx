import { useDispatch, useSelector } from "react-redux";

import { add_active_ballot, add_active_tab } from "../store/ballot_slice";

import {
  Grid,
  Box,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

// icons

// Components

// stylesheet
import styles from "../styles/create_ballot.module.css";

const LeftSideBar = () => {
  const dispatch = useDispatch();

  const connected = useSelector((state) => state.auth.is_connected);
  const connected_account = useSelector(
    (state) => state.auth.connected_account
  );

  const ballots = useSelector((state) => state.ballot.ballots);
  const active_ballot = useSelector((state) => state.ballot.active_ballot);

  const handle_ballot_change = (key, tab) => {
    dispatch(add_active_tab(tab));
    dispatch(add_active_ballot(key));
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            // height: "20vh",
            textAlign: "center",
            padding: "10px",
          }}
        >
          <Typography variant="h4">Jamii Ballots</Typography>
        </Grid>
        <Divider />
        <Grid
          item
          xs={12}
          sx={{ height: "60vh", overflowY: "auto", textAlign: "center" }}
        >
          {Object.keys(ballots).map((key) => (
            <>
              <Typography variant="body1">Ballots</Typography>

              <List
                key={key}
                className={key === active_ballot && styles.heading}
                onClick={() => handle_ballot_change(key, 1)}
                sx={{ cursor: "pointer" }}
              >
                <ListItem alignItems="flex-start">
                  <ListItemText
                    className={key === active_ballot && styles.heading}
                    primary={ballots[key].ballot_name}
                    secondary={
                      <span className={styles.side_bar_text}>
                        {" — this is a ballot to vote in ..."}
                      </span>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            </>
          ))}
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            height: "10vh",
            textAlign: "center",
          }}
        >
          <div>
            {!connected && (
              <Typography variant="caption">
                <a href="https://metamask.zendesk.com/hc/en-us/articles/360045901112-Manually-connecting-to-a-dapp">
                  Connect wallet
                </a>
              </Typography>
            )}
          </div>

          <Grid container sx={{ display: "flex", justifyContent: "center" }}>
            {connected ? (
              <>
                <Typography variant="caption">
                  {connected_account.substr(0, 10) + "..."}
                </Typography>
                <br />
                <Typography variant="caption" sx={{ color: "#78d64b" }}>
                  connected
                </Typography>
              </>
            ) : (
              <Button className={styles.right_btns}>
                <Typography variant="body2" sx={{ color: "red" }}>
                  Connect Wallet
                </Typography>
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LeftSideBar;
