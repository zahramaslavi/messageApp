import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

const TopAppBar = () => {
  const {state, logout} = useAuthContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            General
          </Typography>

          {!state.isAuthenticated && (
            <Button color="inherit"><Link to="/Login" style={{ color: "#FFF", textDecoration: "none" }}>Login</Link></Button>
          )}

          {!state.email && (
            <Button color="inherit"><Link to="/Register" style={{ color: "#FFF", textDecoration: "none" }}>Register</Link></Button>
          )}

          {state.isAuthenticated && state.email &&
            <Button color="inherit">{state.email}</Button>
          }

          {state.isAuthenticated && (
            <Button color="inherit" onClick={logout}>Logout</Button>
          )}

          {state.isAuthenticated && (
            <Button color="inherit"><Link to="/Users" style={{ color: "#FFF", textDecoration: "none" }}>Users</Link></Button>
          )}
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopAppBar;