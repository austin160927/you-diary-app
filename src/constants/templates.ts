// Writing Templates, Types and Default Formats for "You"

export type WritingMode = 'diary' | 'friend' | 'love' | 'parent';

export interface Entry {
  id: string;
  type: WritingMode;
  title: string;
  recipient?: string;
  greeting?: string;
  closing?: string;
  authorName?: string;
  body: string;
  mood?: string;
  dateStr: string;        // YYYY-MM-DD
  timestamp: number;      // Epoch ms
  updatedAt: number;
}

export interface WritingTemplateConfig {
  id: WritingMode;
  title: string;
  subtitle: string;
  icon: string;
  paperColor: string;
  defaultGreeting: string;
  defaultClosing: string;
  defaultRecipient: string;
  hasMood: boolean;
  borderStyle?: string;
}

export const TEMPLATES: Record<WritingMode, WritingTemplateConfig> = {
  diary: {
    id: 'diary',
    title: 'Daily Diary',
    subtitle: 'My thoughts & today\'s moments',
    icon: 'book-outline',
    paperColor: '#FAF7F0',
    defaultGreeting: '',
    defaultClosing: '',
    defaultRecipient: '',
    hasMood: true,
  },
  friend: {
    id: 'friend',
    title: 'Letter to a Friend',
    subtitle: 'Warm, casual & cherished memories',
    icon: 'mail-outline',
    paperColor: '#F7F9FA',
    defaultGreeting: 'Dear',
    defaultClosing: 'Your dear friend,',
    defaultRecipient: 'Friend',
    hasMood: false,
  },
  love: {
    id: 'love',
    title: 'Love Letter',
    subtitle: 'Romantic, heartfelt & poetic',
    icon: 'heart-outline',
    paperColor: '#FDF6F6',
    defaultGreeting: 'My Dearest',
    defaultClosing: 'Forever and always yours,',
    defaultRecipient: 'Love',
    hasMood: false,
  },
  parent: {
    id: 'parent',
    title: 'Letter to Amma / Appa',
    subtitle: 'Respectful, grateful & loving',
    icon: 'rose-outline',
    paperColor: '#FAF8F2',
    defaultGreeting: 'Dear Amma & Appa,',
    defaultClosing: 'With love and respect,',
    defaultRecipient: 'Amma / Appa',
    hasMood: false,
  },
};

export const MOODS = [
  { emoji: '✨', label: 'Inspired' },
  { emoji: '🌿', label: 'Peaceful' },
  { emoji: '☕', label: 'Reflective' },
  { emoji: '💫', label: 'Happy' },
  { emoji: '🌧️', label: 'Melancholy' },
  { emoji: '🕯️', label: 'Quiet' },
];
