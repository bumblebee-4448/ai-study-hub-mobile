export type UserRole = 'student' | 'admin' | 'moderator';
export type AccountStatus = 'ACTIVE' | 'BANNED' | 'UNVERIFIED' | 'DELETED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  university?: string;
  major?: string;
  status?: AccountStatus;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  user: User | null;
  isLoginPromptOpen: boolean;
  _hasHydrated: boolean;
  setAuth: (accessToken: string, role: UserRole, user?: User, refreshToken?: string) => void;
  logout: () => void;
  setLoginPromptOpen: (open: boolean) => void;
  setHydrated: (state: boolean) => void;
}
