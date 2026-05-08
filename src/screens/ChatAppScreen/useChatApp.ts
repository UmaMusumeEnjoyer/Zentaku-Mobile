import { useEffect, useState } from 'react';
import type { ChatMessage, ChatRoom, ChatUser, UseChatMessengerReturn } from './ChatAppScreen.types';

const currentUser: ChatUser = {
  id: 'u0',
  name: 'You',
  avatar: 'https://i.pravatar.cc/150?u=u0',
  status: 'online',
};
const userA: ChatUser = {
  id: 'u1',
  name: 'Nguoi A',
  avatar: 'https://i.pravatar.cc/150?u=u1',
  status: 'online',
};
const userB: ChatUser = {
  id: 'u2',
  name: 'Nguoi B',
  avatar: 'https://i.pravatar.cc/150?u=u2',
  status: 'offline',
};
const userC: ChatUser = {
  id: 'u3',
  name: 'Nguoi C',
  avatar: 'https://i.pravatar.cc/150?u=u3',
  status: 'online',
};
const hinaBeliever1: ChatUser = {
  id: 'u4',
  name: 'Con chien so 1',
  avatar: 'https://i.pravatar.cc/150?u=u4',
  status: 'online',
};
const hinaBeliever2: ChatUser = {
  id: 'u5',
  name: 'Simp chua',
  avatar: 'https://i.pravatar.cc/150?u=u5',
  status: 'online',
};

const mockChatRooms: ChatRoom[] = [
  {
    id: 'c1',
    type: 'dm',
    name: 'Nguoi A',
    members: [currentUser, userA],
    messages: [
      {
        id: 'm1',
        sender: userA,
        content: 'Alo, toi da xem xong tap moi roi. Plot twist cuon that su.',
        timestamp: '10:00',
      },
    ],
  },
  {
    id: 'c2',
    type: 'dm',
    name: 'Nguoi B',
    members: [currentUser, userB],
    messages: [
      {
        id: 'm2',
        sender: userB,
        content: 'Minh vua note lai lich anime mua nay, ban can gui qua khong?',
        timestamp: 'Hom qua',
      },
    ],
  },
  {
    id: 'c3',
    type: 'dm',
    name: 'Nguoi C',
    members: [currentUser, userC],
    messages: [
      {
        id: 'm3',
        sender: userC,
        content: 'Cuoi tuan hop team xem phim nhe, toi da chuan bi list roi.',
        timestamp: '08:30',
      },
    ],
  },
  {
    id: 'c4',
    type: 'server',
    name: 'Hoi thanh mau Youmiya',
    description: 'Noi thaoluan va chia se khoanh khac de thuong cua Hina',
    members: [currentUser, hinaBeliever1, hinaBeliever2],
    messages: [
      {
        id: 'm4',
        sender: hinaBeliever1,
        content: 'Hom nay stream vui qua, doan hat cuoi day cam xuc.',
        timestamp: '11:00',
      },
      {
        id: 'm5',
        sender: hinaBeliever2,
        content: 'Dong y, background nhac qua hop voi chu de tap nay.',
        timestamp: '11:05',
      },
      {
        id: 'm6',
        sender: currentUser,
        content: 'Ai co lich event sap toi thi thong bao cho moi nguoi voi nhe.',
        timestamp: '11:10',
      },
    ],
  },
];

export const useChatMessenger = (): UseChatMessengerReturn => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[] | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string>('c4');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setChatRooms(mockChatRooms);
      } catch {
        setError(new Error('Failed to load chats'));
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const activeRoom = chatRooms?.find((room) => room.id === activeRoomId) || null;

  const sendMessage = (content: string) => {
    if (!chatRooms || !activeRoomId || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatRooms(
      (prev) =>
        prev?.map((room) =>
          room.id === activeRoomId ? { ...room, messages: [...room.messages, newMessage] } : room
        ) || null
    );
  };

  return { chatRooms, activeRoom, loading, error, setActiveRoomId, sendMessage };
};
