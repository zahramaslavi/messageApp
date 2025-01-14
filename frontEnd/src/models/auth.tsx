export interface AuthDataI {
  email?: string,
  password?: string
};


export interface AuthInitStateI {
  email: null | string,
  isAuthenticated: boolean,
  refresh_token: string | null,
  errorState: null | number,
  errorMessage: null | String,
  users: any[]
}

export interface AuthContextI {
  state: AuthInitStateI
  reg: (authData: AuthDataI) => void,
  login: (authData: AuthDataI) => void,
  logout: () => void,
  clearError: () => void,
  getUsers: () => void
}

