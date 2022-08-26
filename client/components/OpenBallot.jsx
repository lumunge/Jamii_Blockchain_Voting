import { useSelector } from "react-redux";

import CountdownTimer from "./CountdownTimer";

import { Grid, Box, Typography, Divider, Chip } from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import styles from "../styles/create_ballot.module.css";

const OpenBallot = () => {
  const domain =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000/"
      : "https://jamii-ballots.vercel.app/";

  const ballots = useSelector((state) => state.ballot.ballots);
  const active_ballot = useSelector((state) => state.ballot.active_ballot);
  const connected_account = useSelector(
    (state) => state.auth.connected_account
  );

  return (
    <>
      <Grid container>
        <Grid container>
          <Grid item xs={8} mb={4}>
            <Typography variant="h5" className={styles.heading}>
              {ballots[active_ballot].ballot_name}{" "}
              <Typography variant="caption">{`open Ballot`}</Typography>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Chip
              label={ballots[active_ballot].ballot_id}
              // onClick={handleClick}
            />
          </Grid>
        </Grid>

        <Grid
          item
          mb={4}
          xs={12}
          sx={{
            display: "flex",
            flexDirection: { xs: "column" },
            alignItems: "center",
          }}
        >
          <Typography variant="h5" pr={4} className={styles.heading}>
            {" "}
            Organizer:{" "}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: "12px", sm: "15px", md: "15px", lg: "20px" },
            }}
          >
            {ballots[active_ballot].ballot_chair}
          </Typography>
        </Grid>

        <Grid
          mb={4}
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <Typography variant="h5" className={styles.heading}>
              Ballot Candidates
            </Typography>
          </div>

          <>
            {Object.keys(ballots[active_ballot].candidates).map((key) => (
              <div key={key}>
                <Typography
                  variant="caption"
                  pb={1}
                  pt={1}
                  sx={{
                    fontSize: {
                      xs: "12px",
                      sm: "15px",
                      md: "15px",
                      lg: "20px",
                    },
                  }}
                >
                  {ballots[active_ballot].candidates[key]}
                </Typography>
                <Divider />
              </div>
            ))}
          </>
        </Grid>

        <Grid
          item
          mb={4}
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" pb={1} className={styles.heading}>
            Important Dates and Times
          </Typography>

          <Grid container xs={12} mb={4}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <>
                <Typography variant="h6">Voter Registration:</Typography>{" "}
              </>
              <Grid item>
                <CountdownTimer
                  target_date={
                    parseInt(ballots[active_ballot].open_date) +
                    parseInt(ballots[active_ballot].registration_period) * 1000
                  }
                />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <>
                <Typography variant="h6">Voting:</Typography>{" "}
              </>
              <Grid item xs={12} md={6}>
                <CountdownTimer
                  target_date={
                    parseInt(ballots[active_ballot].open_date) +
                    parseInt(ballots[active_ballot].ballot_days)
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box xs={12} pt={2} pb={2} sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="body1" className={styles.heading}>
            Registered Voters: 0
          </Typography>
        </Box>

        {connected_account === ballots[active_ballot].ballot_chair && (
          <Grid
            item
            xs={12}
            mt={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "15px", md: "15px", lg: "20px" },
                }}
              >
                Registration link:
              </Typography>{" "}
            </div>
            <div className={styles.copy_link}>
              <input
                onFocus={(e) => e.target.select()}
                type="text"
                className={styles.copy_link_input}
                value={`${domain}register_voter/${ballots[active_ballot].ballot_id}`}
                readonly
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${domain}register_voter/${ballots[active_ballot].ballot_id}`
                  );
                }}
                className={styles.copy_link_button}
              >
                <span className={styles.material_icons}>
                  <ContentCopyIcon />
                </span>
              </button>
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default OpenBallot;
