import React, {useEffect, useState} from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import Grid from "@mui/material/Grid2";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useAuthContext } from "../contexts/authContext";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const {state, login} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.isAuthenticated) {
      reset();
    }

    if (state.isAuthenticated) {
      navigate('/users');
    }
  }, [state]);

  const handlLogin = async (data: any) => {
    console.log(data);
    const { email, password } = data;
    login({email, password});
    reset();
  }

  const handleGithubLoginClick = () => {
    const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=Ov23lijqCsoFSay6i7Ku&redirect_uri=http://localhost:3000/auth/github/callback&scope=user:email`;

    setLoading(true);
    window.location.href = GITHUB_OAUTH_URL;
  };

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

              <Typography variant="h6" gutterBottom>
                Or authenticate with GitHub
              </Typography>

              <Button
                variant="text"
                color="primary"
                startIcon={loading ? <CircularProgress size={24} /> : <GitHubIcon />}
                onClick={handleGithubLoginClick}
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Redirecting...' : 'Continue with GitHub'}
              </Button>
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
