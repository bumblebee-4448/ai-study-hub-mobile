import React, { useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuthStore } from "../store/authStore";
import type { UserRole } from "../types";
import {
  getRedirectHrefForRole,
  isRoleAllowed,
  type RootRouteHref,
} from "../services/sessionRouting";
import { useRootRouteReset } from "../hooks/useRootRouteReset";

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  children,
}) => {
  const { accessToken, role, _hasHydrated } = useAuthStore();
  const resetToRootRoute = useRootRouteReset();
  const lastRedirectTargetRef = useRef<RootRouteHref | null>(null);
  const allowedRolesKey = allowedRoles.join(",");

  const redirectTarget = useMemo<RootRouteHref | null>(() => {
    if (!_hasHydrated) {
      return null;
    }

    if (!accessToken || !role) {
      return getRedirectHrefForRole(null);
    }

    if (!isRoleAllowed(role, allowedRoles)) {
      return getRedirectHrefForRole(role);
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, accessToken, allowedRolesKey, role]);

  useEffect(() => {
    if (!redirectTarget || lastRedirectTargetRef.current === redirectTarget) {
      return;
    }

    lastRedirectTargetRef.current = redirectTarget;
    resetToRootRoute(redirectTarget);
  }, [redirectTarget, resetToRootRoute]);

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (redirectTarget) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};
