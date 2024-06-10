
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string
  registerCode: string | null;
}

export interface SigninRequest {
  email: string;
  password: string;
}