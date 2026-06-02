import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header/Header';
import { filterData, GENRE_I18N_MAP } from '@umamusumeenjoyer/shared-logic/dist/features/animeSearch/components/filterBar/filter.data';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Browse'>;

// Bảng màu đẹp mắt để áp dụng ngẫu nhiên cho các thẻ (Genres)
const COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#22C55E'
];

const BrowseScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(['AnimeSearch', 'Header']);
  const navigation = useNavigation<NavigationProp>();

  const handleSelectGenre = (genre: string) => {
    navigation.navigate('AnimeSearch', { initialFilters: { genre } });
  };

  const handleSelectSeason = (season: string) => {
    navigation.navigate('AnimeSearch', { initialFilters: { season } });
  };

  const handleSelectFormat = (format: string) => {
    navigation.navigate('AnimeSearch', { initialFilters: { format } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgApp }]}>
      <Header title={t('Header:navigation.browse', 'Browse Catalog')} showDefaultRightActions />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* SECTION: GENRES */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {t('AnimeSearch:filterBar.labels.genres', 'Genres')}
          </Text>
          <View style={styles.grid}>
            {filterData.genres.map((genre, index) => {
              const mapKey = GENRE_I18N_MAP[genre] || genre;
              const label = t(`AnimeSearch:filterBar.options.genres.${mapKey}`, genre);
              const color = COLORS[index % COLORS.length];
              
              return (
                <TouchableOpacity
                  key={genre}
                  style={[styles.card, { backgroundColor: color + '22', borderColor: color + '55' }]}
                  onPress={() => handleSelectGenre(genre)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cardText, { color: color }]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECTION: SEASONS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {t('AnimeSearch:filterBar.labels.season', 'Seasons')}
          </Text>
          <View style={styles.rowGrid}>
            {filterData.seasons.map((season, index) => {
              const label = t(`AnimeSearch:filterBar.options.seasons.${season.label}`, season.value);
              const color = COLORS[(index + 3) % COLORS.length];
              return (
                <TouchableOpacity
                  key={season.value}
                  style={[styles.rowCard, { backgroundColor: theme.bgPanel, borderColor: color }]}
                  onPress={() => handleSelectSeason(season.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.rowCardText, { color: theme.textPrimary }]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECTION: FORMATS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {t('AnimeSearch:filterBar.labels.format', 'Formats')}
          </Text>
          <View style={styles.rowGrid}>
            {filterData.formats.map((format, index) => {
              const label = t(`AnimeSearch:filterBar.options.formats.${format.label}`, format.value);
              const color = COLORS[(index + 5) % COLORS.length];
              return (
                <TouchableOpacity
                  key={format.value}
                  style={[styles.rowCard, { backgroundColor: theme.bgPanel, borderColor: color }]}
                  onPress={() => handleSelectFormat(format.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.rowCardText, { color: theme.textPrimary }]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  card: { 
    width: '48%', 
    paddingVertical: 20, 
    paddingHorizontal: 12, 
    borderRadius: 16, 
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cardText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  rowGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  rowCard: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderLeftWidth: 3,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  rowCardText: { fontSize: 14, fontWeight: '600' }
});

export default BrowseScreen;
