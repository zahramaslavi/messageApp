

import React, {useEffect} from 'react';
import {Box, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/authContext';

const GithubCallback = () => { 
  const {state, githubCallback} = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      githubCallback(code);
    } 
  }, []);

  useEffect(() => {
    console.log(state)
    if (state.isAuthenticated) {
      navigate('/users');
    }

    if (state.errorMessage) {
      console.log(state.errorMessage, state.errorStatus)
    }
  }, [state]);
  
  return (<Box>
    <Typography variant="h5" gutterBottom>
      Authenticating with Github...
    </Typography>
  </Box>
  );
}

export default GithubCallback;