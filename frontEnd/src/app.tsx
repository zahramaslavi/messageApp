import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HashRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import TopAppBar from './components/topAppBar';
import AppRoutes from './appRoutes';
import AuthError from './components/authError';
import GithubCallback from './components/githubCallback';
import './app.css';
import { AuthProvider } from './contexts/authContext';

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f4f4f",
    },
    success: {
      main: "#4caf50",
      light: "#dff0d8"
    },
    info: {
      main: "#2196f3",
      light: "#d9edf7"
    }
  },
});

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <TopAppBar></TopAppBar>
              <AppRoutes></AppRoutes>
              <AuthError></AuthError>
            </AuthProvider>
          </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
