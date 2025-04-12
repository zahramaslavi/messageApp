
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import Register from './components/register';
import Login from './components/login';
import Users from './components/users';
import Chat from './components/chat';
import GithubCallback from './components/githubCallback';
import { useAuthContext } from './contexts/authContext';
import { MessageProvider } from './contexts/messageContext';

const AppRoutes = () => {
  const { authState } = useAuthContext();

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
          <MessageProvider>
            <Users></Users>
          </MessageProvider>
        }>
        </Route>
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={
          <MessageProvider>
            <Chat></Chat>
          </MessageProvider>
        }>
        </Route>
      </Route>
      
    </Routes>
  );
}

export default AppRoutes;