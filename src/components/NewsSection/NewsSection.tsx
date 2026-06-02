import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NewsItem {
  id: number;
  title: string;
  img: string;
  snippet: string;
}

interface NewsSectionProps {
  newsList: NewsItem[];
  isLoading?: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({ newsList, isLoading }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['HomePage']);
  const navigation = useNavigation<NavigationProp>();
  const s = makeStyles(theme);

  if (!isLoading && (!newsList || newsList.length === 0)) {
    return null; // Do not render if empty
  }

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity 
      style={s.card} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('NewsDetail', { id: String(item.id) })}
    >
      <Image source={{ uri: item.img }} style={s.image} resizeMode="cover" />
      <View style={s.content}>
        <Text style={s.title} numberOfLines={2}>{item.title}</Text>
        <Text style={s.snippetText} numberOfLines={2}>{item.snippet}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.sectionTitle}>{t('HomePage:sections.news', 'Tin tức mới nhất')}</Text>
      </View>
      
      {isLoading ? (
        <View style={s.loadingContainer}>
          <Text style={{ color: theme.textSecondary }}>Loading news...</Text>
        </View>
      ) : (
        <FlatList
          data={newsList}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.listContent}
          snapToInterval={280 + spacing['4']} // card width + margin
          decelerationRate="fast"
        />
      )}
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) => StyleSheet.create({
  container: {
    marginBottom: spacing['6'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['3'],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing['4'],
  },
  card: {
    width: 280,
    marginRight: spacing['4'],
    backgroundColor: theme.bgPanel,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.borderSubtle,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: theme.bgHover,
  },
  content: {
    padding: spacing['3'],
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
    marginBottom: spacing['2'],
    lineHeight: typography.lineHeight.tight,
  },
  snippetText: {
    fontSize: typography.fontSize.xs,
    color: theme.textSecondary,
    lineHeight: typography.lineHeight.tight,
  },
  loadingContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default NewsSection;
