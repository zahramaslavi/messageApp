export interface AuthDataI {
  email?: string,
  password?: string
};


export interface AuthInitStateI {
  email: string | null,
  username: string | null,
  isAuthenticated: boolean | null,
  checkingAuth: boolean,
  refresh_token: string | null,
  errorStatus: null | number,
  errorMessage: null | String,
}

export interface AuthContextI {
  authState: AuthInitStateI
  reg: (authData: AuthDataI) => void,
  login: (authData: AuthDataI) => void,
  logout: () => void,
  clearError: () => void,
  githubCallback: (code: string) => void
}

