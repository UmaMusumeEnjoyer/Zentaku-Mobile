import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import createStyles from './ChatAppScreen.style';
import { useChatMessenger } from './useChatApp';
import type { Message, ChatRoom, User } from './ChatAppScreen.types';

const ChatAppScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { chatRooms, privateRooms, activeRoom, loading, error, setActiveRoomId, sendMessage, typingUsers } = useChatMessenger();
  const [inputValue, setInputValue] = useState('');

  const allRooms = useMemo(() => {
    return [...(chatRooms || []), ...(privateRooms || [])];
  }, [chatRooms, privateRooms]);

  const onlineMembers = useMemo(
    () => activeRoom?.members.filter((member) => member.status === 'online') ?? [],
    [activeRoom]
  );

  const submitMessage = () => {
    const content = inputValue.trim();
    if (!content) return;
    sendMessage(content);
    setInputValue('');
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !allRooms || !activeRoom) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Đã xảy ra lỗi tải dữ liệu chat: {error?.message}</Text>
      </View>
    );
  }

  const renderRoomCard = (room: ChatRoom) => {
    const avatarUri = room.avatar || `https://i.pravatar.cc/150?u=${room.id}`;
    const isActive = activeRoom.id === room.id;
    const lastMessage = room.messages[room.messages.length - 1]?.content ?? 'No messages yet';

    return (
      <Pressable
        key={room.id}
        onPress={() => setActiveRoomId(room.id)}
        style={[styles.roomCard, isActive && styles.roomCardActive]}
      >
        <View style={styles.avatarWrap}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          {room.type === 'dm' && (
            <View
              style={[
                styles.statusDot,
                styles.statusDotOnline, // For now, assume online or parse from members if available
              ]}
            />
          )}
        </View>
        <View style={styles.roomInfo}>
          <Text numberOfLines={1} style={styles.roomName}>
            {room.name}
          </Text>
          <Text numberOfLines={1} style={styles.roomMessagePreview}>
            {lastMessage}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderMemberChip = (member: User) => (
    <View key={member.id} style={styles.memberChip}>
      <Text style={styles.memberChipText}>{member.name}</Text>
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageRow}>
      <Image source={{ uri: item.sender.avatar }} style={styles.messageAvatar} />
      <View style={styles.messageBubble}>
        <View style={styles.messageMeta}>
          <Text numberOfLines={1} style={styles.senderName}>
            {item.sender.name}
          </Text>
          <Text style={styles.messageTime}>{item.timestamp}</Text>
        </View>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={10}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Chats</Text>
          <Text style={styles.subtitle}>{activeRoom.name}</Text>
        </View>

        <View style={styles.roomList}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.roomListContent}
            showsHorizontalScrollIndicator={false}
          >
            {allRooms.map(renderRoomCard)}
          </ScrollView>
        </View>

        {onlineMembers.length > 0 && (
          <View style={styles.onlinePanel}>
            <Text style={styles.memberTitle}>Online - {onlineMembers.length}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberRow}>
              {onlineMembers.map(renderMemberChip)}
            </ScrollView>
          </View>
        )}

        <View style={styles.messagesContainer}>
          <FlatList
            data={activeRoom.messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            inverted={false}
          />
        </View>

        {typingUsers.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 4 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontStyle: 'italic' }}>
              Someone is typing...
            </Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputField}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={`Gửi tin nhắn tới ${activeRoom.name}`}
            placeholderTextColor={theme.textSecondary}
            returnKeyType="send"
            onSubmitEditing={submitMessage}
          />
          <Pressable
            onPress={submitMessage}
            disabled={inputValue.trim().length === 0}
            style={[styles.sendButton, inputValue.trim().length === 0 && styles.sendButtonDisabled]}
          >
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatAppScreen;
