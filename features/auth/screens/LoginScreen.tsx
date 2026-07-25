import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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

import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAppTheme, type AppThemeColors } from "@/features/theme";
import { useLogin } from "../hooks/useLogin";
import { LoginSchema, LoginFormType } from "../schemas/authSchema";
import { getAuthErrorMessage } from "../services/authService";

interface LoginScreenProps {
  onSignUpPress?: () => void;
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSignUpPress,
  onSuccess,
}) => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const loginMutation = useLogin();
  const isSubmitting = loginMutation.isPending;
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
      try {
        const result = await loginMutation.mutateAsync(data);

        if (onSuccess) {
          onSuccess();
          return;
        }

        router.replace(result.homeRoute as any);
      } catch (error) {
        console.error("[Login Error Details]:", error);
        Alert.alert("Đăng nhập thất bại", getAuthErrorMessage(error));
      }
    },
    [loginMutation, onSuccess, router]
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
            <Text style={styles.title}>AcademicShare</Text>
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
                    placeholder="Nhập email của bạn"
                    placeholderTextColor={colors.textSubtle}
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
              <Text style={styles.label}>Mật khẩu</Text>
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
                      placeholder="Nhập mật khẩu của bạn"
                      placeholderTextColor={colors.textSubtle}
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
                        color={colors.icon}
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
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
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
                <ActivityIndicator color={colors.onPrimary} size="small" />
              ) : (
                <Text style={styles.signInBtnText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Hoặc tiếp tục bằng</Text>
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
              Chưa có tài khoản?{" "}
              <Text
                style={styles.signUpLink}
                onPress={onSignUpPress || (() => router.push("/register"))}
              >
                Đăng ký
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xl,
    gap: SPACING.xl,
    elevation: 2,
    shadowColor: colors.shadow,
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
    color: colors.primary,
    fontWeight: "700",
  },
  subtitle: {
    ...TYPOGRAPHY["body-md"],
    color: colors.textSubtle,
  },
  form: {
    gap: SPACING.lg,
  },
  fieldBlock: {
    gap: SPACING.base,
  },
  label: {
    ...TYPOGRAPHY["label-sm"],
    color: colors.text,
    fontWeight: "500",
  },
  input: {
    ...TYPOGRAPHY["body-md"],
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  inputError: {
    borderColor: colors.danger,
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
    color: colors.primary,
  },
  signInBtn: {
    backgroundColor: colors.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.base,
  },
  signInBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: colors.onPrimary,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  fieldError: {
    ...TYPOGRAPHY["label-sm"],
    color: colors.danger,
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
    backgroundColor: colors.border,
  },
  dividerText: {
    ...TYPOGRAPHY["label-sm"],
    color: colors.textSubtle,
  },
  socialContainer: {
    gap: SPACING.md,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.md,
  },
  socialBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: colors.text,
  },
  footer: {
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  footerText: {
    ...TYPOGRAPHY["body-md"],
    color: colors.textSubtle,
  },
  signUpLink: {
    ...TYPOGRAPHY["label-md"],
    color: colors.primary,
    fontWeight: "600",
  },
});
