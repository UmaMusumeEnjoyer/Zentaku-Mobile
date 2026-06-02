import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import createStyles from './WatchAlongScreen.style';
import { useAuth } from '../../context/AuthContext';
import { useWatchAlongLogic } from '@umamusumeenjoyer/shared-logic';
import type { MainStackParamList } from '../../navigation/types';

type WatchAlongScreenRouteProp = RouteProp<MainStackParamList, 'WatchAlong'>;

const WatchAlongScreen: React.FC = () => {
  const route = useRoute<WatchAlongScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();
  const { t } = useTranslation(['WatchAlong', 'common']);

  const [inputRoomId, setInputRoomId] = useState('');
  const [activeRoomId, setActiveRoomId] = useState<string | undefined>(route.params?.roomId);
  const [chatText, setChatText] = useState('');

  const {
    room,
    isHost,
    isLoading,
    error,
    actions
  } = useWatchAlongLogic(activeRoomId || '', user?.id || null, () => {
    // onKicked
    alert('You have been kicked from the room.');
    setActiveRoomId(undefined);
    navigation.setParams({ roomId: undefined });
  });

  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (room?.messages && room.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [room?.messages]);

  const playerSource = useMemo(() => {
    if (!room?.currentSourceUrl) return null;
    return {
      uri: room.currentSourceUrl,
      contentType: room.currentSourceUrl.includes('.m3u8') ? 'hls' : 'auto',
      useCaching: true,
    } as const;
  }, [room?.currentSourceUrl]);

  const player = useVideoPlayer(playerSource, (videoPlayer) => {
    videoPlayer.loop = false;
    // Follow remote playback state if not host?
    // For MVP, we just play if it's playing remotely.
    if (room?.isPlaying) {
      videoPlayer.play();
    }
  });

  useEffect(() => {
    if (!player) return;
    if (room?.isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [room?.isPlaying, player]);

  const handleJoinRoom = () => {
    if (!inputRoomId.trim()) return;
    setActiveRoomId(inputRoomId.trim());
    navigation.setParams({ roomId: inputRoomId.trim() });
  };

  const handleLeaveRoom = () => {
    actions.leaveRoom();
    setActiveRoomId(undefined);
    navigation.setParams({ roomId: undefined });
  };

  const handleSendMessage = () => {
    if (chatText.trim().length === 0) return;
    actions.sendMessage(chatText.trim());
    setChatText('');
  };

  // 1. Render Enter Room Screen
  if (!activeRoomId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 20 }] as StyleProp<ViewStyle>}>
        <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
          {t('WatchAlong:joinRoom', 'Join Watch Along')}
        </Text>
        <TextInput
          style={[styles.chatInput, { marginBottom: 16, height: 50, fontSize: 16 }]}
          placeholder={t('WatchAlong:enterRoomId', 'Enter Room ID...')}
          placeholderTextColor={theme.textDisabled}
          value={inputRoomId}
          onChangeText={setInputRoomId}
          autoCapitalize="none"
        />
        <TouchableOpacity style={[styles.sendBtn, { paddingVertical: 12, alignItems: 'center' }]} onPress={handleJoinRoom}>
          <Text style={styles.sendBtnText}>{t('WatchAlong:join', 'Join Room')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Render Loading
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }] as StyleProp<ViewStyle>}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>{t('common:loading', 'Loading room...')}</Text>
      </View>
    );
  }

  // 3. Render Error
  if (error || !room) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }] as StyleProp<ViewStyle>}>
        <Text style={{ color: theme.statusError, fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
          {error || t('WatchAlong:noDataAvailable', 'Error loading room')}
        </Text>
        <TouchableOpacity style={styles.sendBtn} onPress={handleLeaveRoom}>
          <Text style={styles.sendBtnText}>{t('common:buttons.go_back', 'Go Back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Render Main Room UI
  return (
    <KeyboardAvoidingView
      style={styles.container as StyleProp<ViewStyle>}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Video Player */}
        <View style={styles.videoWrapper}>
          {playerSource ? (
            <VideoView
              style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
              player={player}
              nativeControls={isHost} // Only host should control normally, or we intercept
              allowsPictureInPicture
              contentFit="contain"
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
              <Text style={{ color: theme.textSecondary }}>
                {t('WatchAlong:waitingForHost', 'Waiting for host to select a video...')}
              </Text>
            </View>
          )}
        </View>

        {/* Stream Info */}
        <View style={styles.infoRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{room.settings?.animeTitle || t('WatchAlong:watchPartyRoom', 'Watch Room')}</Text>
            <Text style={styles.host}>
              {t('WatchAlong:hostId', 'Host ID:')} {room.hostId}
            </Text>
          </View>
          <View style={styles.liveBlock}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>{t('WatchAlong:live', 'LIVE')}</Text>
            </View>
            <Text style={styles.viewerCount}>{room.participants?.length || 1} watching</Text>
          </View>
        </View>

        {/* Participants (Mobile adaptation of Sidebar) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sidebarStrip}>
          {room.participants?.map((p) => (
            <View key={p.userId} style={styles.sidebarItemMobile}>
              {p.avatar ? (
                <Image source={{ uri: p.avatar }} style={{ width: 32, height: 32, borderRadius: 16, marginBottom: 4 }} />
              ) : (
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.bgHover, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ color: theme.textPrimary, fontSize: 16 }}>{p.displayName?.charAt(0) || '?'}</Text>
                </View>
              )}
              <Text style={styles.sidebarLabel} numberOfLines={1}>{p.displayName}</Text>
              {p.userId === room.hostId && (
                <Text style={{ fontSize: 10, color: 'gold', marginTop: 2 }}>{t('WatchAlong:host', 'HOST')}</Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Chat Section */}
        <View style={styles.chatContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.chatHeader}>{t('WatchAlong:roomChat', 'Room Chat')}</Text>
            <TouchableOpacity onPress={handleLeaveRoom}>
              <Text style={{ color: theme.statusError, fontSize: 12, fontWeight: 'bold' }}>{t('WatchAlong:leaveRoom', 'Leave Room')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            ref={flatListRef}
            data={room.messages}
            keyExtractor={(item) => item.id || Math.random().toString()}
            style={{ minHeight: 150, maxHeight: 250 }}
            renderItem={({ item }) => (
              <View style={styles.chatMessageRow}>
                <Text style={[styles.msgUser, { color: theme.primary }]}>
                  {item.senderName || item.user || 'User'}:
                </Text>
                <Text style={styles.msgContent}>{item.content}</Text>
                <Text style={styles.msgTime}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 20 }}>
                {t('WatchAlong:welcomeMessage', 'Welcome to the chat!')}
              </Text>
            )}
          />

          <View style={styles.chatInputRow}>
            <TextInput
              value={chatText}
              onChangeText={setChatText}
              placeholder={t('WatchAlong:sendPlaceholder', 'Send a message...')}
              placeholderTextColor={theme.textDisabled}
              style={styles.chatInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.sendBtn}
            >
              <Text style={styles.sendBtnText}>{t('WatchAlong:chatBtn', 'Send')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default WatchAlongScreen;
