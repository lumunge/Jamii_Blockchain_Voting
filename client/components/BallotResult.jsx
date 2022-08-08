import { useSelector } from "react-redux";
import { Grid, Typography, Divider, Chip } from "@mui/material";

import { ballot_types_map } from "../utils/functions.js";

// Components
import CountdownTimer from "../components/CountdownTimer";
import NoBallots from "../components/NoBallots";

// stylesheet
import styles from "../styles/create_ballot.module.css";

const BallotResult = () => {
  const ballots = useSelector((state) => state.ballot.ballots);
  const active_ballot = useSelector((state) => state.ballot.active_ballot);
  const connected_account = useSelector(
    (state) => state.auth.connected_account
  );

  return (
    <>
      {connected_account === ballots[active_ballot].ballot_chair ? (
        <>
          <Grid container lg={12} sx={{ display: "flex" }}>
            <Grid item xs={8} mb={4}>
              <Typography variant="h5" className={styles.heading}>
                {ballots[active_ballot].ballot_name}{" "}
                <Typography variant="caption">{`${ballot_types_map.get(
                  parseInt(ballots[active_ballot].ballot_type)
                )} Ballot`}</Typography>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Chip label={ballots[active_ballot].ballot_id} />
            </Grid>
          </Grid>

          <Grid container>
            <Grid
              item
              item
              pb={4}
              lg={12}
              md={12}
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <>
                <Typography variant="h6" className={styles.heading}>
                  Voting
                </Typography>{" "}
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

            <Grid
              item
              xs={12}
              lg={12}
              mb={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>
                <Typography variant="h5" pb={2} className={styles.heading}>
                  Ballot Candidates
                </Typography>
              </div>

              <>
                {Object.keys(ballots[active_ballot].candidates).map((key) => (
                  <div key={key}>
                    <Typography
                      pt={1}
                      pb={1}
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

            <Grid item xs={12}>
              <Typography
                variant="h4"
                className={styles.heading}
                sx={{ textAlign: "center" }}
              >
                Total Votes: 0
              </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <NoBallots />
      )}
    </>
  );
};

export default BallotResult;
