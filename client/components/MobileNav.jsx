import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { add_theme } from "../store/theme_slice";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  Divider,
} from "@mui/material";

// icons
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

// components
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";

// stylesheet
import styles from "../styles/create_ballot.module.css";

const MobileNav = (props) => {
  const dispatch = useDispatch();

  const drawerWidth = 240;
  const { window } = props;

  const current_theme = useSelector((state) => state.theme.current_theme);

  const switch_theme = () => {
    const new_theme = current_theme === "light" ? "dark" : "light";
    dispatch(add_theme(new_theme));
  };

  const [left_open, set_left_open] = useState(false);
  const [right_open, set_right_open] = useState(false);

  const handle_left_side_bar = () => {
    set_left_open(!left_open);
  };

  const handle_right_side_bar = () => {
    set_right_open(!right_open);
  };

  const left_drawer = (
    <Box onClick={handle_left_side_bar} sx={{ textAlign: "center" }}>
      <Divider />
      <LeftSideBar />
    </Box>
  );

  const right_drawer = (
    <Box onClick={handle_right_side_bar} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Jamii Ballots
      </Typography>
      <Divider />
      <RightSideBar />
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: { sm: "none" } }} mb={4}>
      <AppBar component="nav" className={styles.navbar}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handle_left_side_bar}
            sx={{ display: { sm: "none" } }}
          >
            {" "}
            <MenuIcon />
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handle_right_side_bar}
            sx={{ display: { sm: "none" } }}
          >
            {" "}
            <SettingsOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          anchor="left"
          container={container}
          variant="temporary"
          open={left_open}
          onClose={handle_left_side_bar}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {left_drawer}
        </Drawer>
      </Box>

      <Box component="nav">
        <Drawer
          anchor="right"
          container={container}
          variant="temporary"
          open={right_open}
          onClose={handle_right_side_bar}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {right_drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default MobileNav;
