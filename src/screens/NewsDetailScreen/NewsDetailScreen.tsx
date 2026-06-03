import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Share2 } from 'lucide-react-native';

import { useNewsDetailLogic } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';

type NewsDetailRouteProp = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>['route'];
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

import NewsDetailSkeleton from './NewsDetailSkeleton';

const NewsDetailScreen: React.FC = () => {
  const route = useRoute<NewsDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { id } = route.params;

  const { theme } = useTheme();
  const { t } = useTranslation(['NewsDetailPage']);
  const s = makeStyles(theme);

  const { newsItem, contentParagraphs, isNotFound, isLoading } = useNewsDetailLogic(id);

  if (isLoading) {
    return <NewsDetailSkeleton />;
  }

  if (isNotFound || !newsItem) {
    return (
      <SafeAreaView style={s.safeArea}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
            <ArrowLeft color={theme.textPrimary} size={24} />
          </TouchableOpacity>
        </View>
        <View style={s.notFoundContainer}>
          <Text style={s.notFoundTitle}>{t('NewsDetailPage:news_detail.not_found.title', 'Not Found')}</Text>
          <Text style={s.notFoundText}>{t('NewsDetailPage:news_detail.not_found.message', { id, defaultValue: `News ${id} not found.` })}</Text>
          <TouchableOpacity style={s.backHomeBtn} onPress={() => navigation.navigate('Main')}>
            <Text style={s.backHomeText}>{t('NewsDetailPage:news_detail.not_found.back_home', 'Back to Home')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
          <ArrowLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{newsItem.title}</Text>
        <TouchableOpacity style={s.iconBtn} onPress={() => { /* Share functionality */ }}>
          <Share2 color={theme.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scrollView} contentContainerStyle={s.contentContainer}>
        <Image 
          source={{ uri: newsItem.img }} 
          style={s.heroImage} 
          resizeMode="cover" 
        />
        
        <View style={s.bodyContent}>
          <Text style={s.title}>{newsItem.title}</Text>

          <View style={s.divider} />

          <View style={s.paragraphsContainer}>
            {contentParagraphs.map((paragraph: string, index: number) => (
              <Text key={index} style={s.paragraph}>{paragraph}</Text>
            ))}
          </View>

          {newsItem.featuredQuote && (
            <View style={s.quoteBox}>
              <Text style={s.quoteText}>"{newsItem.featuredQuote}"</Text>
              {newsItem.quoteAttribution && (
                <Text style={s.quoteAttribution}>— {newsItem.quoteAttribution}</Text>
              )}
            </View>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeTokens) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.bgApp,
    paddingTop: Platform.OS === 'android' ? spacing['4'] : spacing['2'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['2'],
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderSubtle,
  },
  iconBtn: {
    padding: spacing['2'],
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
    textAlign: 'center',
    marginHorizontal: spacing['2'],
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing['10'],
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: theme.bgHover,
  },
  bodyContent: {
    padding: spacing['4'],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
    marginBottom: spacing['2'],
    lineHeight: typography.lineHeight.tight,
  },
  dateText: {
    fontSize: typography.fontSize.sm,
    color: theme.textSecondary,
    marginBottom: spacing['4'],
  },
  divider: {
    height: 1,
    backgroundColor: theme.borderSubtle,
    marginBottom: spacing['4'],
  },
  paragraphsContainer: {
    marginBottom: spacing['4'],
  },
  paragraph: {
    fontSize: typography.fontSize.md,
    color: theme.textPrimary,
    lineHeight: typography.lineHeight.relaxed,
    marginBottom: spacing['4'],
  },
  quoteBox: {
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    backgroundColor: theme.bgPanel,
    padding: spacing['4'],
    borderRadius: radius.md,
    marginTop: spacing['4'],
  },
  quoteText: {
    fontSize: typography.fontSize.lg,
    fontStyle: 'italic',
    color: theme.textPrimary,
    marginBottom: spacing['2'],
    lineHeight: typography.lineHeight.relaxed,
  },
  quoteAttribution: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: theme.textSecondary,
    textAlign: 'right',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['5'],
  },
  notFoundTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
    marginBottom: spacing['2'],
  },
  notFoundText: {
    fontSize: typography.fontSize.md,
    color: theme.textSecondary,
    marginBottom: spacing['6'],
    textAlign: 'center',
  },
  backHomeBtn: {
    backgroundColor: theme.primary,
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['3'],
    borderRadius: radius.md,
  },
  backHomeText: {
    color: theme.btnPrimaryText,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
  }
});

export default NewsDetailScreen;
