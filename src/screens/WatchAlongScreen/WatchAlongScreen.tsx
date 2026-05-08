import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from './WatchAlongScreen.style';

// Local types (adapted from web)
type UserRole = 'owner' | 'viewer';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  color?: string;
  isSystem?: boolean;
}

interface StreamInfo {
  title: string;
  hostName: string;
  tags: string[];
  isLive: boolean;
  avatarUrl?: string;
  thumbnailUrl?: string;
}

interface WatchAlongData {
  streamInfo: StreamInfo;
  stats: { viewers: number; uptime: string };
  chatMessages: ChatMessage[];
  sidebarItems: Array<{ id: string; name: string; icon?: string; detail?: string }>;
}

// Simple mock service (kept local to mobile screen)
const mockService = {
  getData: (role: UserRole): Promise<WatchAlongData> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const commonChat: ChatMessage[] = [
          { id: '1', user: 'renzin64', content: 'Wait, did he just use Domain Expansion??', timestamp: '18:21', color: '#FF4500' },
          { id: '2', user: 'jafar_vii', content: 'The animation quality is insane', timestamp: '18:21', color: '#008000' },
          { id: '3', user: 'System', content: 'User AnimeLover99 subscribed!', timestamp: '18:22', isSystem: true },
        ];

        const viewerSidebar = [
          { id: '1', name: 'Channel A', icon: '🎥' },
          { id: '2', name: 'Channel B', icon: '🎮' },
          { id: '3', name: 'Channel C', icon: '🎵' },
        ];

        const ownerSidebar = [
          { id: 'ctrl1', name: 'Video Source', detail: 'OBS Virtual Cam' },
          { id: 'ctrl2', name: 'Microphone', detail: 'Yeti X (85%)' },
        ];

        resolve({
          streamInfo: {
            title: role === 'owner' ? 'Anime Night: Jujutsu Kaisen Ep 24' : 'RERUN: Astralis vs. FURIA',
            hostName: role === 'owner' ? 'Me (Host)' : 'ESLCS',
            tags: ['English Sub', '1080p', 'Live'],
            isLive: true,
            avatarUrl: 'https://via.placeholder.com/50',
            thumbnailUrl: 'https://via.placeholder.com/640x360',
          },
          stats: { viewers: 12403, uptime: '1:42:05' },
          chatMessages: commonChat,
          sidebarItems: role === 'owner' ? ownerSidebar : viewerSidebar,
        });
      }, 700);
    }),
};

const useWatchAlongMobile = () => {
  const [role, setRole] = useState<UserRole>('viewer');
  const [data, setData] = useState<WatchAlongData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await mockService.getData(role);
      setData(res);
    } catch (e) {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleRole = () => setRole((p) => (p === 'viewer' ? 'owner' : 'viewer'));

  const sendMessage = (content: string) => {
    if (!data) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: role === 'owner' ? 'Host' : 'You',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: '#a970ff',
    };
    setData({ ...data, chatMessages: [...data.chatMessages, newMsg] });
  };

  const togglePlay = () => {
    // placeholder
  };

  return { role, data, isLoading, actions: { toggleRole, sendMessage, togglePlay } };
};

const WatchAlongScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { role, data, isLoading, actions } = useWatchAlongMobile();
  const [chatText, setChatText] = useState('');

  if (isLoading || !data) {
    return (
      <View style={styles.container as StyleProp<ViewStyle>}>
        <Text style={styles.loadingText}>Loading watch-along...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container as StyleProp<ViewStyle>}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Video */}
        <TouchableOpacity style={styles.videoWrapper} onPress={actions.togglePlay} activeOpacity={0.8}>
          <Image source={{ uri: data.streamInfo.thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.playOverlay}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </TouchableOpacity>

        {/* Stream Info */}
        <View style={styles.infoRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{data.streamInfo.title}</Text>
            <Text style={styles.host}>{data.streamInfo.hostName}</Text>
            <View style={styles.tagsRow}>
              {data.streamInfo.tags.map((t) => (
                <View key={t} style={styles.tag}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.liveBlock}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.viewerCount}>{data.stats.viewers.toLocaleString()}</Text>
          </View>
        </View>

        {/* Sidebar items as horizontal strip (mobile adaptation) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sidebarStrip}>
          {data.sidebarItems.map((it) => (
            <View key={it.id} style={styles.sidebarItemMobile}>
              <Text style={styles.sidebarIcon}>{it.icon ?? '●'}</Text>
              <Text style={styles.sidebarLabel}>{it.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Chat */}
        <View style={styles.chatContainer}>
          <Text style={styles.chatHeader}>Stream Chat</Text>
          <FlatList
            data={data.chatMessages}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.chatMessageRow}>
                <Text style={[styles.msgUser, { color: item.color || theme.textPrimary }]}>
                  {item.user}:
                </Text>
                <Text style={styles.msgContent}>{item.content}</Text>
                <Text style={styles.msgTime}>{item.timestamp}</Text>
              </View>
            )}
          />

          <View style={styles.chatInputRow}>
            <TextInput
              value={chatText}
              onChangeText={setChatText}
              placeholder="Send a message..."
              placeholderTextColor={theme.textSecondary}
              style={styles.chatInput}
            />
            <TouchableOpacity
              onPress={() => {
                if (chatText.trim().length === 0) return;
                actions.sendMessage(chatText.trim());
                setChatText('');
              }}
              style={styles.sendBtn}
            >
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.roleSwitch} onPress={actions.toggleRole}>
        <Text style={styles.roleSwitchText}>{role === 'viewer' ? 'Switch to Owner' : 'Switch to Viewer'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WatchAlongScreen;
