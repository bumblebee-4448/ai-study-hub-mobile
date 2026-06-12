import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  FileText,
  ChevronRight,
  AlertCircle
} from "lucide-react-native";

import { ModeratorDocumentDetailScreen } from "./ModeratorDocumentDetailScreen";

// ── Dummy Data ──────────────────────────────────────────────────────────────
const REVIEW_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Advanced Algorithms for Quantum Computing Applications in Cryptography",
    author: "Dr. Elena Rostova",
    uploadedAt: "14/10/2023",
    format: "PDF",
    size: "2.4MB",
    category: "Computer Science",
    year: "Year 4",
    pageCount: 45,
    aiTrustScore: 98,
    isUrgent: false,
    description: "This paper explores the theoretical limits of current post-quantum cryptographic methods against Shor's algorithm variants."
  },
  {
    id: "doc-2",
    title: "Introduction to Machine Learning: Neural Networks and Deep Learning Fundamentals",
    author: "Prof. Alan Turing",
    uploadedAt: "12/10/2023",
    format: "DOCX",
    size: "1.1MB",
    category: "Mathematics",
    year: "Year 3",
    pageCount: 32,
    aiTrustScore: 74,
    isUrgent: false,
    description: "A comprehensive guide for beginners outlining the basic architecture of perceptrons and backpropagation algorithms."
  },
  {
    id: "doc-3",
    title: "Report on Academic Integrity Policy Violations Q3",
    author: "Admin System",
    uploadedAt: "10/10/2023",
    format: "PDF",
    size: "500KB",
    category: "Policy",
    year: "Year 1",
    pageCount: 8,
    aiTrustScore: 41,
    isUrgent: true,
    description: "Quarterly report on policy violations. Requires urgent review before the semester ends."
  },
];

const FILTERS = ["Tất cả", "Chờ duyệt", "Ưu tiên cao", "Đã duyệt", "Từ chối"];

export const ModeratorReviewScreen = () => {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  if (selectedDoc) {
    return (
      <ModeratorDocumentDetailScreen
        document={selectedDoc}
        onBack={() => setSelectedDoc(null)}
        onApprove={(doc) => Alert.alert("Thành công", `Đã duyệt ${doc.title}`)}
        onReject={(doc, reason) => Alert.alert("Từ chối", `Lý do: ${reason}`)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hàng đợi kiểm duyệt</Text>
          <Text style={styles.headerSubtitle}>{REVIEW_DOCUMENTS.length} tài liệu đang chờ xử lý</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView 
        style={styles.list} 
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {REVIEW_DOCUMENTS.map((doc) => (
          <TouchableOpacity 
            key={doc.id} 
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => setSelectedDoc(doc)}
          >
            <View style={styles.cardTop}>
              <View style={[styles.formatBadge, { backgroundColor: doc.isUrgent ? '#fef2f2' : '#f8fafc' }]}>
                {doc.isUrgent ? (
                  <AlertCircle size={14} color="#ef4444" />
                ) : (
                  <FileText size={14} color="#64748b" />
                )}
                <Text style={[styles.formatText, doc.isUrgent && { color: '#ef4444' }]}>
                  {doc.format} • {doc.size}
                </Text>
              </View>
              {doc.aiTrustScore && (
                <View style={styles.aiBadge}>
                  <Text style={styles.aiLabel}>AI Score:</Text>
                  <Text style={[styles.aiValue, { color: doc.aiTrustScore > 90 ? '#10b981' : '#f59e0b' }]}>
                    {doc.aiTrustScore}%
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.docTitle} numberOfLines={2}>{doc.title}</Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.authorRow}>
                <View style={styles.authorAvatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{doc.author[0]}</Text>
                </View>
                <Text style={styles.authorName}>{doc.author}</Text>
              </View>
              <View style={styles.uploadedAtRow}>
                <Clock size={12} color="#94a3b8" />
                <Text style={styles.uploadedAtText}>{doc.uploadedAt}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{doc.category}</Text>
              </View>
              <View style={styles.detailLink}>
                <Text style={styles.detailLinkText}>Kiểm tra</Text>
                <ChevronRight size={16} color="#3b82f6" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  filterChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  formatText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  aiValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
  },
  authorName: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  uploadedAtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadedAtText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailLinkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3b82f6',
  }
});
