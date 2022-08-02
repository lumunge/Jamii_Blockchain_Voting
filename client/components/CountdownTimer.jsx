import React from "react";
import TimeDisplay from "../components/TimeDisplay";
import { useCountdown } from "../hooks/useCountdown";
import Expired from "../components/Expired";
import { Grid, Paper, Container } from "@mui/material";

const Counter = ({ days, hours, minutes, seconds }) => {
  return (
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
          <TimeDisplay value={days} type={"Days"} />
          <TimeDisplay value={hours} type={"Hours"} />
          <TimeDisplay value={minutes} type={"Mins"} />
          <TimeDisplay value={seconds} type={"Secs"} />
        </Paper>
      </Grid>
    </Container>
  );
};

const CountdownTimer = ({ target_date }) => {
  const [days, hours, minutes, seconds] = useCountdown(target_date);

  if (days + hours + minutes + seconds <= 0) {
    return (
      <>
        <Expired />
      </>
    );
  } else {
    return (
      <Counter days={days} hours={hours} minutes={minutes} seconds={seconds} />
    );
  }
};

export default CountdownTimer;
