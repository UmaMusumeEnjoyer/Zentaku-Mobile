// src/screens/HomeLoginScreen.styles.ts
import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';

export const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['3'],
      backgroundColor: theme.bgPanel,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    headerTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: theme.primary,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['2'],
    },
    iconBtn: {
      padding: spacing['2'],
    },
    iconBtnText: {
      fontSize: typography.fontSize.lg,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['2'],
    },
    usernameText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: theme.textPrimary,
      maxWidth: 100,
    },
    logoutBtn: {
      backgroundColor: theme.statusError,
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['1'],
      borderRadius: radius.full,
    },
    logoutBtnText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: '#fff',
    },

    // Welcome
    welcomeBanner: {
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['4'],
      backgroundColor: theme.bgPanel,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    welcomeText: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
    welcomeSubtext: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
      marginTop: spacing['1'],
    },

    // Main content
    scrollView: { flex: 1 },
    scrollContent: {
      paddingTop: spacing['4'],
    },
  });