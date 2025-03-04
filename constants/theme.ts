export const theme = {
  colors: {
    primary: '#1B4D3E', // Dark green
    secondary: '#F5F5F5', // Light gray
    text: '#333333',
    textLight: '#666666',
    background: '#FFFFFF',
    backgroundDark: '#F8F8F8',
    border: '#E0E0E0',
    accent: '#2E7D32', // Lighter green for accents
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 14,
      color: '#666666',
    },
  },
};

export type Theme = typeof theme; 