import { useSelector } from "react-redux";

import { ballot_types_map } from "../utils/functions.js";

import { Grid, Typography, Divider, Chip } from "@mui/material";

// icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// stylesheet
import styles from "../styles/create_ballot.module.css";

const CreatedBallot = () => {
  const ballot = useSelector((state) => state.ballot.initial_ballot);

  return (
    <Grid container sx={{ width: "100%", padding: "1rem", height: "100%" }}>
      <Grid item xs={8} mb={4}>
        <Typography variant="h5" className={styles.heading}>
          {ballot.ballot_name}{" "}
          <Typography variant="caption">{`${ballot_types_map.get(
            parseInt(ballot.ballot_type)
          )} Ballot`}</Typography>
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Chip label={ballot.ballot_id} />
      </Grid>

      <Grid
        item
        mb={4}
        xs={12}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row", md: "row", lg: "row" },
          alignItems: "center",
        }}
      >
        <Typography variant="h5" pr={4} className={styles.heading}>
          {" "}
          Organizer:{" "}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "15px", md: "15px", lg: "20px" },
          }}
        >
          {ballot.ballot_chair}
        </Typography>
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
        <div>
          <Typography variant="h5" className={styles.heading}>
            Ballot Candidates
          </Typography>
        </div>

        <>
          {Object.keys(ballot.ballot_candidates).map((key) => (
            <div key={key}>
              <Typography
                variant="caption"
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
                {ballot.ballot_candidates[key]}
              </Typography>
              <Divider />
            </div>
          ))}
        </>
      </Grid>

      <Grid item mb={4} xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h5" pb={1} className={styles.heading}>
          Important Dates and Times
        </Typography>
        <div>
          <Typography variant="h6">Registration:</Typography>{" "}
          <Typography variant="subtitle1">
            Starts: {new Date(ballot.start_registration).toDateString()} Ends:{" "}
            {new Date(ballot.end_registration).toDateString()}
          </Typography>
        </div>
        <div>
          <Typography variant="h6">Voting:</Typography>{" "}
          <Typography variant="subtitle1">
            Starts: {new Date(ballot.start_voting).toDateString()}, Ends:{" "}
            {new Date(ballot.end_voting).toDateString()}
          </Typography>
        </div>
      </Grid>

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
            value={`http://localhost:3000/register_voter/${ballot.ballot_id}`}
            readonly
          />
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(
                `http://localhost:3000/register_voter/${ballot.ballot_id}`
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
    </Grid>
  );
};

export default CreatedBallot;
