import { useRouter } from "expo-router";
import { useCallback } from "react";

import {
  resetRootRoute,
  type RootRouteHref,
} from "../services/sessionRouting";

export const useRootRouteReset = () => {
  const router = useRouter();

  return useCallback(
    (href: RootRouteHref) => {
      resetRootRoute(router, href);
    },
    [router]
  );
};
