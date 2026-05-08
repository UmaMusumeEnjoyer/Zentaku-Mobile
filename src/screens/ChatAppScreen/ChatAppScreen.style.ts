import { StyleSheet } from 'react-native';
import type { ThemeTokens } from '../../styles/theme';

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.statusError,
      fontSize: 14,
    },
    content: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      backgroundColor: theme.bgPanel,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.textSecondary,
      marginTop: 4,
      fontSize: 13,
    },
    roomList: {
      maxHeight: 104,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      backgroundColor: theme.bgApp,
    },
    roomListContent: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 10,
    },
    roomCard: {
      width: 220,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      padding: 10,
      backgroundColor: theme.bgPanel,
      flexDirection: 'row',
      alignItems: 'center',
    },
    roomCardActive: {
      borderColor: theme.borderFocus,
      backgroundColor: theme.bgHover,
    },
    avatarWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 10,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    statusDot: {
      position: 'absolute',
      right: 2,
      bottom: 2,
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.bgPanel,
    },
    statusDotOnline: {
      backgroundColor: theme.statusSuccess,
    },
    statusDotOffline: {
      backgroundColor: theme.textDisabled,
    },
    roomInfo: {
      flex: 1,
    },
    roomName: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 3,
    },
    roomMessagePreview: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    onlinePanel: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      backgroundColor: theme.bgApp,
    },
    memberTitle: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: '700',
      marginBottom: 8,
    },
    memberRow: {
      flexDirection: 'row',
      gap: 8,
    },
    memberChip: {
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: theme.bgPanel,
    },
    memberChipText: {
      color: theme.textPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: 12,
      paddingTop: 10,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      gap: 8,
    },
    messageAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      marginTop: 2,
    },
    messageBubble: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      backgroundColor: theme.bgPanel,
    },
    messageMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    senderName: {
      color: theme.primary,
      fontWeight: '700',
      fontSize: 12,
      marginRight: 10,
      flexShrink: 1,
    },
    messageTime: {
      color: theme.textSecondary,
      fontSize: 11,
    },
    messageText: {
      color: theme.textPrimary,
      fontSize: 14,
      lineHeight: 19,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: theme.borderSubtle,
      backgroundColor: theme.bgPanel,
      gap: 8,
      marginBottom: 62,
    },
    inputField: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: theme.bgApp,
      color: theme.textPrimary,
      fontSize: 14,
    },
    sendButton: {
      backgroundColor: theme.btnPrimaryBg,
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      minWidth: 60,
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    sendText: {
      color: theme.btnPrimaryText,
      fontWeight: '700',
      fontSize: 13,
    },
  });

export default createStyles;
