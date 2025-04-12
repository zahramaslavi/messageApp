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
  const { authState, logout } = useAuthContext();

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side - General links */}
        <Box>
          {authState.isAuthenticated && (
            <Button color="inherit"><Link to="/chat" style={{ color: "#FFF", textDecoration: "none" }}>Chat</Link></Button>
          )}

          {authState.isAuthenticated && (
            <Button color="inherit"><Link to="/Users" style={{ color: "#FFF", textDecoration: "none" }}>Users</Link></Button>
          )}
        </Box>
        
        {/* Right side - Auth and user links */}
        <Box>
          {!authState.isAuthenticated && (
            <Button color="inherit"><Link to="/Login" style={{ color: "#FFF", textDecoration: "none" }}>Login</Link></Button>
          )}

          {!authState.username && (
            <Button color="inherit"><Link to="/Register" style={{ color: "#FFF", textDecoration: "none" }}>Register</Link></Button>
          )}

          {authState.isAuthenticated && (
            <Button color="inherit" onClick={logout}>Logout</Button>
          )}

          {authState.isAuthenticated && authState.username &&
            <Button color="inherit">{authState.username}</Button>
          }

        </Box>
        
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;