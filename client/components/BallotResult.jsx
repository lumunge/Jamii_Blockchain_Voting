import { useSelector } from "react-redux";
import { Grid, Typography, Divider, Chip } from "@mui/material";

import { ballot_types_map } from "../utils/functions.js";

// Components
import CountdownTimer from "../components/CountdownTimer";

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
          <Grid item xs={8} mb={4}>
            <Typography variant="h5">
              {ballots[active_ballot].ballot_name}{" "}
              <Typography variant="caption">{`${ballot_types_map.get(
                parseInt(ballots[active_ballot].ballot_type)
              )} Ballot`}</Typography>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Chip
              label={ballots[active_ballot].ballot_id}
              // onClick={handleClick}
            />
          </Grid>

          <Grid container>
            <Grid
              item
              item
              mb={2}
              xs={12}
              md={6}
              lg={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                <Typography variant="h5" pb={2}>
                  Ballot Candidates
                </Typography>
              </div>

              <>
                {Object.keys(ballots[active_ballot].ballot_candidates).map(
                  (key) => (
                    <div key={key}>
                      <Typography variant="body1" pt={1} pb={1}>
                        {ballots[active_ballot].ballot_candidates[key]}
                      </Typography>
                      <Divider />
                    </div>
                  )
                )}
              </>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                Total Votes: 0
              </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid container>
          <Typography variant="h3">You have No Active Ballots</Typography>
        </Grid>
      )}
    </>
  );
};

export default BallotResult;
