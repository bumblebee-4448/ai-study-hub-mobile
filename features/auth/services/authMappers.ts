import type { UserProfile } from "../../profile/types";
import type { AccountStatus, User, UserRole } from "../types";

export type BackendUserRole = "USER" | "ADMIN" | "MODERATOR";

export interface CurrentUserResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: BackendUserRole | string;
  status?: AccountStatus;
  createdAt?: string;
}

export const mapBackendRole = (role: string): UserRole => {
  switch (role) {
    case "USER":
      return "student";
    case "ADMIN":
      return "admin";
    case "MODERATOR":
      return "moderator";
    default:
      throw new Error(`Unsupported user role: ${role}`);
  }
};

export const getHomeRouteForRole = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "/(admin-tabs)";
    case "moderator":
      return "/(moderator-tabs)";
    case "student":
    default:
      return "/(student-tabs)";
  }
};

export const mapCurrentUserToAuthUser = (user: CurrentUserResponse): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl || undefined,
  status: user.status,
});

export const mapCurrentUserToProfile = (
  user: CurrentUserResponse
): UserProfile => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatarUrl: user.avatarUrl || undefined,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});
