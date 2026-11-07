import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MOODS } from '../../constants/templates';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  selectedMood?: string;
  onSelectMood: (emoji: string) => void;
}

export const MoodPicker: React.FC<Props> = ({ selectedMood, onSelectMood }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {MOODS.map(m => {
          const isSelected = selectedMood === m.emoji;
          return (
            <TouchableOpacity
              key={m.label}
              onPress={() => onSelectMood(isSelected ? '' : m.emoji)}
              style={[
                styles.moodBtn,
                { backgroundColor: isSelected ? theme.badgeBg : 'transparent', borderColor: isSelected ? theme.accent : theme.paperBorder },
              ]}
            >
              <Text style={styles.emoji}>{m.emoji}</Text>
              <Text style={[styles.label, { color: isSelected ? theme.textPrimary : theme.textMuted }]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  scroll: {
    gap: 8,
    paddingHorizontal: 4,
  },
  moodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    fontFamily: 'serif',
  },
});
