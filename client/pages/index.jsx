import Head from "next/head";

import { useSelector } from "react-redux";
import Image from "next/image";

import { Grid, Box, Container, Button, Typography } from "@mui/material";

// icons
import GitHubIcon from "@mui/icons-material/GitHub";

// components
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// styles
import styles from "../styles/Home.module.css";

const Home = () => {
  const current_theme = useSelector((state) => state.theme.current_theme);

  return (
    <div className={styles.container} data-theme={current_theme}>
      <Head>
        <title>Jamii Blockchain Voting</title>
        <meta name="description" content="A voting system on the blockchain." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <Container fixed>
        <Grid container sx={{ height: "100vh" }}>
          <Grid
            sx={{
              width: "100%",
              height: "50%",
              position: "relative",
            }}
          >
            <Image
              src="/index_1_nobg.png"
              alt="landing_image"
              layout="fill"
              objectFit="contain"
            />
          </Grid>
          <Grid
            item
            sx={{
              textAlign: "center",
              height: "50%",
            }}
          >
            <Typography variant="captiom">jamii ballots</Typography>
            <Typography
              variant="h4"
              mb={2}
              sx={{ marginTop: "6rem", fontWeight: "600" }}
            >
              Welcome to Jamii Ballots
            </Typography>
            <Typography variant="h5">
              Jamii ballots is an E-Voting System that utilizes blockchain
              tecnhology to secure and keep the voting process transparent.
            </Typography>
            <Button>Start a Ballot</Button>
          </Grid>
        </Grid>

        <Grid
          container
          alignItems="center"
          mt={4}
          mb={4}
          sx={{ height: "100vh" }}
        >
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Image
              src="/index_5_nobg.png"
              alt="question_mark"
              width={600}
              height={600}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography variant="h3" mb={2}>
              What are Jamii Ballots?
            </Typography>
            <Typography variant="h5" mb={2}>
              Jamii ballots are simply ballots on a blockchain. We leverage
              blockchain technology to create a secure and transparent system
              for online voting.
            </Typography>
            <Box>
              <Button>What are Jamii Ballots</Button>
              <Button>Blockchain Voting</Button>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          alignItems="center"
          mt={4}
          mb={4}
          sx={{ height: "100vh" }}
        >
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography variant="h3" mb={2}>
              Where can you use Jamii Ballots?
            </Typography>
            <Typography variant="h5" mb={2}>
              Order is very important in society and as such a form of
              governance and leadership is needed. Inorder to establish this
              leadership in the fairest way possible, we civilized people go
              through a voting process to elect those we think are right to lead
              us. Jamii ballots offers voting for many occassions from free
              general elections to closed door boardroom secret ballots.{" "}
            </Typography>
            <Button>Use Cases</Button>
          </Grid>
          <Grid xs={12} sm={6} md={6} lg={6}>
            <Image
              src="/index_6_nobg.png"
              alt="use_cases"
              width={600}
              height={600}
            />
          </Grid>
        </Grid>

        <Grid
          container
          alignItems="center"
          sx={{
            backgroundColor: "rgba(72, 61, 139, 0.2)",
          }}
          mb={6}
        >
          <Grid item xs={12} sm={12} md={6} lg={6} pl={2}>
            <Typography variant="h3" mb={2}>
              Contribute to JamiiBallots
            </Typography>
            <Typography variant="h5" mb={2}>
              Jammi ballots is an open source project and as such anyone can
              chip in and contribute to the growth of Jaii Ballots.
            </Typography>
            <>
              <Button>How to Contribute</Button>
              <Button>
                {" "}
                <GitHubIcon /> Github
              </Button>
            </>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Image
              src="/index_8_nobg.png"
              alt="use_cases"
              width={600}
              height={600}
            />
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default Home;
