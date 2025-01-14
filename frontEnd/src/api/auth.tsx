import { authApiClient } from "./apiClient";

// duplicate - move to models
interface LoginDataI {
  email?: String,
  password?: String
}
// duplicate
interface RegisterDataI {
  name?: String,
  email?: String,
  password?: String
}

export const loginApi = async (loginData: LoginDataI) => {
  console.log(loginData.email)
  try {
    const res = await authApiClient.post("/login/", loginData);
    return res.data;
  } catch (error) {
    console.log("Failed to login: ", error);
    throw error;
  }
}

export const registerApi = async (registerData: RegisterDataI) => {
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
    throw new Error(error.response.data);
  }
}

export const refreshToken = async () => {
  try {
    const res = await authApiClient.post("/token/");
    return res.data;
  } catch(error: any) {
    console.log("Failed to refres htoken: ", error);
    throw new Error(error.response.data);
  }
}

