import React, {useEffect, useState} from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthContext } from "../contexts/authContext";
import { AuthDataI } from "@/models/auth";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const {state, login} = useAuthContext();

  useEffect(() => {
    if (state.isAuthenticated) {
      reset();
    }
  }, [state]);

  const handlLogin = async (data: any) => {
    console.log(data);
    const { email, password } = data;
    login({email, password});
    reset();
  }

  return (
      <Box
        sx={{
          margin: 4
        }}
      >
        {!state.isAuthenticated && 
          ( 
            <Box sx={{display: "flex", flexDirection: "column"}}>
              <Typography variant="h5" gutterBottom>
                Login Form
              </Typography>
              <form onSubmit={handleSubmit(handlLogin)}>
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
                        Email is required.
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
                    <Button type="submit" variant="contained">Login</Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )
        }

        {state.email && state.isAuthenticated && (
            <Typography variant="h4" gutterBottom>
                You are signed in {state.email}
            </Typography>
        )}
      </Box>
  )
}

export default Login;
