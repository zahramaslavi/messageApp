
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import Register from './components/register';
import Login from './components/login';
import Users from './components/users';
import Chat from './components/chat';
import GithubCallback from './components/githubCallback';
import { useAuthContext } from './contexts/authContext';

const AppRoutes = () => {
  const { state } = useAuthContext();

  return (
    <Routes>
      <Route path="/login" element={
        <Login></Login>
      }>
      </Route>

      <Route path="/auth/github/callback" element={
        <GithubCallback></GithubCallback>
      }>
      </Route>

      <Route path="/register" element={
        <Register></Register>
      }>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/users" element={
          <Users></Users>
        }>
        </Route>
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={
          <Chat></Chat>
        }>
        </Route>
      </Route>
      
    </Routes>
  );
}

export default AppRoutes;