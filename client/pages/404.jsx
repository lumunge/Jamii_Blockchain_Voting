import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useSelector } from "react-redux";

import { Grid, Button, Typography } from "@mui/material";

// styles
import styles from "../styles/pages.module.css";

// components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FourOhFour = () => {
  const current_theme = useSelector((state) => state.theme.current_theme);

  return (
    <div className={styles.container} data-theme={current_theme}>
      <Head>
        <title>Jamii Blockchain Voting</title>
        <meta
          name="description"
          content="Jamii ballots - page not available."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Navbar />
      <Grid container mb={4} sx={{ height: "100vh" }}>
        <Grid container sx={{ height: "70%" }}>
          <Image
            src="/index_11_nobg1.png"
            alt="404"
            width={1800}
            height={800}
          />
        </Grid>
        <Grid
          container
          mt={2}
          justifyContent="center"
          alignItems="center"
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            marginBotton: "1rem",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "2rem", sm: "3rem", md: "3rem", lg: "3rem" },
            }}
          >
            We're Sorry but this page is not available.
          </Typography>
          <Link href="/">
            <Button className={styles.right_btns}>Go Back</Button>
          </Link>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default FourOhFour;
