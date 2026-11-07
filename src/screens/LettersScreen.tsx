import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TEMPLATES, WritingMode } from '../constants/templates';
import { WriteScreen } from './WriteScreen';

export const LettersScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedMode, setSelectedMode] = useState<WritingMode | null>(null);

  const letterOptions: WritingMode[] = ['love', 'friend', 'parent'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.paperBackground }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Write a Letter</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Choose a stationery template to craft a timeless, heartfelt letter.
          </Text>
        </View>

        {/* Letter Modes Cards */}
        <View style={styles.cardList}>
          {letterOptions.map(modeKey => {
            const config = TEMPLATES[modeKey];
            const isLove = modeKey === 'love';
            const isParent = modeKey === 'parent';

            return (
              <TouchableOpacity
                key={modeKey}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.paperCard,
                    borderColor: isLove ? '#F1D6D8' : theme.paperBorder,
                  },
                ]}
                onPress={() => setSelectedMode(modeKey)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: isLove
                        ? '#FCEBED'
                        : isParent
                        ? '#F5EFE6'
                        : '#EDF4F8',
                    },
                  ]}
                >
                  <Ionicons
                    name={config.icon as any}
                    size={26}
                    color={isLove ? '#D81B60' : theme.accent}
                  />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                    {config.title}
                  </Text>
                  <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                    {config.subtitle}
                  </Text>
                  <Text style={[styles.cardSample, { color: theme.textMuted }]}>
                    "{config.defaultGreeting} ... {config.defaultClosing}"
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Full Screen Letter Writer Modal */}
      <Modal visible={!!selectedMode} animationType="slide">
        {selectedMode && (
          <View style={{ flex: 1 }}>
            <WriteScreen
              initialMode={selectedMode}
              onDoneEditing={() => setSelectedMode(null)}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'serif',
    marginTop: 6,
    lineHeight: 20,
  },
  cardList: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#2C221E',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: 'serif',
    marginTop: 2,
  },
  cardSample: {
    fontSize: 11,
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginTop: 6,
  },
});
