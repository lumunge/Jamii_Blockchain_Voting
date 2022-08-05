import Head from "next/head";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { add_active_ballot } from "../store/ballot_slice";

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
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

// Components

// styleshee
import styles from "../styles/create_ballot.module.css";

const LeftSideBar = () => {
  const dispatch = useDispatch();

  const connected = useSelector((state) => state.auth.is_connected);

  const ballots = useSelector((state) => state.ballot.ballots);
  const active_ballot = useSelector((state) => state.ballot.active_ballot);

  const [error, set_error] = useState("");

  const [wallet_color, set_wallet_color] = useState("red");

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
            height: "20vh",
            textAlign: "center",
            padding: "10px",
          }}
        >
          <Typography variant="h4">Jamii Ballots</Typography>
          <Button
            variant="outlined"
            color="success"
            onClick={(e) => handle_new_ballot(e, 0)}
            className={styles.right_btns}
          >
            New Ballot
          </Button>
        </Grid>
        <Divider />
        <Grid
          item
          xs={12}
          sx={{ height: "60vh", overflowY: "auto", textAlign: "center" }}
        >
          <Typography variant="body1">Ballots</Typography>
          {Object.keys(ballots).map((key) => (
            <List
              key={key}
              className={key === active_ballot && styles.heading}
              onClick={() => dispatch(add_active_ballot(key))}
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
          ))}
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            height: "10vh",
          }}
        >
          <footer className={styles.left_footer}>
            <div>{error && <small>{error}</small>}</div>

            <Grid container sx={{ display: "flex", justifyContent: "center" }}>
              {connected ? (
                <AccountBalanceWalletOutlinedIcon
                  sx={{ color: wallet_color }}
                />
              ) : (
                <Button className={styles.right_btns}>Connect Wallet</Button>
              )}
            </Grid>
          </footer>
        </Grid>
      </Box>
    </>
  );
};

export default LeftSideBar;
