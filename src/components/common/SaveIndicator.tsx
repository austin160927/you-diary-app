import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  status: 'saving' | 'saved' | 'idle';
}

export const SaveIndicator: React.FC<Props> = ({ status }) => {
  const { theme } = useTheme();

  if (status === 'idle') return null;

  return (
    <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
      {status === 'saving' ? (
        <>
          <Ionicons name="sync" size={13} color={theme.textMuted} />
          <Text style={[styles.text, { color: theme.textMuted }]}>Saving...</Text>
        </>
      ) : (
        <>
          <Ionicons name="checkmark-circle" size={14} color={theme.accent} />
          <Text style={[styles.text, { color: theme.accent }]}>Saved</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'serif',
  },
});
