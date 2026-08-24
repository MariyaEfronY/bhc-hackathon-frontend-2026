export interface UserProfile {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  picture?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
}
