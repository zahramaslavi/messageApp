import { AuthDataI } from "@/models/auth";
import { authApiClient } from "./apiClient";


export const loginApi = async (loginData: AuthDataI) => {
  try {
    const res = await authApiClient.post("/login/", loginData);
    return res.data;
  } catch (error: any) {
    console.log("Failed to login: ", error);
    throw error;
  }
}

export const registerApi = async (registerData: AuthDataI) => {
  try {
    const res = await authApiClient.post("/register/", registerData);
    return res.data;
  } catch(error: any) {
    console.log("Failed to register: ", error);
    throw error;
  }
}

export const logoutApi = async () => {
  try {
    const res = await authApiClient.post("/logout/");
    return res.data;
  } catch(error: any) {
    console.log("Failed to logout: ", error);
    throw error
  }
}

export const refreshToken = async () => {
  try {
    const res = await authApiClient.post("/token/");
    return res.data;
  } catch(error: any) {
    console.log("Failed to refresh token: ", error);
    throw error;
  }
}

export const githubLoginCallbackApi = async (code: string) => {
  try {
    const res = await authApiClient.get(`/auth/github/callback/${code}`);
    return res.data;
  } catch(error: any) {
    console.log("Failed to login with github: ", error);
    throw error;
  }
}

