export const AUTH_ERRORS = {
  TWITTER_NOT_IMPLEMENTED: "Twitter login is not yet implemented",
  INVALID_CREDENTIALS: "Invalid email or password",
  FIELDS_REQUIRED: "All fields are required",
  INVALID_EMAIL: "Invalid email format",
  PASSWORDS_NOT_MATCH: "Passwords do not match",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  EMAIL_EXISTS: "Email already in use",
  GENERIC_ERROR: "An error occurred",
  GOOGLE_ERROR: "Error during Google login",
  APPLE_ERROR: "An error occurred during Apple Sign In"
};

export const FONTS = {
  REGULAR: 'SpaceMono-Regular',
  BOLD: 'SpaceMono-Bold',
  LIGHT: 'SpaceMono-Light',
};

export const COLORS = {
  PRIMARY: '#4C49ED',
  SECONDARY: '#7A7AFF',
  
  BACKGROUND: '#FAFBFF',
  TEXT: '#0A0B1F',
  GRAY: '#6B7280',
  WHITE: '#FFFFFF',
  BORDER: '#E5E7EB',
  
  DARK_BACKGROUND: '#121212',
  DARK_CARD: '#1E1E1E',
  DARK_TEXT: '#FFFFFF',
  DARK_GRAY: '#9CA3AF',
  DARK_BORDER: '#2D2D2D',
  
  ERROR: '#EF4444',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
};

export const getThemeColors = (darkMode: boolean) => ({
  background: darkMode ? COLORS.DARK_BACKGROUND : COLORS.BACKGROUND,
  card: darkMode ? COLORS.DARK_CARD : COLORS.WHITE,
  text: darkMode ? COLORS.DARK_TEXT : COLORS.TEXT,
  border: darkMode ? COLORS.DARK_BORDER : COLORS.BORDER,
  gray: darkMode ? COLORS.DARK_GRAY : COLORS.GRAY,
});