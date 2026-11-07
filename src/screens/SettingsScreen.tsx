import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getUserName, setUserName, getAllEntries } from '../services/entryService';
import { exportCollectionPdf } from '../services/pdfService';

export const SettingsScreen: React.FC = () => {
  const { isDark, theme, toggleTheme } = useTheme();
  const [authorName, setAuthorNameInput] = useState('');
  const [isSavedName, setIsSavedName] = useState(false);

  useEffect(() => {
    getUserName().then(setAuthorNameInput);
  }, []);

  const handleSaveName = async () => {
    if (!authorName.trim()) return;
    await setUserName(authorName);
    setIsSavedName(true);
    setTimeout(() => setIsSavedName(false), 2000);
  };

  const handleExportFullJournal = async () => {
    const all = await getAllEntries();
    if (all.length === 0) {
      alert('You do not have any entries yet to export.');
      return;
    }
    await exportCollectionPdf(all, 'You - My Complete Journal', '2026');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.paperBackground }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Customize your personal stationery & journal preferences.
        </Text>

        {/* User / Author Name Box */}
        <View style={[styles.sectionCard, { backgroundColor: theme.paperCard, borderColor: theme.paperBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Author Name</Text>
          <Text style={[styles.sectionDesc, { color: theme.textMuted }]}>
            This name appears on your letter signatures and exported book covers.
          </Text>

          <View style={styles.nameInputRow}>
            <TextInput
              style={[styles.nameInput, { color: theme.textPrimary, borderColor: theme.paperBorder }]}
              placeholder="e.g. Austin"
              placeholderTextColor={theme.textMuted}
              value={authorName}
              onChangeText={setAuthorNameInput}
            />
            <TouchableOpacity onPress={handleSaveName} style={[styles.saveBtn, { backgroundColor: theme.accent }]}>
              <Text style={styles.saveBtnText}>{isSavedName ? 'Saved ✓' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Appearance / Dark Parchment Mode */}
        <View style={[styles.sectionCard, { backgroundColor: theme.paperCard, borderColor: theme.paperBorder }]}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Dark Parchment Mode</Text>
              <Text style={[styles.sectionDesc, { color: theme.textMuted }]}>
                Cozy candlelit night-time writing paper.
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D7CCC8', true: theme.accent }}
              thumbColor={isDark ? '#FFFFFF' : '#8D6E63'}
            />
          </View>
        </View>

        {/* Complete Journal PDF Export */}
        <View style={[styles.sectionCard, { backgroundColor: theme.paperCard, borderColor: theme.paperBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Export My Complete Book</Text>
          <Text style={[styles.sectionDesc, { color: theme.textMuted }]}>
            Generates a high-resolution printed book PDF with an elegant leather cover, table of contents and page numbers.
          </Text>

          <TouchableOpacity onPress={handleExportFullJournal} style={[styles.bookExportBtn, { borderColor: theme.accent }]}>
            <Ionicons name="book-outline" size={20} color={theme.accent} />
            <Text style={[styles.bookExportText, { color: theme.accent }]}>
              Generate Full Journal PDF
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Info */}
        <View style={styles.aboutBox}>
          <Text style={[styles.aboutTitle, { color: theme.textMuted }]}>YOU DIARY & LETTERS</Text>
          <Text style={[styles.aboutText, { color: theme.textMuted }]}>
            A timeless sanctuary for your thoughts, dreams & heartfelt letters.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'serif',
    marginTop: 4,
    marginBottom: 8,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#2C221E',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12,
    fontFamily: 'serif',
    lineHeight: 18,
    marginBottom: 12,
  },
  nameInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontFamily: 'serif',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 13,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookExportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 6,
  },
  bookExportText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  aboutBox: {
    alignItems: 'center',
    marginTop: 20,
    gap: 4,
  },
  aboutTitle: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  aboutText: {
    fontSize: 11,
    fontFamily: 'serif',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
