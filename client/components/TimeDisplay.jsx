import { Box, Typography } from "@mui/material";

const TimeDisplay = ({ value, type }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style jsx>{`
        .countdown_out {
          color: red;
        }
      `}</style>
      <span className={value == 0 ? "countdown_out" : "countdown"}>
        {value}
      </span>
      <Typography variant="caption" pr={1} pl={1}>
        {type}
      </Typography>
    </Box>
  );
};

export default TimeDisplay;
