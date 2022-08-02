import { useSelector } from "react-redux";
import { Grid, Typography, Paper, Container } from "@mui/material";

const Expired = () => {
  const event = useSelector((state) => state.ballot.event);

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} sx={{ display: "flex" }}>
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 20px 10px 20px",
            }}
          >
            <Typography variant="button">{event} Closed</Typography>
          </Paper>
        </Grid>
      </Container>
    </>
  );
};

export default Expired;
