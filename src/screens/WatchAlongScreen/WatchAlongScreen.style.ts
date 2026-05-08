import { StyleSheet } from 'react-native';
import type { ThemeTokens } from '../../styles/theme';

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },
    content: {
      padding: 12,
      paddingBottom: 90,
    },
    loadingText: {
      color: theme.textSecondary,
      padding: 16,
    },
    videoWrapper: {
      height: 220,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#000',
      marginBottom: 12,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
    },
    playOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.18)',
    },
    playIcon: {
      color: theme.textOnPrimary,
      fontSize: 48,
      fontWeight: '700',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    titleBlock: {
      flex: 1,
      paddingRight: 8,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
    },
    host: {
      color: theme.primary,
      fontWeight: '600',
      marginBottom: 6,
    },
    tagsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    tag: {
      backgroundColor: theme.bgSubtle,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
    },
    tagText: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    liveBlock: {
      alignItems: 'flex-end',
    },
    liveBadge: {
      backgroundColor: theme.statusError,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginBottom: 4,
    },
    liveText: {
      color: theme.btnPrimaryText,
      fontWeight: '700',
      fontSize: 12,
    },
    viewerCount: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    sidebarStrip: {
      marginVertical: 12,
    },
    sidebarItemMobile: {
      backgroundColor: theme.bgPanel,
      padding: 8,
      borderRadius: 8,
      marginRight: 8,
      alignItems: 'center',
      minWidth: 88,
    },
    sidebarIcon: {
      fontSize: 20,
      marginBottom: 6,
    },
    sidebarLabel: {
      color: theme.textPrimary,
      fontSize: 12,
      textAlign: 'center',
    },
    chatContainer: {
      marginTop: 8,
      borderRadius: 8,
      backgroundColor: theme.bgPanel,
      padding: 8,
      minHeight: 120,
    },
    chatHeader: {
      color: theme.textSecondary,
      fontWeight: '700',
      marginBottom: 8,
    },
    chatMessageRow: {
      marginBottom: 8,
    },
    msgUser: {
      fontWeight: '700',
      marginRight: 6,
    },
    msgContent: {
      color: theme.textPrimary,
    },
    msgTime: {
      color: theme.textSecondary,
      fontSize: 11,
    },
    chatInputRow: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    chatInput: {
      flex: 1,
      backgroundColor: theme.bgApp,
      color: theme.textPrimary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    sendBtn: {
      backgroundColor: theme.btnPrimaryBg,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
    },
    sendBtnText: {
      color: theme.btnPrimaryText,
      fontWeight: '700',
    },
    roleSwitch: {
      position: 'absolute',
      right: 12,
      bottom: 12,
      backgroundColor: theme.bgPanel,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    roleSwitchText: {
      color: theme.primary,
      fontWeight: '700',
    },
  });

export default createStyles;
