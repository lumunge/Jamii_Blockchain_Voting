import Image from "next/image";
import { Grid, Typography } from "@mui/material";

const NoBallots = () => {
  return (
    <Grid
      container
      lg={12}
      xs={12}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        textAlign: "center",
      }}
    >
      <Typography variant="h4">You have no Open Ballots.</Typography>
      <Image
        src="/no_ballots_nobg.png"
        alt="not_available_image"
        width={500}
        height={500}
      />
      <Typography variant="caption">Create one in the previous tab.</Typography>
    </Grid>
  );
};

export default NoBallots;
