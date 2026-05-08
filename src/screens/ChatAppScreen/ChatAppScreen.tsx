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
import type { ChatMessage, ChatRoom, ChatUser } from './ChatAppScreen.types';

const ChatAppScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { chatRooms, activeRoom, loading, error, setActiveRoomId, sendMessage } = useChatMessenger();
  const [inputValue, setInputValue] = useState('');

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

  if (error || !chatRooms || !activeRoom) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Da xay ra loi tai du lieu chat.</Text>
      </View>
    );
  }

  const renderRoomCard = (room: ChatRoom) => {
    const peer = room.members[room.members.length - 1] || room.members[0];
    const isActive = activeRoom.id === room.id;
    const lastMessage = room.messages[room.messages.length - 1]?.content ?? 'No messages yet';

    return (
      <Pressable
        key={room.id}
        onPress={() => setActiveRoomId(room.id)}
        style={[styles.roomCard, isActive && styles.roomCardActive]}
      >
        <View style={styles.avatarWrap}>
          <Image source={{ uri: peer.avatar }} style={styles.avatar} />
          <View
            style={[
              styles.statusDot,
              peer.status === 'online' ? styles.statusDotOnline : styles.statusDotOffline,
            ]}
          />
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

  const renderMemberChip = (member: ChatUser) => (
    <View key={member.id} style={styles.memberChip}>
      <Text style={styles.memberChipText}>{member.name}</Text>
    </View>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
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
            {chatRooms.map(renderRoomCard)}
          </ScrollView>
        </View>

        <View style={styles.onlinePanel}>
          <Text style={styles.memberTitle}>Online - {onlineMembers.length}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberRow}>
            {onlineMembers.map(renderMemberChip)}
          </ScrollView>
        </View>

        <View style={styles.messagesContainer}>
          <FlatList
            data={activeRoom.messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputField}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={`Gui tin nhan toi ${activeRoom.name}`}
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
