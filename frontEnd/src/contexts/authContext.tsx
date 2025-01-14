import { AuthInitStateI, AuthDataI, AuthContextI } from "@/models/auth";
import { ActionI, ProviderProps } from "@/models/context";
import { createContext, useContext, useReducer, useEffect } from "react"
import { REGISTER, LOGIN, LOGOUT, ERROR_MESSAGE, GET_USERS, registerAction, loginAction, logoutAction, errorMessageAction, getUsersAction } from "./authAction";
import { registerApi, loginApi, logoutApi, refreshToken } from "@/api/auth";
import { fetchUsers } from "@/api/general";

const initialState: AuthInitStateI = {
  email: null,
  isAuthenticated: false,
  refresh_token: null,
  errorState: null,
  errorMessage: null,
  users: []
}

const reducer = (state: AuthInitStateI ,action: ActionI) => {
  switch (action.type) {
    case REGISTER:
      return {...state, email: action.payload.email}
    case LOGIN:
      return {...state, email: action.payload.email, isAuthenticated: true}
    case LOGOUT:
      return {...state, email: null, isAuthenticated: false}
    case ERROR_MESSAGE:
      return {...state, errorMessage: action.payload.message}
    case GET_USERS:
      return {...state, users: action.payload.users}
    default:
      return state
  }
}

export const AuthContext = createContext<AuthContextI|null>(null);

export const AuthProvider: React.FC<ProviderProps> = ({children}) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("is_authenticated") || false;
    const userEmail = localStorage.getItem("user_email") || null;
    
    if (userEmail && isAuthenticated) {
      dispatch(loginAction({email: userEmail}));
    }

    if (isAuthenticated) {
      refTokenRegularly();
    }
  }, []);

  const refTokenRegularly = () => {
    refreshToken();
    setTimeout(refTokenRegularly, 60000)
  }

  const reg = async (authData: AuthDataI) => {
    try {
      const res = await registerApi(authData);
      if (res.success && res.success.user) {
        const user = res.success.user;
        const email = user.email;
        dispatch(registerAction({email}));
      } 
    } catch (error: any) {
      if (error.response?.data?.error?.message)
        dispatch(errorMessageAction({message: error.response.data.error.message}));
    }
  }

  const login = async (authData: AuthDataI) => {
    try {
      const res = await loginApi(authData);
      if (res.success && res.success.user) {
        const user = res.success.user;
        const email = user.email;
        const refTok = user.refresh_token;
        dispatch(loginAction({email}));
        localStorage.setItem("is_authenticated", JSON.stringify(true));
        localStorage.setItem("user_email", email);
        localStorage.setItem("refresh_token", refTok);
      }
    } catch (error: any) {
      if (error.response?.data?.error?.message)
        dispatch(errorMessageAction({message: error.response.data.error.message}));
    }
  }

  const logout = async() => {
    try {
      const res = await logoutApi();
      if (res.success && res.success.message) {
        dispatch(logoutAction());
        localStorage.removeItem("is_authenticated");
        localStorage.removeItem("user_email");
      } 
    } catch (error: any) {
      if (error.response?.data?.error?.message)
        dispatch(errorMessageAction({message: error.response.data.error.message}));
    }
  }

  const clearError = () => {
    dispatch(errorMessageAction({message: null}));
  }

  const getUsers = async () => { 
    try {
      const users = await fetchUsers();
      dispatch(getUsersAction({users}));
    } catch (error) {
      console.log("Error while fetching users");
    }
  }

  return <AuthContext.Provider value={{state, login, logout, reg, clearError, getUsers}}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}