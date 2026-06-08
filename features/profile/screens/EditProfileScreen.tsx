import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { EditProfileFormSchema, EditProfileFormType } from "../schemas/profileSchema";
import { useProfile } from "../hooks/useProfile";

const BIO_MAX_LENGTH = 150;

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  charCount?: { current: number; max: number };
}

const FormField: React.FC<FormFieldProps> = ({ label, error, children, charCount }) => (
  <View style={styles.fieldBlock}>
    <View style={styles.labelRow}>
      <Text style={styles.label}>{label}</Text>
      {charCount && (
        <Text style={styles.charCount}>
          {charCount.current}/{charCount.max}
        </Text>
      )}
    </View>
    {children}
    {error && <Text style={styles.fieldError}>{error}</Text>}
  </View>
);

interface EditProfileScreenProps {
  onBack?: () => void;
  onSaved?: () => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  onBack,
  onSaved,
}) => {
  const { profile, setProfile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [bioLength, setBioLength] = useState(
    profile?.bio?.length ?? 0
  );

  const { control, handleSubmit, formState: { errors } } = useForm<EditProfileFormType>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      name: profile?.name ?? "",
      university: profile?.university ?? "",
      major: "",
      cohort: "",
      bio: "",
    },
  });

  const onSubmit = useCallback(
    async (data: EditProfileFormType) => {
      if (!profile) return;
      setIsSaving(true);
      try {
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));
        setProfile({ ...profile, name: data.name, university: data.university ?? profile.university });
        Alert.alert("Thành công", "Hồ sơ đã được cập nhật!", [
          { text: "OK", onPress: onSaved ?? onBack },
        ]);
      } catch {
        Alert.alert("Lỗi", "Không thể cập nhật hồ sơ. Vui lòng thử lại.");
      } finally {
        setIsSaving(false);
      }
    },
    [profile, setProfile, onSaved, onBack]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS["on-surface"]} />
        </TouchableOpacity>

        <Text style={styles.logo}>AcademiShare</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Ngôn ngữ">
            <MaterialCommunityIcons name="web" size={22} color={COLORS["on-surface-variant"]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Chế độ tối">
            <Ionicons name="moon-outline" size={22} color={COLORS["on-surface-variant"]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Thông báo">
            <Ionicons name="notifications-outline" size={22} color={COLORS["on-surface-variant"]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageIntro}>
          <Text style={styles.pageTitle}>Hồ sơ học thuật</Text>
          <Text style={styles.pageSubtitle}>
            Quản lý thông tin cá nhân để định danh trong cộng đồng.
          </Text>
        </View>

        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.8}>
            <Image
              source={{ uri: profile?.avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.avatarOverlay}>
              <Ionicons name="camera" size={28} color={COLORS["surface-container-lowest"]} />
            </View>
            <View style={styles.avatarEditBar}>
              <Ionicons name="pencil" size={14} color={COLORS["surface-container-lowest"]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <FormField label="Họ và tên" error={errors.name?.message}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Nhập họ và tên đầy đủ"
                  placeholderTextColor={COLORS.outline}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  maxLength={80}
                />
              )}
            />
          </FormField>

          <FormField label="Trường Đại học" error={errors.university?.message}>
            <Controller
              control={control}
              name="university"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.inputWithIcon, errors.university && styles.inputError]}
                    placeholder="Chọn hoặc nhập tên trường"
                    placeholderTextColor={COLORS.outline}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    maxLength={120}
                  />
                  <Ionicons
                    name="school-outline"
                    size={20}
                    color={COLORS["outline-variant"]}
                    style={styles.inputIcon}
                  />
                </View>
              )}
            />
          </FormField>

          <FormField label="Chuyên ngành" error={errors.major?.message}>
            <Controller
              control={control}
              name="major"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.major && styles.inputError]}
                  placeholder="VD: Kỹ thuật phần mềm"
                  placeholderTextColor={COLORS.outline}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  maxLength={80}
                />
              )}
            />
          </FormField>

          <FormField label="Khóa / Niên khóa" error={errors.cohort?.message}>
            <Controller
              control={control}
              name="cohort"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.cohort && styles.inputError]}
                  placeholder="VD: K65"
                  placeholderTextColor={COLORS.outline}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  maxLength={20}
                />
              )}
            />
          </FormField>

          <FormField
            label="Mô tả bản thân"
            error={errors.bio?.message}
            charCount={{ current: bioLength, max: BIO_MAX_LENGTH }}
          >
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textarea, errors.bio && styles.inputError]}
                  placeholder="Giới thiệu ngắn về định hướng học tập và nghiên cứu..."
                  placeholderTextColor={COLORS.outline}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setBioLength(text.length);
                  }}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={BIO_MAX_LENGTH}
                />
              )}
            />
          </FormField>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.btnDisabled]}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS["on-primary"]} size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="content-save" size={18} color={COLORS["on-primary"]} />
              <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.gutter,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  logo: {
    flex: 1,
    textAlign: "center",
    ...TYPOGRAPHY["headline-md"],
    fontWeight: "700",
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.xl,
    gap: SPACING.xl,
  },

  pageIntro: { gap: SPACING.base },
  pageTitle: {
    ...TYPOGRAPHY["headline-lg-mobile"],
    color: COLORS["on-surface"],
  },
  pageSubtitle: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
  },

  avatarSection: {
    alignItems: "center",
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  avatarWrapper: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    backgroundColor: COLORS["surface-container"],
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarOverlay: {
    position: "absolute",
    inset: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(25,27,35,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: "rgba(25,27,35,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  changeAvatarText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.primary,
    textDecorationLine: "underline",
  },

  form: { gap: SPACING.lg },
  fieldBlock: { gap: SPACING.base },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  charCount: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.outline,
  },
  input: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    backgroundColor: COLORS["surface-container-lowest"],
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
  textarea: {
    height: 108,
    paddingTop: SPACING.md,
  },
  fieldError: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.error,
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
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  saveBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
  btnDisabled: {
    opacity: 0.55,
  },
});
