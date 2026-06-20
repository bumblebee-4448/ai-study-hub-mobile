import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, ChevronLeft, Link, Save, User } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenSafeAreaView } from "@/components/screen-safe-area-view";
import { SCREEN_CONTENT_TOP_PADDING } from "@/constants/safeArea";
import { useAppTheme, type AppThemeColors } from "@/features/theme";
import {
  EditProfileFormSchema,
  EditProfileFormType,
} from "../schemas/profileSchema";
import { getProfileErrorMessage } from "../services/profileService";
import { useProfile } from "../hooks/useProfile";

interface EditProfileScreenProps {
  onBack?: () => void;
  onSaved?: () => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  onBack,
  onSaved,
}) => {
  const { profile, isLoading, saveProfile } = useProfile();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormType>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      name: profile?.name ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    },
  });

  const avatarUrl = watch("avatarUrl");

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        avatarUrl: profile.avatarUrl ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = useCallback(
    async (data: EditProfileFormType) => {
      setIsSaving(true);

      try {
        await saveProfile(data);
        Alert.alert("Thành công", "Hồ sơ đã được cập nhật.", [
          { text: "OK", onPress: onSaved ?? onBack },
        ]);
      } catch (error) {
        Alert.alert("Lỗi", getProfileErrorMessage(error));
      } finally {
        setIsSaving(false);
      }
    },
    [onBack, onSaved, saveProfile]
  );

  if (isLoading && !profile) {
    return (
      <ScreenSafeAreaView style={styles.container}>
        <View style={styles.stateBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.stateText}>Đang tải hồ sơ...</Text>
        </View>
      </ScreenSafeAreaView>
    );
  }

  return (
    <ScreenSafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Cài đặt tài khoản</Text>
            <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
          </View>
        </View>

        <View style={styles.avatarPreview}>
          <View style={styles.avatarBox}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <User size={38} color={colors.primary} />
            )}
            <View style={styles.cameraIcon}>
              <Camera size={18} color={colors.onPrimary} />
            </View>
          </View>
          <Text style={styles.avatarHint}>Dán liên kết ảnh đại diện bên dưới.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Họ và tên</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onBlur, onChange, value } }) => (
                <View style={styles.inputShell}>
                  <User size={18} color={colors.icon} />
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="VD: Nguyễn Văn A"
                    placeholderTextColor={colors.textSubtle}
                    editable={!isSaving}
                  />
                </View>
              )}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            ) : null}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Liên kết ảnh đại diện</Text>
            <Controller
              control={control}
              name="avatarUrl"
              render={({ field: { onBlur, onChange, value } }) => (
                <View style={styles.inputShell}>
                  <Link size={18} color={colors.icon} />
                  <TextInput
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="https://example.com/avatar.png"
                    placeholderTextColor={colors.textSubtle}
                    editable={!isSaving}
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>
              )}
            />
            {errors.avatarUrl ? (
              <Text style={styles.errorText}>{errors.avatarUrl.message}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSaving}
            activeOpacity={0.82}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <>
                <Save size={20} color={colors.onPrimary} />
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenSafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: SCREEN_CONTENT_TOP_PADDING,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    gap: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 13,
    color: colors.textSubtle,
  },
  title: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  avatarPreview: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarBox: {
    width: 104,
    height: 104,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  cameraIcon: {
    position: "absolute",
    right: -7,
    bottom: -7,
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarHint: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textSubtle,
  },
  form: {
    gap: 18,
  },
  fieldBlock: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  inputShell: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    color: colors.text,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.danger,
  },
  saveButton: {
    height: 52,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.onPrimary,
  },
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    color: colors.textSubtle,
  },
});
