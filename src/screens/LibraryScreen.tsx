import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getAllEntries, deleteEntry, formatPrettyDate } from '../services/entryService';
import { Entry, WritingMode, TEMPLATES } from '../constants/templates';
import { exportSingleEntryPdf, exportCollectionPdf } from '../services/pdfService';
import { WriteScreen } from './WriteScreen';

export const LibraryScreen: React.FC = () => {
  const { theme } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const loadData = async () => {
    const list = await getAllEntries();
    setEntries(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter list by search query and type
  const filteredEntries = entries.filter(item => {
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.body && item.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.recipient && item.recipient.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedTypeFilter === 'all' || item.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleDelete = (item: Entry) => {
    const title = item.title || item.dateStr;
    const msg = `Are you sure you want to delete "${title}"?`;

    if (Platform.OS === 'web') {
      if (window.confirm(msg)) {
        deleteEntry(item.id).then(loadData);
      }
    } else {
      Alert.alert('Delete Entry', msg, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEntry(item.id).then(loadData),
        },
      ]);
    }
  };

  const handleExportMonth = () => {
    if (filteredEntries.length === 0) {
      alert('No entries available to export');
      return;
    }
    exportCollectionPdf(filteredEntries, 'My Journal Collection', '2026');
  };

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'diary', label: 'Diaries' },
    { id: 'love', label: 'Love' },
    { id: 'friend', label: 'Friends' },
    { id: 'parent', label: 'Parents' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.paperBackground }]} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Library</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {entries.length} memories & letters preserved
          </Text>
        </View>

        <TouchableOpacity onPress={handleExportMonth} style={[styles.exportAllBtn, { borderColor: theme.accent }]}>
          <Ionicons name="book-outline" size={16} color={theme.accent} />
          <Text style={[styles.exportAllText, { color: theme.accent }]}>Export Book</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={[styles.searchBox, { backgroundColor: theme.paperCard, borderColor: theme.paperBorder }]}>
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Search memories, names, dates..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filterTabs.map(tab => {
          const isSelected = selectedTypeFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab,
                isSelected && { backgroundColor: theme.accent },
              ]}
              onPress={() => setSelectedTypeFilter(tab.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Entries List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="journal-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No memories found here yet.
            </Text>
            <Text style={[styles.emptySub, { color: theme.textMuted }]}>
              Switch to Write tab to begin your first page!
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const config = TEMPLATES[item.type];
          return (
            <TouchableOpacity
              style={[
                styles.entryCard,
                {
                  backgroundColor: theme.paperCard,
                  borderColor: theme.paperBorder,
                },
                item.type === 'love' && { borderColor: '#F5D0D3' },
              ]}
              activeOpacity={0.8}
              onPress={() => setEditingEntry(item)}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.badgeRow}>
                  <Text style={[styles.typeBadge, { color: theme.accent }]}>
                    {config.title.toUpperCase()}
                  </Text>
                  {item.mood ? <Text style={styles.moodEmoji}>{item.mood}</Text> : null}
                </View>
                <Text style={[styles.dateText, { color: theme.textMuted }]}>
                  {formatPrettyDate(item.dateStr)}
                </Text>
              </View>

              <Text style={[styles.entryTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.title || (item.recipient ? `To ${item.recipient}` : 'Untitled Moment')}
              </Text>

              <Text style={[styles.entrySnippet, { color: theme.textSecondary }]} numberOfLines={3}>
                {item.body}
              </Text>

              {/* Card Footer Actions */}
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  onPress={() => exportSingleEntryPdf(item)}
                  style={[styles.actionBtn, { backgroundColor: theme.badgeBg }]}
                >
                  <Ionicons name="document-text-outline" size={14} color={theme.accent} />
                  <Text style={[styles.actionBtnText, { color: theme.accent }]}>PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Edit Entry Modal */}
      <Modal visible={!!editingEntry} animationType="slide">
        {editingEntry && (
          <View style={{ flex: 1 }}>
            <WriteScreen
              existingEntry={editingEntry}
              onDoneEditing={() => {
                setEditingEntry(null);
                loadData();
              }}
            />
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'serif',
    marginTop: 2,
  },
  exportAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  exportAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'serif',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    gap: 14,
  },
  entryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#2C221E',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  moodEmoji: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'serif',
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 6,
  },
  entrySnippet: {
    fontSize: 13,
    fontFamily: 'serif',
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3EBE0',
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  deleteBtn: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: 'serif',
    marginTop: 4,
  },
});
