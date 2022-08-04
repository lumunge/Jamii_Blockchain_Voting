import { useState } from "react";
// import useMedia from "../utils/useMedia";
import Head from "next/head";
import Link from "next/link";
import useLocalStorage from "use-local-storage";

import { useDispatch } from "react-redux";

import { useMedia } from "../hooks/useMedia";
import { add_theme } from "../store/theme_slice";

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
import LanguageIcon from "@mui/icons-material/Language";

import { nav_items_map } from "../utils/functions";

const Navbar = (props) => {
  const dispatch = useDispatch();

  const drawerWidth = 240;
  const nav_items = ["Use Cases", "Success Stories", "Help Center", "Blog"];
  const defaultDark = useMedia("(prefers-color-scheme: dark)").matches;
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, set_theme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switch_theme = () => {
    const new_theme = theme === "light" ? "dark" : "light";
    dispatch(add_theme(new_theme));
    set_theme(new_theme);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
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

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar component="nav" sx={{ backgroundColor: "#fff" }}>
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
            <Box
              //   sx={{ flexGrow: 1 }}
              sx={{ display: { xs: "none", sm: "block" }, flexGrow: 1 }}
            >
              {nav_items.map((item) => (
                <Link href={nav_items_map.get(item)}>
                  <Button
                    key={item}
                    sx={{
                      //   display: { sm: "none" },
                      flexGrow: 1,
                      color: "#11111f",
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
                    color: "#11111f",
                    textTransform: "capitalize",
                    backgroundColor: "#78d64b",
                    padding: "10px 1rem",
                  }}
                >
                  Get Started
                </Button>
              </Link>
              {theme === "dark" ? (
                <Button onClick={switch_theme}>
                  <DarkModeOutlinedIcon sx={{ color: "#fff" }} />
                </Button>
              ) : (
                <Button onClick={switch_theme}>
                  <LightModeOutlinedIcon sx={{ color: "#000" }} />
                </Button>
              )}
              <Button>
                <LanguageIcon sx={{ color: "#000" }} />
              </Button>
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
      </Box>
    </>
  );
};

export default Navbar;
