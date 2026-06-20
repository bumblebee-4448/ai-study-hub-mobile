import type { UserRole } from "../types";

export type RootRouteHref =
  | "/"
  | "/login"
  | "/(admin-tabs)"
  | "/(moderator-tabs)"
  | "/(student-tabs)";

export const getRouteForRole = (role: UserRole | null): RootRouteHref => {
  switch (role) {
    case "admin":
      return "/(admin-tabs)";
    case "moderator":
      return "/(moderator-tabs)";
    case "student":
      return "/(student-tabs)";
    default:
      return "/";
  }
};

export const getRedirectHrefForRole = (role: UserRole | null): RootRouteHref => {
  if (!role) {
    return "/login";
  }

  return getRouteForRole(role);
};

interface PublicRootRedirectParams {
  currentPathname: string;
  accessToken: string | null;
  role: UserRole | null;
}

export const getPublicRootRedirectHref = ({
  currentPathname,
  accessToken,
  role,
}: PublicRootRedirectParams): RootRouteHref | null => {
  if (currentPathname !== "/" || !accessToken || !role) {
    return null;
  }

  return getRedirectHrefForRole(role);
};

interface RootRouteResetRouter {
  replace: (href: any) => void;
}

export const resetRootRoute = (
  router: RootRouteResetRouter,
  href: RootRouteHref
) => {
  setTimeout(() => {
    try {
      router.replace(href as any);
    } catch (error) {
      console.error("Failed to reset root route:", error);
    }
  }, 150);
};

export const isRoleAllowed = (
  role: UserRole | null,
  allowedRoles: UserRole[]
) => {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
};
