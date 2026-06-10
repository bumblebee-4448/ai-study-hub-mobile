import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import { RegisterSchema, RegisterFormType } from "../schemas/authSchema";

interface RegisterScreenProps {
  onSignInPress?: () => void;
  onSuccess?: () => void;
  onBackPress?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onSignInPress,
  onSuccess,
  onBackPress,
}) => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { setProfile } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    async (data: RegisterFormType) => {
      setIsSubmitting(true);
      try {
        // Mock registration delay
        await new Promise<void>((resolve) => setTimeout(resolve, 1500));

        // Auto-login after register
        setAuth(
          "mock-access-token-xyz",
          "user",
          {
            id: "user-001",
            name: data.fullname,
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
          name: data.fullname,
          university: "Sinh viên Đại học Khoa học",
          yearMajor: "Năm 3 - Công nghệ thông tin",
          avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuByChcQ0XwJZE7ksDTDKK-d6leBoSCIpKJxnQGdxZX9s1Ai_dywhkwWtVXxQ67QZVEDBVwOIymfGb8dteXSO5w_L3S3NXtPl-DG6rWfCYFJWKQr-IJhRH7LrI2MejDxLUeSGX3eYrwFuboLtXR-rLII6GQvJ-Ln2lFUM3hgldUii1oCouxPVqTcIyiETtvwO61CT-qUBGle-Lca3bCK6mRSaMotdAi_2wOOgPB6xy-Ab7uJcXNrKX1brKh6rqCbsrSI81BQTvUIB50",
          documentCount: 0,
          savedCount: 0,
          points: 10, // Starting bonus points
        });

        Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
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
        Alert.alert("Lỗi", "Đăng ký thất bại. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, setAuth, setProfile, onSuccess]
  );

  const handleGoogleRegister = useCallback(() => {
    Alert.alert("Thông báo", "Tính năng đăng ký qua Google đang được phát triển.");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBackPress || (() => router.back())}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS["on-surface-variant"]} />
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>

        {/* Header App Brand */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Ionicons name="school" size={28} color={COLORS.primary} />
            <Text style={styles.brandText}>AcademiShare</Text>
          </View>
          <Text style={styles.title}>Đăng ký</Text>
          <Text style={styles.subtitle}>
            Tham gia cộng đồng học thuật lớn nhất để chia sẻ tri thức.
          </Text>
        </View>

        {/* Form Container Card */}
        <View style={styles.card}>
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Họ và tên</Text>
              <Controller
                control={control}
                name="fullname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.inputWithLeftIcon,
                        errors.fullname && styles.inputError,
                      ]}
                      placeholder="Nguyễn Văn A"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS["on-surface-variant"]}
                      style={styles.leftIcon}
                    />
                  </View>
                )}
              />
              {errors.fullname && (
                <Text style={styles.fieldError}>{errors.fullname.message}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.inputWithLeftIcon,
                        errors.email && styles.inputError,
                      ]}
                      placeholder="example@email.com"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={COLORS["on-surface-variant"]}
                      style={styles.leftIcon}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.fieldError}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password */}
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
                        styles.inputWithLeftIcon,
                        styles.inputWithRightIcon,
                        errors.password && styles.inputError,
                      ]}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={COLORS["on-surface-variant"]}
                      style={styles.leftIcon}
                    />
                    <TouchableOpacity
                      style={styles.rightIcon}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      accessibilityLabel="Toggle password visibility"
                    >
                      <Ionicons
                        name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={COLORS["on-surface-variant"]}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.fieldError}>{errors.password.message}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.inputWithLeftIcon,
                        errors.confirmPassword && styles.inputError,
                      ]}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      returnKeyType="done"
                    />
                    <MaterialCommunityIcons
                      name="lock-reset"
                      size={20}
                      color={COLORS["on-surface-variant"]}
                      style={styles.leftIcon}
                    />
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.fieldError}>{errors.confirmPassword.message}</Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS["on-primary"]} size="small" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Đăng ký</Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS["on-primary"]} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Social Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Hoặc đăng ký nhanh bằng</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Register Button */}
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={handleGoogleRegister}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text style={styles.socialBtnText}>Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Đã có tài khoản?{" "}
            <Text
              style={styles.loginLink}
              onPress={onSignInPress || (() => router.push("/login"))}
            >
              Đăng nhập
            </Text>
          </Text>
        </View>

        <View style={{ height: SPACING.xl }} />
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
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.xl,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.base,
    alignSelf: "flex-start",
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.base,
    paddingRight: SPACING.lg,
  },
  backBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    gap: SPACING.base,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.base,
    marginBottom: SPACING.sm,
  },
  brandText: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS.primary,
    fontWeight: "700",
  },
  title: {
    ...TYPOGRAPHY["headline-lg-mobile"],
    color: COLORS["on-surface"],
    fontWeight: "700",
  },
  subtitle: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS["surface-container-lowest"],
    borderColor: COLORS["outline-variant"],
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.xl,
    elevation: 2,
    shadowColor: "#191b23",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  form: {
    gap: SPACING.lg,
  },
  fieldBlock: {
    gap: SPACING.base,
  },
  label: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
    fontWeight: "500",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
  },
  inputWithLeftIcon: {
    paddingLeft: 42,
    paddingRight: SPACING.lg,
  },
  inputWithRightIcon: {
    paddingRight: 44,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  leftIcon: {
    position: "absolute",
    left: SPACING.md,
  },
  rightIcon: {
    position: "absolute",
    right: SPACING.md,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    marginTop: SPACING.base,
  },
  submitBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
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
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: COLORS.surface,
    borderColor: COLORS["outline-variant"],
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
  },
  socialBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  footer: {
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  footerText: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
  },
  loginLink: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.primary,
    fontWeight: "700",
  },
});
