import { AuthDataI } from "@/models/auth";

export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const ERROR_MESSAGE = "error_message";
export const GET_USERS = "get_users";
export const CHECK_AUTH = "check_auth";

interface AuthActionDataI {
  email?: string,
  username?: string,
}


export const loginAction = (loginData: AuthActionDataI) => ({type: LOGIN, payload: loginData});
export const registerAction = (registerData: AuthActionDataI) => ({type: REGISTER, payload: registerData});
export const logoutAction = () => ({type: LOGOUT});
export const errorMessageAction = (errorMessageData: {message: String | null, status: String | null}) => ({type: ERROR_MESSAGE, payload: errorMessageData});
export const getUsersAction = (usersData: {users:any[]}) => ({type: GET_USERS, payload: usersData});
export const checkAuthAction = (checkAuthData: boolean) => ({type: CHECK_AUTH, payload: {checkingAuth:checkAuthData}});