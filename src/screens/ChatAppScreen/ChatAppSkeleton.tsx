import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../styles/theme';

const ChatAppSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgApp }]}>
      <View style={styles.content}>
        {/* Header Mockup */}
        <View style={styles.header}>
          <Skeleton width={100} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width={150} height={16} borderRadius={4} />
        </View>

        {/* Room List Mockup */}
        <View style={styles.roomList}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomListContent}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <View key={idx} style={[styles.roomCard, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
                <View style={styles.avatarWrap}>
                  <Skeleton width={40} height={40} borderRadius={20} />
                </View>
                <View style={styles.roomInfo}>
                  <Skeleton width={80} height={16} borderRadius={4} style={{ marginBottom: 4 }} />
                  <Skeleton width={120} height={12} borderRadius={4} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Messages Mockup (Chat Bubbles) */}
        <View style={styles.messagesContainer}>
          {Array.from({ length: 5 }).map((_, idx) => {
            const isMe = idx % 2 !== 0; // Alternate messages
            return (
              <View key={idx} style={[styles.messageRow, isMe ? styles.messageRowMe : null]}>
                {!isMe && <Skeleton width={32} height={32} borderRadius={16} style={{ marginRight: 8, marginTop: 4 }} />}
                
                <View style={[styles.messageBubble, { backgroundColor: isMe ? theme.primary + '20' : theme.bgPanel }]}>
                  <View style={styles.messageMeta}>
                    <Skeleton width={isMe ? 0 : 80} height={isMe ? 0 : 12} borderRadius={4} style={{ display: isMe ? 'none' : 'flex' }} />
                    <Skeleton width={40} height={10} borderRadius={4} style={{ marginLeft: isMe ? 0 : 8 }} />
                  </View>
                  <Skeleton width={isMe ? 150 : 200} height={16} borderRadius={4} style={{ marginTop: 6 }} />
                  {idx === 2 && <Skeleton width={120} height={16} borderRadius={4} style={{ marginTop: 4 }} />}
                </View>
              </View>
            );
          })}
        </View>

        {/* Input Row Mockup */}
        <View style={[styles.inputRow, { borderTopColor: theme.borderSubtle, backgroundColor: theme.bgApp }]}>
          <View style={[styles.inputField, { backgroundColor: theme.bgHover }]}>
            <Skeleton width="50%" height={20} borderRadius={4} />
          </View>
          <View style={[styles.sendButton, { backgroundColor: theme.bgHover }]}>
            <Skeleton width={40} height={20} borderRadius={4} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: spacing['4'],
    paddingBottom: spacing['2'],
  },
  roomList: {
    height: 90,
  },
  roomListContent: {
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    gap: spacing['3'],
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['3'],
    borderRadius: radius.lg,
    borderWidth: 1,
    width: 200,
  },
  avatarWrap: {
    marginRight: spacing['3'],
  },
  roomInfo: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing['4'],
    alignItems: 'flex-start',
  },
  messageRowMe: {
    flexDirection: 'row-reverse',
  },
  messageBubble: {
    padding: spacing['3'],
    borderRadius: radius.lg,
    maxWidth: '80%',
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['1'],
  },
  inputRow: {
    flexDirection: 'row',
    padding: spacing['3'],
    borderTopWidth: 1,
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: spacing['4'],
    marginRight: spacing['3'],
    justifyContent: 'center',
  },
  sendButton: {
    height: 48,
    width: 70,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatAppSkeleton;
