import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAppTheme } from "@/features/theme";
import { useChatReadyDocuments } from "../hooks/useChatReadyDocuments";
import { useDocumentChat } from "../hooks/useDocumentChat";
import { useSendChatMessage } from "../hooks/useSendChatMessage";
import { getChatErrorMessage } from "../services/chatService";
import { ChatComposer } from "../components/ChatComposer";
import { ChatMessageList } from "../components/ChatMessageList";
import { ChatSourcePicker } from "../components/ChatSourcePicker";

interface AIChatScreenProps {
  onBack?: () => void;
}

export const AIChatScreen: React.FC<AIChatScreenProps> = ({ onBack }) => {
  const { colors } = useAppTheme();
  const [mode, setMode] = useState<"sources" | "chat">("sources");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );
  const [selectingDocumentId, setSelectingDocumentId] = useState<string | null>(
    null,
  );
  const [draft, setDraft] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const { documents, isLoading, isRefreshing, error, refresh } =
    useChatReadyDocuments();
  const selectedDocument = useMemo(
    () =>
      documents.find((document) => document.id === selectedDocumentId) ?? null,
    [documents, selectedDocumentId],
  );
  const documentChat = useDocumentChat(selectedDocumentId ?? "");
  const sendMutation = useSendChatMessage(documentChat.activeSessionId);

  useEffect(() => {
    if (
      mode !== "chat" ||
      !selectedDocumentId ||
      documentChat.isLoadingSessions
    ) {
      return;
    }

    if (chatError) {
      return;
    }

    if (documentChat.sessionError) {
      setSelectingDocumentId(null);
      setChatError(getChatErrorMessage(documentChat.sessionError));
      return;
    }

    if (!documentChat.activeSessionId && !documentChat.isCreatingSession) {
      if (documentChat.sessions.length === 0) {
        documentChat.createNewSession().catch((sessionError) => {
          setSelectingDocumentId(null);
          setChatError(getChatErrorMessage(sessionError));
        });
      }
      return;
    }

    setSelectingDocumentId(null);
  }, [chatError, documentChat, mode, selectedDocumentId]);

  const handleSelectDocument = (documentId: string) => {
    setChatError(null);
    setSelectingDocumentId(documentId);
    setSelectedDocumentId(documentId);
    setDraft("");
    setMode("chat");
  };

  const handleChangeDocument = () => {
    setMode("sources");
    setSelectedDocumentId(null);
    setSelectingDocumentId(null);
    setDraft("");
    setChatError(null);
  };

  const handleNewSession = async () => {
    setChatError(null);
    setDraft("");
    try {
      await documentChat.createNewSession();
    } catch (sessionError) {
      setChatError(getChatErrorMessage(sessionError));
    }
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !documentChat.activeSessionId || sendMutation.isPending)
      return;

    setChatError(null);
    try {
      await sendMutation.mutateAsync(content);
      setDraft("");
    } catch (sendError) {
      setChatError(getChatErrorMessage(sendError));
    }
  };

  const screenError = error ? getChatErrorMessage(error) : null;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          style={styles.headerButton}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={22} color={colors.icon} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            AI Study Coach
          </Text>
          {selectedDocument && (
            <Text
              style={[styles.headerSubtitle, { color: colors.textSubtle }]}
              numberOfLines={1}
            >
              {selectedDocument.title}
            </Text>
          )}
        </View>
        {mode === "chat" ? (
          <TouchableOpacity
            onPress={handleChangeDocument}
            style={styles.headerButton}
            accessibilityLabel="Đổi tài liệu"
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={22}
              color={colors.icon}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButton} />
        )}
      </View>

      {mode === "sources" ? (
        <View style={styles.content}>
          <View style={styles.intro}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>
              Chọn tài liệu để bắt đầu hỏi đáp
            </Text>
            <Text style={[styles.pageSubtitle, { color: colors.textSubtle }]}>
              Chỉ tài liệu public đã được duyệt mới có thể dùng để hỏi đáp.
            </Text>
          </View>
          <ChatSourcePicker
            documents={documents}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            error={screenError}
            selectingDocumentId={selectingDocumentId}
            onSelect={handleSelectDocument}
            onRetry={refresh}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.chatToolbar}>
            <View
              style={[
                styles.documentChip,
                { backgroundColor: colors.primaryMuted },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={15}
                color={colors.primary}
              />
              <Text
                style={[styles.documentChipText, { color: colors.primary }]}
                numberOfLines={1}
              >
                {selectedDocument?.title ?? "Tài liệu đang chọn"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleNewSession}
              disabled={documentChat.isCreatingSession}
            >
              {documentChat.isCreatingSession ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={[styles.newChatText, { color: colors.primary }]}>
                  Chat mới
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {chatError && (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: colors.dangerMuted },
              ]}
            >
              <Ionicons
                name="warning-outline"
                size={16}
                color={colors.dangerText}
              />
              <Text
                style={[styles.errorBannerText, { color: colors.dangerText }]}
              >
                {chatError}
              </Text>
            </View>
          )}

          {documentChat.isLoadingSessions || documentChat.isCreatingSession ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSubtle }]}>
                Đang chuẩn bị cuộc trò chuyện...
              </Text>
            </View>
          ) : (
            <ChatMessageList
              messages={documentChat.messages}
              isLoading={documentChat.isLoadingMessages}
              isSending={sendMutation.isPending}
              onSuggestionPress={setDraft}
            />
          )}

          <ChatComposer
            value={draft}
            isSending={sendMutation.isPending || documentChat.isCreatingSession}
            onChange={setDraft}
            onSend={handleSend}
          />
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: SPACING.sm,
  },
  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleBlock: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },
  headerTitle: {
    ...TYPOGRAPHY["headline-md"],
    fontSize: 20,
    lineHeight: 26,
  },
  headerSubtitle: {
    ...TYPOGRAPHY["label-sm"],
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  intro: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  pageTitle: {
    ...TYPOGRAPHY["headline-md"],
    fontSize: 22,
    lineHeight: 28,
  },
  pageSubtitle: {
    ...TYPOGRAPHY["body-md"],
  },
  chatContainer: {
    flex: 1,
  },
  chatToolbar: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["margin-mobile"],
    gap: SPACING.md,
  },
  documentChip: {
    maxWidth: "72%",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  documentChipText: {
    ...TYPOGRAPHY["label-sm"],
    flexShrink: 1,
  },
  newChatText: {
    ...TYPOGRAPHY["label-md"],
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginHorizontal: SPACING["margin-mobile"],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  errorBannerText: {
    ...TYPOGRAPHY["label-sm"],
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
  },
  loadingText: {
    ...TYPOGRAPHY["body-md"],
  },
});
