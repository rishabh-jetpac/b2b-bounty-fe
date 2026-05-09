import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles'
import { colors } from '../colors'

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primaryContainer,
      dark: colors.primary,
      contrastText: colors.onPrimary,
    },
    secondary: {
      main: colors.secondaryContainer,
      dark: colors.secondary,
      contrastText: colors.onSecondary,
    },
    error: {
      main: colors.error,
      contrastText: colors.onError,
    },
    background: {
      default: colors.background,
      paper: colors.surfaceContainerLowest,
    },
    text: {
      primary: colors.onSurface,
      secondary: colors.onSurfaceVariant,
    },
    divider: colors.outlineVariant,
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontFamily: '"Lexend", sans-serif',
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h2: {
      fontFamily: '"Lexend", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Lexend", sans-serif',
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontFamily: '"Lexend", sans-serif',
      fontSize: '0.95rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    overline: {
      fontFamily: '"Lexend", sans-serif',
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.04em',
      lineHeight: 1.33,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          minHeight: '100%',
        },
        body: {
          minHeight: '100svh',
          margin: 0,
          backgroundColor: colors.background,
          color: colors.onBackground,
        },
        '#root': {
          minHeight: '100svh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: 8,
          boxShadow: `0 10px 24px ${alpha(colors.primary, 0.14)}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.outlineVariant,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.outline,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primaryContainer,
            borderWidth: 2,
          },
        },
        input: {
          paddingTop: 14,
          paddingBottom: 14,
          fontSize: '1rem',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: colors.outline,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

export const theme = responsiveFontSizes(baseTheme)

