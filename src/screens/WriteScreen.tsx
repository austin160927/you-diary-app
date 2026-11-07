import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { MoodPicker } from '../components/common/MoodPicker';
import {
  getTodayDateString,
  formatPrettyDate,
  saveEntry,
} from '../services/entryService';
import { Entry, WritingMode, TEMPLATES } from '../constants/templates';

interface Props {
  initialMode?: WritingMode;
  existingEntry?: Entry | null;
  onDoneEditing?: () => void;
}

export const WriteScreen: React.FC<Props> = ({
  initialMode = 'diary',
  existingEntry = null,
  onDoneEditing,
}) => {
  const { theme } = useTheme();

  const [mode, setMode] = useState<WritingMode>(initialMode);
  const [currentEntryId, setCurrentEntryId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<string>('');
  const [recipient, setRecipient] = useState('');
  const [greeting, setGreeting] = useState('');
  const [closing, setClosing] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const todayStr = getTodayDateString();
  const dateFormatted = formatPrettyDate(todayStr);

  // Initialize or start fresh page
  const startNewPage = (newMode: WritingMode = 'diary') => {
    setMode(newMode);
    setCurrentEntryId('entry_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));
    setTitle('');
    setBody('');
    setMood('');
    const template = TEMPLATES[newMode];
    setGreeting(template.defaultGreeting);
    setClosing(template.defaultClosing);
    setRecipient(template.defaultRecipient);
    setAuthorName('');
    setIsSaved(false);
  };

  useEffect(() => {
    if (existingEntry) {
      setMode(existingEntry.type);
      setCurrentEntryId(existingEntry.id);
      setTitle(existingEntry.title || '');
      setBody(existingEntry.body || '');
      setMood(existingEntry.mood || '');
      setRecipient(existingEntry.recipient || '');
      setGreeting(existingEntry.greeting || '');
      setClosing(existingEntry.closing || '');
      setAuthorName(existingEntry.authorName || '');
      setIsSaved(true);
    } else {
      startNewPage(initialMode);
    }
  }, [existingEntry, initialMode]);

  // Explicit Save Button Function
  const handleSave = async () => {
    if (!body.trim() && !title.trim()) {
      alert('Please write something before saving.');
      return;
    }

    const entryObj: Entry = {
      id: currentEntryId || 'entry_' + Date.now(),
      type: mode,
      title: title.trim(),
      body: body,
      mood: mood,
      recipient: recipient,
      greeting: greeting,
      closing: closing,
      authorName: authorName,
      dateStr: existingEntry ? existingEntry.dateStr : todayStr,
      timestamp: existingEntry ? existingEntry.timestamp : Date.now(),
      updatedAt: Date.now(),
    };

    await saveEntry(entryObj);
    setIsSaved(true);

    if (onDoneEditing) {
      onDoneEditing();
    }
  };

  const isLetter = mode !== 'diary';
  const templateConfig = TEMPLATES[mode];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.paperBackground }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.appName, { color: theme.accent }]}>You</Text>
            <Text style={[styles.dateSubtext, { color: theme.textSecondary }]}>
              {existingEntry ? formatPrettyDate(existingEntry.dateStr) : dateFormatted}
            </Text>
          </View>

          {/* Action Buttons: New Page & Save */}
          <View style={styles.topRight}>
            {!existingEntry && (
              <TouchableOpacity
                onPress={() => startNewPage(mode)}
                style={[styles.newPageBtn, { borderColor: theme.paperBorder, backgroundColor: theme.paperCard }]}
              >
                <Ionicons name="add-outline" size={16} color={theme.accent} />
                <Text style={[styles.newPageText, { color: theme.accent }]}>New Page</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, { backgroundColor: theme.accent }]}
            >
              <Ionicons name={isSaved ? "checkmark-circle" : "save-outline"} size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>{isSaved ? "Saved ✓" : "Save"}</Text>
            </TouchableOpacity>

            {onDoneEditing && (
              <TouchableOpacity onPress={onDoneEditing} style={styles.doneBtn}>
                <Ionicons name="close" size={22} color={theme.textPrimary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Paper Sheet Container */}
          <View
            style={[
              styles.paperSheet,
              {
                backgroundColor: theme.paperCard,
                borderColor: theme.paperBorder,
              },
              mode === 'love' && { borderColor: '#E8C5C8', backgroundColor: '#FFF9F9' },
            ]}
          >
            {/* Lined Paper Accent Header */}
            <View style={styles.paperHeaderDecoration}>
              <View style={[styles.redMarginLine, { backgroundColor: '#E57373' }]} />
              <Text style={[styles.modeBadgeText, { color: theme.textMuted }]}>
                {templateConfig.title.toUpperCase()}
              </Text>
            </View>

            {/* Optional Mood Selector (Diary Mode) */}
            {templateConfig.hasMood && (
              <MoodPicker selectedMood={mood} onSelectMood={(m) => { setMood(m); setIsSaved(false); }} />
            )}

            {/* Title / Subject Input */}
            <TextInput
              style={[
                styles.titleInput,
                { color: theme.textPrimary, borderBottomColor: theme.lineColor },
              ]}
              placeholder={isLetter ? "Letter Subject..." : "A title for this page..."}
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={(text) => { setTitle(text); setIsSaved(false); }}
            />

            {/* Letter Greeting Area */}
            {isLetter && (
              <View style={styles.letterGreetingRow}>
                <TextInput
                  style={[styles.greetingPrefix, { color: theme.textSecondary }]}
                  value={greeting}
                  onChangeText={(val) => { setGreeting(val); setIsSaved(false); }}
                  placeholder="Dear"
                  placeholderTextColor={theme.textMuted}
                />
                <TextInput
                  style={[styles.recipientInput, { color: theme.textPrimary }]}
                  value={recipient}
                  onChangeText={(val) => { setRecipient(val); setIsSaved(false); }}
                  placeholder="Recipient Name"
                  placeholderTextColor={theme.textMuted}
                />
                <Text style={[styles.comma, { color: theme.textSecondary }]}>,</Text>
              </View>
            )}

            {/* Main Book-like Body Writing Area */}
            <TextInput
              style={[
                styles.bodyInput,
                {
                  color: theme.textPrimary,
                  lineHeight: 28,
                },
              ]}
              multiline
              placeholder={
                mode === 'diary'
                  ? "Write whatever happened in your day... Press Save when done."
                  : "Pour your heart into this letter..."
              }
              placeholderTextColor={theme.textMuted}
              value={body}
              onChangeText={(text) => { setBody(text); setIsSaved(false); }}
              textAlignVertical="top"
            />

            {/* Letter Sign-off Closing Area */}
            {isLetter && (
              <View style={styles.letterClosingBox}>
                <TextInput
                  style={[styles.closingText, { color: theme.textSecondary }]}
                  value={closing}
                  onChangeText={(val) => { setClosing(val); setIsSaved(false); }}
                  placeholder="Your friend / Forever yours,"
                  placeholderTextColor={theme.textMuted}
                />
                <TextInput
                  style={[styles.authorSign, { color: theme.textPrimary }]}
                  value={authorName}
                  onChangeText={(val) => { setAuthorName(val); setIsSaved(false); }}
                  placeholder="Your Name"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'serif',
    letterSpacing: 1,
  },
  dateSubtext: {
    fontSize: 13,
    fontFamily: 'serif',
    marginTop: 2,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newPageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  newPageText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  doneBtn: {
    padding: 6,
    marginLeft: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  paperSheet: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    minHeight: 540,
    shadowColor: '#2C221E',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  paperHeaderDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E7DB',
    paddingBottom: 8,
  },
  redMarginLine: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  modeBadgeText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 12,
  },
  letterGreetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  greetingPrefix: {
    fontSize: 16,
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginRight: 6,
  },
  recipientInput: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
    paddingBottom: 2,
  },
  comma: {
    fontSize: 16,
    fontFamily: 'serif',
    marginLeft: 2,
  },
  bodyInput: {
    fontSize: 16,
    fontFamily: 'serif',
    minHeight: 320,
  },
  letterClosingBox: {
    marginTop: 24,
    alignItems: 'flex-end',
  },
  closingText: {
    fontSize: 15,
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginBottom: 4,
    textAlign: 'right',
  },
  authorSign: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
    paddingBottom: 2,
  },
});
