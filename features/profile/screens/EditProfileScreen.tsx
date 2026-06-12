import { zodResolver } from "@hookform/resolvers/zod";
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
import { ChevronLeft, Camera, User, School, BookOpen, GraduationCap, Save } from 'lucide-react-native';

import { COLORS, SPACING } from "@/constants/theme";
import { EditProfileFormSchema, EditProfileFormType } from "../schemas/profileSchema";
import { useProfile } from "../hooks/useProfile";

const BIO_MAX_LENGTH = 150;

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
  const [bioLength, setBioLength] = useState(profile?.bio?.length ?? 0);

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ChevronLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Cài đặt tài khoản</Text>
            <Text style={styles.pageTitleSmall}>Chỉnh sửa thông tin</Text>
          </View>
        </View>

        {/* Change Avatar - Premium Design */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.8}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarDefault}>
                <User size={40} color="#94a3b8" />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Camera size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changeAvatarText}>Nhấn để thay đổi ảnh</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <User size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="VD: Nguyễn Văn A"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trường Đại học</Text>
            <Controller
              control={control}
              name="university"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <School size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="VD: ĐH Bách Khoa"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chuyên ngành</Text>
            <Controller
              control={control}
              name="major"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <BookOpen size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="VD: Khoa học máy tính"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Khóa / Niên khóa</Text>
            <Controller
              control={control}
              name="cohort"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <GraduationCap size={18} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="VD: K64"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Mô tả bản thân</Text>
              <Text style={styles.charCount}>{bioLength}/{BIO_MAX_LENGTH}</Text>
            </View>
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Giới thiệu ngắn về bản thân..."
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setBioLength(text.length);
                  }}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#94a3b8"
                  maxLength={BIO_MAX_LENGTH}
                />
              )}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Save size={20} color="white" />
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  headerSection: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  pageTitleSmall: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarDefault: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0f172a',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  changeAvatarText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748b',
    marginLeft: 4,
  },
  charCount: {
    fontSize: 11,
    color: '#94a3b8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#0f172a',
    height: 56,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  }
});
