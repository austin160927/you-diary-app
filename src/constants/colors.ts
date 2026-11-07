// Theme and Warm Colors for "You" App
// Styled to feel like authentic premium paper, book parchment, and soft ink.

export interface ThemeColors {
  paperBackground: string;
  paperCard: string;
  paperBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  lineColor: string;
  accent: string;
  roseTint: string;
  parchmentGold: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  badgeBg: string;
}

export const LIGHT_BOOK_THEME: ThemeColors = {
  paperBackground: '#FAF7F0',    // Warm antique paper cream
  paperCard: '#FFFDF9',          // Clean crisp book page
  paperBorder: '#EADBCE',        // Soft bookbinding border
  textPrimary: '#2C221E',        // Deep vintage espresso ink
  textSecondary: '#6B5B52',      // Muted brown secondary
  textMuted: '#A0938A',          // Faded pencil note
  lineColor: '#EDE5D8',          // Faint ruled line
  accent: '#A0522D',             // Sienna book leather brown
  roseTint: '#F9ECEC',           // Soft romantic rose for love letters
  parchmentGold: '#D4AF37',      // Elegant gold leaf accent
  tabBarBg: '#F5EFE6',           // Bottom leather/linen bar
  tabBarBorder: '#E5DACB',
  tabBarActive: '#8B4513',
  tabBarInactive: '#9E8E81',
  badgeBg: '#EFE7DA',
};

export const DARK_BOOK_THEME: ThemeColors = {
  paperBackground: '#1A1614',    // Midnight dark leather
  paperCard: '#25201D',          // Dim candlelit parchment
  paperBorder: '#3D342F',
  textPrimary: '#EDE4DC',        // Soft ivory glow
  textSecondary: '#BDB1A8',
  textMuted: '#786C64',
  lineColor: '#2F2823',
  accent: '#D29062',
  roseTint: '#382226',
  parchmentGold: '#F3CF7A',
  tabBarBg: '#1E1917',
  tabBarBorder: '#332B26',
  tabBarActive: '#E8A87C',
  tabBarInactive: '#73655C',
  badgeBg: '#2E2723',
};
