import { useState } from "react";
// import useMedia from "../utils/useMedia";
import Head from "next/head";
import Link from "next/link";
import useLocalStorage from "use-local-storage";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

import { nav_items_map } from "../utils/functions";

const useMedia = (theme) => {
  return theme;
};

const Home = (props) => {
  const { window } = props;

  const defaultDark = useMedia("(prefers-color-scheme: dark)").matches;

  const drawerWidth = 240;
  const nav_items = ["Use Cases", "Success Stories", "Help Center", "Blog"];
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, set_theme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switch_theme = () => {
    const new_theme = theme === "light" ? "dark" : "light";
    set_theme(new_theme);
    console.log(new_theme);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Jamii Blockchain Voting
      </Typography>
      <Divider />
      <List>
        {nav_items.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className={styles.container} data-theme={theme}>
      <Head>
        <title>Jamii Blockchain Voting</title>
        <meta name="description" content="A voting system on the blockchain." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            {" "}
            <MenuIcon />
          </IconButton>
          {/* <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Jamii Blockchain Voting
          </Typography> */}
          <Box
            // variant="h6"
            // component="div"
            sx={{ flexGrow: 1 }}
          >
            {nav_items.map((item) => (
              <Link href={nav_items_map.get(item)}>
                <Button
                  key={item}
                  sx={{
                    flexGrow: 1,
                    color: "#fff",
                    textTransform: "capitalize",
                  }}
                >
                  {item}
                </Button>
              </Link>
            ))}
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Link href="/create_ballot">
              <Button
                sx={{
                  flexGrow: 1,
                  color: "#fff",
                  textTransform: "capitalize",
                }}
              >
                Get Started
              </Button>
            </Link>
            {theme === "dark" ? (
              <Button onClick={switch_theme}>
                <DarkModeOutlinedIcon sx={{ color: "#000" }} />
              </Button>
            ) : (
              <Button onClick={switch_theme}>
                <LightModeOutlinedIcon sx={{ color: "#000" }} />
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#!">Jamii Blockchain Voting!</a>
        </h1>

        <p className={styles.description}>
          <code className={styles.code}>blockchain voting</code>
          <code className={styles.code}>immutability</code>
          <code className={styles.code}>transparency</code>
          <code className={styles.code}>anonymity</code>
          <code className={styles.code}>security</code>
          <code className={styles.code}>accountability</code>
          <code className={styles.code}>inclusivity</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Security &rarr;</h2>
            <p>
              Votes are secured on a public immutable database that cannot be
              changed.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Integrity &rarr;</h2>
            <p>
              No more unnecessary delays or lost ballots, Cast your vote and
              receive results right to your inbox.
            </p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Accessibility &rarr;</h2>
            <p>Voters are able to vote from anywhere in the world!</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Saves Money &rarr;</h2>
            <p>
              Blockchain voting has been shown to reduce the costs involved with
              voting from the equipment to the manpower.
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Inclusivity &rarr;</h2>
            <p>
              Any eligible party can participate in a ballot, blockchain voting
              has resulted in an increase in the voter turnout!
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Anonymity &rarr;</h2>
            <p>There is no way of knowing who cast which vote.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Transparency &rarr;</h2>
            <p>
              This ensures that the ballot and votes casted in it are
              trustworthy by storing them on an immutable blockchain.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://ethereum.org/en/dapps/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footer_details}
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image
              src="/ethereum.svg"
              alt="Ethereum Logo"
              width={72}
              height={35}
            />
          </span>
          ethereum
        </a>
      </footer>
    </div>
  );
};

export default Home;
