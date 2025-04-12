import { useAuthContext } from "@/contexts/authContext";
import { Alert, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AuthError = () => {
  const {authState, clearError} = useAuthContext();

  return (<>
    {
      authState.errorMessage &&
      <Alert severity="error" sx={{alignItems: "center"}}>
        {authState.errorMessage}
        <IconButton aria-label="close" onClick={clearError}>
          <CloseIcon />
        </IconButton>
      </Alert>
    }
  </>);
}

export default AuthError;