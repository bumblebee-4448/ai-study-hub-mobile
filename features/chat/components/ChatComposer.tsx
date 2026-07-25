import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAppTheme } from "@/features/theme";

const MAX_MESSAGE_LENGTH = 2000;

interface ChatComposerProps {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  value,
  isSending,
  onChange,
  onSend,
}) => {
  const { colors } = useAppTheme();
  const canSend = value.trim().length > 0 && !isSending;

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={(text) => onChange(text.slice(0, MAX_MESSAGE_LENGTH))}
          placeholder="Hỏi về tài liệu này..."
          placeholderTextColor={colors.textSubtle}
          multiline
          maxLength={MAX_MESSAGE_LENGTH}
          editable={!isSending}
          style={[styles.input, { color: colors.text }]}
          accessibilityLabel="Nội dung câu hỏi"
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={!canSend}
          style={[
            styles.sendButton,
            { backgroundColor: canSend ? colors.primary : colors.border },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Gửi câu hỏi"
        >
          <Ionicons
            name="arrow-up"
            size={20}
            color={canSend ? colors.onPrimary : colors.textSubtle}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.counter, { color: colors.textSubtle }]}>
        {value.length}/{MAX_MESSAGE_LENGTH}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  inputRow: {
    minHeight: 48,
    maxHeight: 132,
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  input: {
    flex: 1,
    maxHeight: 108,
    ...TYPOGRAPHY["body-md"],
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.sm,
  },
  counter: {
    ...TYPOGRAPHY["label-sm"],
    textAlign: "right",
    marginTop: 2,
  },
});
