import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice"; // Import the setUser action

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check if screen size is below "md" breakpoint
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get the user from Redux state

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear the token from localStorage
    dispatch(setUser(null)); // Clear the user from Redux state
    handleMenuClose(); // Close the menu (if open)
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme.palette.primary.main,
        width: "100vw",
        maxWidth: "100%",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left side - Logo with Home link */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", whiteSpace: "nowrap" }}
        >
          Chatbot
        </Typography>

        {/* Right side - Navigation Buttons (or Menu on smaller screens) */}
        {isMobile ? (
          <>
            {/* Hamburger Menu Icon */}
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Menu for smaller screens */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                Home
              </MenuItem>
              <MenuItem component={Link} to="/about" onClick={handleMenuClose}>
                About Us
              </MenuItem>
              <MenuItem component={Link} to="/chat" onClick={handleMenuClose}>
                Start Chatting
              </MenuItem>
              {user ? (
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              ) : (
                <>
                  <MenuItem component={Link} to="/signin" onClick={handleMenuClose}>
                    Sign In
                  </MenuItem>
                  <MenuItem component={Link} to="/signup" onClick={handleMenuClose}>
                    Sign Up
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          /* Regular Navigation Buttons for larger screens */
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "nowrap" }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About Us
            </Button>
            <Button color="inherit" component={Link} to="/chat">
              Start Chatting
            </Button>
            {user ? (
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outlined" color="inherit" component={Link} to="/signin">
                  Sign In
                </Button>
                <Button variant="contained" color="secondary" component={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;