export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

export interface ChatMessage {
  id: string;
  sender: ChatUser;
  content: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  type: 'dm' | 'server';
  name: string;
  description?: string;
  members: ChatUser[];
  messages: ChatMessage[];
}

export interface UseChatMessengerReturn {
  chatRooms: ChatRoom[] | null;
  activeRoom: ChatRoom | null;
  loading: boolean;
  error: Error | null;
  setActiveRoomId: (id: string) => void;
  sendMessage: (content: string) => void;
}
