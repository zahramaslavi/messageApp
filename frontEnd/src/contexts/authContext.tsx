import { AuthInitStateI, AuthDataI, AuthContextI } from "@/models/auth";
import { ActionI, ProviderProps } from "@/models/context";
import { createContext, useContext, useReducer, useEffect } from "react"
import { 
  REGISTER,
  LOGIN,
  LOGOUT,
  ERROR_MESSAGE,
  GET_USERS,
  CHECK_AUTH,
  registerAction,
  loginAction,
  logoutAction,
  errorMessageAction,
  getUsersAction,
  checkAuthAction
} from "./authAction";
import { registerApi, loginApi, logoutApi, refreshToken, githubLoginCallbackApi } from "@/api/auth";
import { fetchUsers } from "@/api/message";
import { UserI } from "@/models/user";
import errorCodes from "./errorCode";

const initialState: AuthInitStateI = {
  email: null,
  username: null,
  isAuthenticated: false,
  checkingAuth: false,
  refresh_token: null,
  errorStatus: null,
  errorMessage: null,
  users: []
}

const reducer = (state: AuthInitStateI ,action: ActionI) => {
  switch (action.type) {
    case REGISTER:
      return {...state, username: action.payload.username, email: action.payload.email}
    case LOGIN:
      return {...state, username: action.payload.username, email: action.payload.email, isAuthenticated: true}
    case LOGOUT:
      return {...state, username: null, email: null, isAuthenticated: false}
    case ERROR_MESSAGE:
      return {...state, errorMessage: action.payload.message, errorStatus: action.payload.status}
    case GET_USERS:
      return {...state, users: action.payload.users}
    case CHECK_AUTH:
      return {...state, checkingAuth: action.payload.checkingAuth}
    default:
      return state
  }
}

export const AuthContext = createContext<AuthContextI|null>(null);

export const AuthProvider: React.FC<ProviderProps> = ({children}) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(checkAuthAction(true));
    const isAuthenticated = localStorage.getItem("is_authenticated") || false;
    const username = localStorage.getItem("user_username") || null;
    const email = localStorage.getItem("user_email") || null;
    
    if (username && email && isAuthenticated) {
      dispatch(loginAction({username, email}));
      refTokenRegularly();
    }
    dispatch(checkAuthAction(false));
  }, []);

  const refTokenRegularly = async () => {
    try {
      await refreshToken();
    } catch (error) {
      console.log("Error while refreshing token", error);
      resetAuth();
    }
    setTimeout(refTokenRegularly, 60000);
    
  }

  const reg = async (authData: AuthDataI) => {
    try {
      const res = await registerApi(authData);
      if (res.success && res.success.user) {
        const user = res.success.user;
        const username = user.username;
        const email = user.email
        dispatch(registerAction({username, email}));
      } 
    } catch (error: any) {
      dispatch(errorMessageAction(getFriendlyErrorData(error)));
    }
  }

  const login = async (authData: AuthDataI) => {
    try {
      const res = await loginApi(authData);
      console.log("|||||||||||||||", res);
      if (res.success && res.success.user) {
        handleLoginInContext(res.success.user);
      }
    } catch (error: any) {
      dispatch(errorMessageAction(getFriendlyErrorData(error)));
    }
  }

  const githubCallback = async (code: string) => {
    try {
      const res = await githubLoginCallbackApi(code);
      if (res.success && res.success.user) {
        handleLoginInContext(res.success.user);
      }
    } catch (error: any) {
      console.log(error)
      dispatch(errorMessageAction(getFriendlyErrorData(error)));
    }
  }

  const handleLoginInContext = (user: UserI) => {
    const username = user.username;
    const email = user.email;
    const refTok = user.refresh_token;
    dispatch(loginAction({username}));
    localStorage.setItem("is_authenticated", JSON.stringify(true));
    username && localStorage.setItem("user_username", username);
    email && localStorage.setItem("user_email", email);
    refTok && localStorage.setItem("refresh_token", refTok);
    refTokenRegularly();
  }

  const logout = async() => {
    try {
      const res = await logoutApi();
      if (res.success && res.success.message) {
        resetAuth();
      } 
    } catch (error: any) {
      dispatch(errorMessageAction(getFriendlyErrorData(error)));
    }
  }

  const resetAuth = () => {
    dispatch(logoutAction());
    localStorage.removeItem("is_authenticated");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_username");
    localStorage.removeItem("refresh_token");
  }

  const clearError = () => {
    dispatch(errorMessageAction({message: null, status: null}));
  }

  //Todo: move this to a helper and possibly extend the error handlling to a more modular way
  const getFriendlyErrorData = (error: any) => {
    let message = "";
    let status = null;

    if (error?.response?.data?.error?.message) {
      message = error?.response?.data?.error?.message;
    } else if ( error.code && errorCodes[error.code] ) {
      message = errorCodes[error.code].friendlyMessage;
    } else {
      message = "Something went wrong - try again or contact support";
    }

    status = error.status;

    return {message, status};
  }

  const getUsers = async () => { 
    try {
      const users = await fetchUsers();
      dispatch(getUsersAction({users}));
    } catch (error) {
      console.log("Error while fetching users");
    }
  }

  return <AuthContext.Provider value={{state, login, logout, reg, clearError, getUsers, githubCallback}}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}