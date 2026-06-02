import { StyleSheet, Platform } from 'react-native';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';

export const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['3'],
      backgroundColor: theme.bgApp,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      minHeight: 56,
    },
    transparentHeader: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
    },
    leftSection: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    centerSection: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightSection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing['3'],
    },
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    iconButton: {
      padding: spacing['2'],
      borderRadius: radius.md,
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.bgSubtle,
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.statusError,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: theme.bgApp,
    },
    badgeText: {
      color: '#FFF',
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
    },
    loginButton: {
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['1'],
      backgroundColor: theme.primary,
      borderRadius: radius.md,
    },
    loginButtonText: {
      color: '#FFF',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
    },
    // Modals
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.bgPanel,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      padding: spacing['4'],
      paddingBottom: Platform.OS === 'ios' ? spacing['8'] : spacing['4'],
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing['4'],
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
    menuList: {
      gap: spacing['2'],
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing['3'],
      paddingHorizontal: spacing['2'],
      borderRadius: radius.md,
    },
    menuItemText: {
      marginLeft: spacing['3'],
      fontSize: typography.fontSize.base,
      color: theme.textPrimary,
      fontWeight: typography.fontWeight.medium,
    },
    menuItemTextDanger: {
      marginLeft: spacing['3'],
      fontSize: typography.fontSize.base,
      color: theme.statusError,
      fontWeight: typography.fontWeight.medium,
    },
    menuDivider: {
      height: 1,
      backgroundColor: theme.borderSubtle,
      marginVertical: spacing['2'],
    },
    notiList: {
      paddingBottom: spacing['4'],
    },
    notiItem: {
      flexDirection: 'row',
      paddingVertical: spacing['3'],
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    notiIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.bgSubtle,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing['3'],
    },
    notiInfo: {
      flex: 1,
    },
    notiText: {
      fontSize: typography.fontSize.sm,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    notiBold: {
      fontWeight: typography.fontWeight.bold,
    },
    animeHighlight: {
      color: theme.primary,
      fontWeight: typography.fontWeight.medium,
    },
    notiMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    notiTime: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
    },
    notiCountdown: {
      fontSize: typography.fontSize.xs,
      color: theme.primary,
      fontWeight: typography.fontWeight.medium,
    },
    notiAired: {
      color: theme.statusSuccess,
    },
    notiEmpty: {
      textAlign: 'center',
      color: theme.textSecondary,
      padding: spacing['6'],
      fontSize: typography.fontSize.base,
    },
    closeBtn: {
      padding: spacing['2'],
    },
  });
