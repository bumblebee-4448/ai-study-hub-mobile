import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "@/features/profile/store/profileStore";
import { LoginSchema, LoginFormType } from "../schemas/authSchema";

interface LoginScreenProps {
  onSignUpPress?: () => void;
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSignUpPress,
  onSuccess,
}) => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { setProfile } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormType) => {
      setIsSubmitting(true);
      try {
        // Mock authentication delay
        await new Promise<void>((resolve) => setTimeout(resolve, 1200));

        // ── Mock moderator account ──────────────────────────────────────
        const isModerator =
          data.email.toLowerCase() === "moderator@academishare.com" &&
          data.password === "Moderator@123";

        if (isModerator) {
          setAuth(
            "mock-access-token-mod",
            "moderator",
            {
              id: "mod-001",
              name: "Moderator AcademiShare",
              email: data.email,
              avatarUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAOdq3b_ELYMC3GxquZ7RauzvzJ1pHpMfQQrorUfffyd_17r085qf5-VDo_tbKXmF7wHmykjJTozbpZ1TVNWoFmCwhZDY1dnPGSwk2XO-8bo-kYFGg-_BZqDhSl37KgNuJRR8jaqk4y-7pWYY09g8q--SUumhwSPTxLbMb5m84GyF68wDcKUE1AsUixdGwr9QeL4zaC2sAvFTWbPk0oMt2v9Rd-qCdCDR0sJUgAjYmwtjT5NJnGazypV9ma9i_j8OnIIMkdTuQ34E0",
              university: "AcademiShare Platform",
              major: "Content Moderation",
            },
            "mock-refresh-token-mod"
          );

          setProfile({
            id: "mod-001",
            name: "Moderator AcademiShare",
            university: "AcademiShare Platform",
            yearMajor: "Moderator",
            avatarUrl:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAOdq3b_ELYMC3GxquZ7RauzvzJ1pHpMfQQrorUfffyd_17r085qf5-VDo_tbKXmF7wHmykjJTozbpZ1TVNWoFmCwhZDY1dnPGSwk2XO-8bo-kYFGg-_BZqDhSl37KgNuJRR8jaqk4y-7pWYY09g8q--SUumhwSPTxLbMb5m84GyF68wDcKUE1AsUixdGwr9QeL4zaC2sAvFTWbPk0oMt2v9Rd-qCdCDR0sJUgAjYmwtjT5NJnGazypV9ma9i_j8OnIIMkdTuQ34E0",
            documentCount: 0,
            savedCount: 0,
            points: 0,
          });
        } else {
          // ── Regular user account ────────────────────────────────────────
          setAuth(
            "mock-access-token-xyz",
            "user",
            {
              id: "user-001",
              name: "Nguyễn Văn A",
              email: data.email,
              avatarUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuByChcQ0XwJZE7ksDTDKK-d6leBoSCIpKJxnQGdxZX9s1Ai_dywhkwWtVXxQ67QZVEDBVwOIymfGb8dteXSO5w_L3S3NXtPl-DG6rWfCYFJWKQr-IJhRH7LrI2MejDxLUeSGX3eYrwFuboLtXR-rLII6GQvJ-Ln2lFUM3hgldUii1oCouxPVqTcIyiETtvwO61CT-qUBGle-Lca3bCK6mRSaMotdAi_2wOOgPB6xy-Ab7uJcXNrKX1brKh6rqCbsrSI81BQTvUIB50",
              university: "Sinh viên Đại học Khoa học",
              major: "Công nghệ thông tin",
            },
            "mock-refresh-token-xyz"
          );

          setProfile({
            id: "user-001",
            name: "Nguyễn Văn A",
            university: "Sinh viên Đại học Khoa học",
            yearMajor: "Năm 3 - Công nghệ thông tin",
            avatarUrl:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuByChcQ0XwJZE7ksDTDKK-d6leBoSCIpKJxnQGdxZX9s1Ai_dywhkwWtVXxQ67QZVEDBVwOIymfGb8dteXSO5w_L3S3NXtPl-DG6rWfCYFJWKQr-IJhRH7LrI2MejDxLUeSGX3eYrwFuboLtXR-rLII6GQvJ-Ln2lFUM3hgldUii1oCouxPVqTcIyiETtvwO61CT-qUBGle-Lca3bCK6mRSaMotdAi_2wOOgPB6xy-Ab7uJcXNrKX1brKh6rqCbsrSI81BQTvUIB50",
            documentCount: 12,
            savedCount: 48,
            points: 156,
          });
        }

        Alert.alert("Thành công", "Đăng nhập thành công!", [
          {
            text: "OK",
            onPress: () => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.replace("/(tabs)/profile");
              }
            },
          },
        ]);
      } catch {
        Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, setAuth, setProfile, onSuccess]
  );


  const handleGoogleLogin = useCallback(() => {
    Alert.alert("Thông báo", "Tính năng đăng nhập Google đang được phát triển.");
  }, []);

  const handleFacebookLogin = useCallback(() => {
    Alert.alert("Thông báo", "Tính năng đăng nhập Facebook đang được phát triển.");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>AcademiShare</Text>
            <Text style={styles.subtitle}>Hệ thống học liệu</Text>
          </View>

          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.outline}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="next"
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.fieldError}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password Field */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.inputWithIcon,
                        errors.password && styles.inputError,
                      ]}
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      autoComplete="password"
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      style={styles.inputIcon}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      accessibilityLabel="Toggle password visibility"
                    >
                      <Ionicons
                        name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={COLORS.outline}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.fieldError}>{errors.password.message}</Text>
              )}
              <View style={styles.forgotPasswordRow}>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS["on-primary"]} size="small" />
              ) : (
                <Text style={styles.signInBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={handleGoogleLogin}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={handleFacebookLogin}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Text
                style={styles.signUpLink}
                onPress={onSignUpPress || (() => router.push("/register"))}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS["surface-container-lowest"],
    borderColor: COLORS["outline-variant"],
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xl,
    gap: SPACING.xl,
    elevation: 2,
    shadowColor: "#191b23",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  header: {
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  title: {
    ...TYPOGRAPHY["headline-lg-mobile"],
    color: COLORS.primary,
    fontWeight: "700",
  },
  subtitle: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
  },
  form: {
    gap: SPACING.lg,
  },
  fieldBlock: {
    gap: SPACING.base,
  },
  label: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface"],
    fontWeight: "500",
  },
  input: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  inputWrapper: {
    position: "relative",
  },
  inputWithIcon: {
    paddingRight: 44,
  },
  inputIcon: {
    position: "absolute",
    right: SPACING.md,
    top: "50%",
    transform: [{ translateY: -10 }],
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginTop: SPACING.sm,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.primary,
  },
  signInBtn: {
    backgroundColor: COLORS["primary-container"],
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.base,
  },
  signInBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary-container"],
  },
  btnDisabled: {
    opacity: 0.65,
  },
  fieldError: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.error,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS["outline-variant"],
  },
  dividerText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  socialContainer: {
    gap: SPACING.md,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: COLORS["surface-container-lowest"],
    borderColor: COLORS["outline-variant"],
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.md,
  },
  socialBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  footer: {
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  footerText: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
  },
  signUpLink: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.primary,
    fontWeight: "600",
  },
});
