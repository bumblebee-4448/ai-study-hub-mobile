import React from "react";
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";

import { SCREEN_SAFE_AREA_EDGES } from "@/constants/safeArea";

export function ScreenSafeAreaView({
  edges = SCREEN_SAFE_AREA_EDGES,
  style,
  ...props
}: SafeAreaViewProps) {
  return <SafeAreaView edges={edges} style={[styles.container, style]} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
