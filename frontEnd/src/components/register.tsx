import React, {useState, useEffect} from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthContext } from "@/contexts/authContext";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const {state, reg} = useAuthContext();

  useEffect(() => {
    if (state.email) {
      reset();
    }
  }, [state]);

  const handlRegister = async (data: any) => {
    const { email, password } = data;
    reg({email, password});
  }
    
  return (
    <Box
      sx={{
        margin: 4
      }}
    >
      {
        !state.email && !state.isAuthenticated && 
        <Box sx={{display: "flex", flexDirection: "column"}}>
          <Typography variant="h5" gutterBottom>
            Register Form
          </Typography>
          <form onSubmit={handleSubmit(handlRegister)}>
            <Grid container spacing={2} sx={{display: "flex", flexDirection: "column"}}>
              <Grid size={4} offset={4}>
                <TextField
                  required
                  id="email"
                  label="Email"
                  {...register("email", { required: true })}
                />
                {
                  errors.username &&
                  <Typography color="error" variant="body2">
                    Username is required.
                  </Typography> 
                }
              </Grid>
              <Grid size={4} offset={4}>
                <TextField 
                  required
                  id="password"
                  label="Password"
                  {...register("password", { required: true })}
                />
                {
                  errors.password &&
                  <Typography color="error" variant="body2">
                    Password is required.
                  </Typography>
                }
              </Grid>
              <Grid size={4} offset={4}>
                <Button type="submit" variant="contained">Register</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      }

      {state.email && !state.isAuthenticated && (
        <Typography variant="h4" gutterBottom>
            You are registered {state.email}. Please <Link to="/Login">Login</Link>!
        </Typography>
      )}      
    </Box>
  )
}

export default Register;
