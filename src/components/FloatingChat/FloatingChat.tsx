import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { MainStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const FloatingChat: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  // Không hiển thị nếu chưa đăng nhập
  if (!user) return null;

  const handlePress = () => {
    navigation.navigate('ChatApp');
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.primary },
        Platform.OS === 'ios' && styles.shadowIOS,
        Platform.OS === 'android' && styles.shadowAndroid,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <MessageCircle size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Để tránh đè lên BottomNav (thường khoảng 60-70px)
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  shadowAndroid: {
    elevation: 6,
  },
});

export default FloatingChat;
