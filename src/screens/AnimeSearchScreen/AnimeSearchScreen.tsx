/**
 * src/screens/AnimeSearchScreen.tsx
 * Mobile version of Anime Search with web-equivalent behavior.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimeCard from '../../components/AnimeCard/AnimeCard';
import AnimeSection from '../../components/AnimeSection/AnimeSection';
import { animeService } from '@umamusumeenjoyer/shared-logic/dist/services/anime.service';
import { heroList, trendingAnime, popularSeason, upcomingNext, allTimePopular } from '@umamusumeenjoyer/shared-logic/dist/features/animeSearch/animeSearchConstants';
import { filterData, GENRE_I18N_MAP } from '@umamusumeenjoyer/shared-logic/dist/features/animeSearch/components/filterBar/filter.data';
import { getCurrentSeasonInfo, getNextSeasonInfo } from '@umamusumeenjoyer/shared-logic/dist/shared/utils/seasonUtils';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import type { AnimeData_animeSearch as AnimeType, AnimeFilters } from '@umamusumeenjoyer/shared-logic/dist/features/animeSearch/animeSearch.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'AnimeSearch'>;
type SearchMode = 'HOME' | 'RESULTS';
type ViewAllType = 'TRENDING_NOW' | 'POPULAR_THIS_SEASON' | 'UPCOMING_NEXT_SEASON';
type FilterKey = 'genre' | 'year' | 'season' | 'format' | 'status' | 'sort';

const SESSION_KEY = 'ANIME_SEARCH_STATE_MOBILE';
const PAGE_SIZE = 20;

const defaultFilters: AnimeFilters = {
  genre: 'Any',
  year: 'Any',
  season: 'Any',
  format: 'Any',
  status: 'Any',
  sort: 'POPULARITY_DESC',
};

interface SearchSessionStateMobile {
  searchResults: AnimeType[];
  isSearching: boolean;
  viewTitle: string;
  page: number;
  canLoadMore: boolean;
  currentFilters: {
    keyword: string;
    filters: AnimeFilters;
    hasFilter?: boolean;
  } | null;
}

const mapAnimeData = (rawItem: any): AnimeType => ({
  ...rawItem,
  id: rawItem.id,
  anilist_id: rawItem.id,
  title_romaji: rawItem.title_romaji || rawItem.name_romaji || rawItem.romaji,
  name_romaji: rawItem.name_romaji || rawItem.romaji,
  name_english: rawItem.name_english || rawItem.english,
  name_native: rawItem.name_native || rawItem.native,
  cover_image: rawItem.cover_image || rawItem.cover,
  episodes: rawItem.airing_episodes || rawItem.episodes,
  average_score: rawItem.average_score,
  season: rawItem.season,
  next_airing_ep: rawItem.next_airing_ep ?? null,
});

const AnimeSearchScreen: React.FC<Props> = () => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const { t } = useTranslation(['AnimeSearch', 'AnimeSection', 'common']);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<AnimeFilters>(defaultFilters);
  const [mode, setMode] = useState<SearchMode>('HOME');
  const [viewTitle, setViewTitle] = useState<string>(t('searchResults.title', 'Search Results'));
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeFilterKey, setActiveFilterKey] = useState<FilterKey | null>(null);
  const [results, setResults] = useState<AnimeType[]>([]);
  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<{
    keyword: string;
    filters: AnimeFilters;
    hasFilter?: boolean;
  } | null>(null);

  const requestIdRef = useRef(0);

  const isSearching = mode === 'RESULTS';

  const heroWidth = useMemo(() => Math.max(300, screenWidth - 24), [screenWidth]);

  const saveSession = useCallback(async () => {
    if (!isSearching) {
      await AsyncStorage.removeItem(SESSION_KEY);
      return;
    }

    const stateToSave: SearchSessionStateMobile = {
      searchResults: results,
      isSearching: true,
      viewTitle,
      page,
      canLoadMore,
      currentFilters,
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
  }, [isSearching, results, viewTitle, page, canLoadMore, currentFilters]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedState = await AsyncStorage.getItem(SESSION_KEY);
        if (!savedState) return;

        const parsed: SearchSessionStateMobile = JSON.parse(savedState);
        if (!parsed?.isSearching) return;

        setResults(parsed.searchResults ?? []);
        setMode('RESULTS');
        setViewTitle(parsed.viewTitle ?? t('searchResults.title', 'Search Results'));
        setPage(parsed.page ?? 1);
        setCanLoadMore(Boolean(parsed.canLoadMore));
        setCurrentFilters(parsed.currentFilters ?? null);
        if (parsed.currentFilters) {
          setQuery(parsed.currentFilters.keyword ?? '');
          setFilters({ ...defaultFilters, ...parsed.currentFilters.filters });
        }
      } catch (error) {
        await AsyncStorage.removeItem(SESSION_KEY);
      }
    };

    restoreSession();
  }, [t]);

  useEffect(() => {
    saveSession();
  }, [saveSession]);

  const handleBackToHome = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setMode('HOME');
    setResults([]);
    setPage(1);
    setCanLoadMore(false);
    setCurrentFilters(null);
    setQuery('');
    setFilters(defaultFilters);
    setViewTitle(t('searchResults.title', 'Search Results'));
  }, [t]);

  const handleSearch = useCallback(
    async (keyword: string, nextFilters: AnimeFilters, options?: { viewTitle?: string }) => {
      const hasFilter = Boolean(
        (nextFilters.genre && nextFilters.genre !== 'Any') ||
          (nextFilters.year && nextFilters.year !== 'Any') ||
          (nextFilters.season && nextFilters.season !== 'Any') ||
          (nextFilters.format && nextFilters.format !== 'Any') ||
          (nextFilters.status && nextFilters.status !== 'Any')
      );

      const trimmedKeyword = keyword.trim();
      const hasNonDefaultSort = Boolean(nextFilters.sort && nextFilters.sort !== 'POPULARITY_DESC');

      if (!trimmedKeyword && !hasFilter && !hasNonDefaultSort) {
        handleBackToHome();
        return;
      }

      const requestId = ++requestIdRef.current;

      setLoading(true);
      setMode('RESULTS');
      setViewTitle(options?.viewTitle ?? t('searchResults.title', 'Search Results'));
      setResults([]);
      setPage(1);
      setCurrentFilters({ keyword: trimmedKeyword, filters: nextFilters, hasFilter });

      try {
        let mappedResults: AnimeType[] = [];

        if (hasFilter || hasNonDefaultSort) {
          const criteriaBody: any = { page: 1, perpage: PAGE_SIZE };

          if (nextFilters.year && nextFilters.year !== 'Any') criteriaBody.year = parseInt(nextFilters.year.toString(), 10);
          if (nextFilters.season && nextFilters.season !== 'Any') criteriaBody.season = nextFilters.season;
          if (nextFilters.format && nextFilters.format !== 'Any') criteriaBody.format = nextFilters.format;
          if (nextFilters.genre && nextFilters.genre !== 'Any') criteriaBody.genres = nextFilters.genre;
          if (nextFilters.status && nextFilters.status !== 'Any') criteriaBody.status = nextFilters.status;
          if (nextFilters.sort) criteriaBody.sort = nextFilters.sort;
          if (trimmedKeyword) criteriaBody.search = trimmedKeyword;

          const response = await animeService.searchAnimeByCriteria(criteriaBody);
          const rawResults = response?.data?.results || [];
          mappedResults = rawResults.map(mapAnimeData);

          if (requestId === requestIdRef.current) {
            setCanLoadMore(rawResults.length === PAGE_SIZE);
          }
        } else {
          const response = await animeService.searchByName(trimmedKeyword);
          const rawCandidates = response?.data?.candidates || [];
          mappedResults = rawCandidates.map(mapAnimeData);

          if (requestId === requestIdRef.current) {
            setCanLoadMore(false);
          }
        }

        if (requestId === requestIdRef.current) {
          setResults(mappedResults);
        }
      } catch (err) {
        if (requestId === requestIdRef.current) {
          setResults([]);
          setCanLoadMore(false);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [handleBackToHome, t]
  );

  const handleSearchFromUI = useCallback(() => {
    handleSearch(query, filters);
  }, [handleSearch, query, filters]);

  const handleFilterChange = useCallback(
    (key: FilterKey, value: string) => {
      const updatedFilters: AnimeFilters = { ...filters, [key]: value };
      setFilters(updatedFilters);
      setActiveFilterKey(null);
      handleSearch(query, updatedFilters);
    },
    [filters, handleSearch, query]
  );

  const handleClearFilters = useCallback(() => {
    setQuery('');
    setFilters(defaultFilters);
    handleBackToHome();
  }, [handleBackToHome]);

  const handleViewAllClick = useCallback(
    async (type: ViewAllType) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setMode('RESULTS');
      setResults([]);
      setPage(1);
      setCanLoadMore(false);
      setCurrentFilters(null);

      try {
        if (type === 'TRENDING_NOW') {
          setViewTitle(t('sections.trendingNow', 'Trending Now'));
          const response = await animeService.getTrending();
          const rawResults = response?.data?.trending || [];
          if (requestId === requestIdRef.current) {
            setResults(rawResults.map(mapAnimeData));
          }
          return;
        }

        let targetFilters: AnimeFilters = { ...defaultFilters };
        let targetTitle = t('searchResults.title', 'Search Results');

        if (type === 'POPULAR_THIS_SEASON') {
          const { year, season } = getCurrentSeasonInfo();
          targetFilters = { ...targetFilters, year, season };
          targetTitle = t('sections.popularThisSeason', 'Popular This Season');
        } else if (type === 'UPCOMING_NEXT_SEASON') {
          const { year, season } = getNextSeasonInfo();
          targetFilters = { ...targetFilters, year, season };
          targetTitle = t('sections.upcomingNextSeason', 'Upcoming Next Season');
        }

        if (requestId === requestIdRef.current) {
          setViewTitle(targetTitle);
          setFilters(targetFilters);
        }

        await handleSearch('', targetFilters, { viewTitle: targetTitle });
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setResults([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [handleSearch, t]
  );

  const handleLoadMore = useCallback(async () => {
    if (!currentFilters || loadingMore || loading || !canLoadMore) {
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const { keyword, filters: activeFilters } = currentFilters;
      const criteriaBody: any = { page: nextPage, perpage: PAGE_SIZE };

      if (activeFilters.year && activeFilters.year !== 'Any') criteriaBody.year = parseInt(activeFilters.year.toString(), 10);
      if (activeFilters.season && activeFilters.season !== 'Any') criteriaBody.season = activeFilters.season;
      if (activeFilters.format && activeFilters.format !== 'Any') criteriaBody.format = activeFilters.format;
      if (activeFilters.genre && activeFilters.genre !== 'Any') criteriaBody.genres = activeFilters.genre;
      if (activeFilters.status && activeFilters.status !== 'Any') criteriaBody.status = activeFilters.status;
      if (activeFilters.sort) criteriaBody.sort = activeFilters.sort;
      if (keyword && keyword.trim() !== '') criteriaBody.search = keyword.trim();

      const response = await animeService.searchAnimeByCriteria(criteriaBody);
      const rawResults = response?.data?.results || [];
      const mapped = rawResults.map(mapAnimeData);

      if (requestId === requestIdRef.current) {
        setResults((prev) => [...prev, ...mapped]);
        setPage(nextPage);
        setCanLoadMore(rawResults.length === PAGE_SIZE);
      }
    } catch (error) {
      if (requestId === requestIdRef.current) {
        setCanLoadMore(false);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingMore(false);
      }
    }
  }, [canLoadMore, currentFilters, loading, loadingMore, page]);

  const renderHero = () => {
    if (!heroList.length) return null;

    return (
      <View style={styles.heroContainer}>
        <ScrollView
          horizontal
          snapToInterval={heroWidth + 12}
          decelerationRate="fast"
          disableIntervalMomentum
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.heroScrollContent}
          onScroll={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / Math.max(1, heroWidth + 12));
            setHeroIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {heroList.map((slide: any) => (
            <ImageBackground
              key={String(slide.id)}
              source={{ uri: slide.bannerUrl }}
              style={[styles.heroSlide, { width: heroWidth }]}
              imageStyle={styles.heroImage}
            >
              <View style={styles.heroOverlay} />
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroTitle}>{slide.title}</Text>
                <Text style={styles.heroDesc} numberOfLines={3}>{slide.description}</Text>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        <View style={styles.heroDots}>
          {heroList.map((_: any, idx: number) => (
            <View
              key={`hero-dot-${idx}`}
              style={[
                styles.heroDot,
                { backgroundColor: idx === heroIndex ? theme.primary : theme.borderSubtle },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const getFilterTitle = useCallback(
    (key: FilterKey) => {
      switch (key) {
        case 'genre':
          return t('filterBar.labels.genres', 'Genres');
        case 'year':
          return t('filterBar.labels.year', 'Year');
        case 'season':
          return t('filterBar.labels.season', 'Season');
        case 'format':
          return t('filterBar.labels.format', 'Format');
        case 'status':
          return t('filterBar.labels.status', 'Status');
        case 'sort':
          return t('filterBar.labels.sort', 'Sort');
        default:
          return key;
      }
    },
    [t]
  );

  const getFilterOptions = useCallback((key: FilterKey) => {
    if (key === 'genre') return ['Any', ...filterData.genres];
    if (key === 'year') return ['Any', ...filterData.years.map((y) => String(y))];
    if (key === 'season') return ['Any', ...filterData.seasons.map((item) => item.value)];
    if (key === 'format') return ['Any', ...filterData.formats.map((item) => item.value)];
    if (key === 'status') return ['Any', ...filterData.statuses.map((item) => item.value)];
    return filterData.sorts.map((item) => item.value);
  }, []);

  const getFilterDisplayValue = useCallback(
    (key: FilterKey, value: string) => {
      if (value === 'Any') {
        return t('filterBar.options.any', 'Any');
      }

      if (key === 'genre') {
        const mapKey = GENRE_I18N_MAP[value] || value;
        return t(`filterBar.options.genres.${mapKey}`, value);
      }

      if (key === 'season') {
        const seasonItem = filterData.seasons.find((item) => item.value === value);
        return t(`filterBar.options.seasons.${seasonItem?.label ?? value.toLowerCase()}`, value);
      }

      if (key === 'format') {
        const formatItem = filterData.formats.find((item) => item.value === value);
        return t(`filterBar.options.formats.${formatItem?.label ?? value.toLowerCase()}`, value);
      }

      if (key === 'status') {
        const statusItem = filterData.statuses.find((item) => item.value === value);
        return t(`filterBar.options.statuses.${statusItem?.label ?? value.toLowerCase()}`, value);
      }

      if (key === 'sort') {
        const sortItem = filterData.sorts.find((item) => item.value === value);
        return t(`filterBar.options.sorts.${sortItem?.label ?? value.toLowerCase()}`, value);
      }

      return value;
    },
    [t]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgApp }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{t('title', 'Search Anime')}</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          placeholder={t('filterBar.placeholder.search', 'Search by name')}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.textPrimary, borderColor: theme.borderSubtle }]}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearchFromUI}
          returnKeyType="search"
        />
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={handleSearchFromUI}>
          <Text style={styles.btnText}>{t('filterBar.buttons.search', 'Search')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.clearBtn, { borderColor: theme.borderSubtle }]} onPress={handleClearFilters}>
          <Text style={[styles.clearBtnText, { color: theme.textPrimary }]}>{t('filterBar.buttons.clear', 'Clear')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
        {(['genre', 'year', 'season', 'format', 'status', 'sort'] as FilterKey[]).map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterPill,
              {
                borderColor: theme.borderSubtle,
                backgroundColor:
                  (key === 'sort' && filters.sort !== 'POPULARITY_DESC') ||
                  (key !== 'sort' && filters[key] && filters[key] !== 'Any')
                    ? theme.primary + '22'
                    : theme.bgPanel,
              },
            ]}
            onPress={() => setActiveFilterKey(key)}
          >
            <Text style={[styles.filterPillLabel, { color: theme.textSecondary }]}>{getFilterTitle(key)}</Text>
            <Text style={[styles.filterPillValue, { color: theme.textPrimary }]} numberOfLines={1}>
              {getFilterDisplayValue(key, String(filters[key] ?? 'Any'))}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {isSearching ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={[styles.resultsTitle, { color: theme.textPrimary }]}>{viewTitle}</Text>
              <TouchableOpacity onPress={handleBackToHome}>
                <Text style={[styles.backText, { color: theme.primary }]}>{t('searchResults.back', 'Back')}</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} />
            ) : results.length === 0 ? (
              <View style={styles.empty}>
                <Text style={{ color: theme.textSecondary }}>{t('searchResults.noResults', 'No results — try another keyword')}</Text>
              </View>
            ) : (
              <FlatList
                data={results}
                numColumns={2}
                keyExtractor={(item: any, index) => String(item.id ?? item.anilist_id ?? item.name_romaji ?? index)}
                columnWrapperStyle={styles.resultsRow}
                renderItem={({ item }) => (
                  <View style={styles.gridItemWrap}>
                    <AnimeCard anime={item as any} style={styles.gridCard} />
                  </View>
                )}
                ListFooterComponent={
                  <>
                    {loadingMore ? <ActivityIndicator size="small" color={theme.primary} style={styles.loadMoreIndicator} /> : null}
                    {!loadingMore && canLoadMore ? (
                      <TouchableOpacity style={[styles.loadMoreBtn, { backgroundColor: theme.primary }]} onPress={handleLoadMore}>
                        <Text style={styles.loadMoreBtnText}>{t('searchResults.seeMore', 'See More')}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                }
                contentContainerStyle={{ paddingBottom: 120 }}
              />
            )}
          </>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            {renderHero()}

            <AnimeSection
              title={t('sections.trendingNow', 'Trending Now')}
              animeList={trendingAnime as any}
              onViewAll={() => handleViewAllClick('TRENDING_NOW')}
              viewAllLabel={t('buttons.view_all', 'View All')}
            />
            <AnimeSection
              title={t('sections.popularThisSeason', 'Popular This Season')}
              animeList={popularSeason as any}
              onViewAll={() => handleViewAllClick('POPULAR_THIS_SEASON')}
              viewAllLabel={t('buttons.view_all', 'View All')}
            />
            <AnimeSection
              title={t('sections.upcomingNextSeason', 'Upcoming Next Season')}
              animeList={upcomingNext as any}
              onViewAll={() => handleViewAllClick('UPCOMING_NEXT_SEASON')}
              viewAllLabel={t('buttons.view_all', 'View All')}
            />
            <AnimeSection
              title={t('sections.allTimePopular', 'All Time Popular')}
              animeList={allTimePopular as any}
            />
          </ScrollView>
        )}
      </View>

      <Modal visible={!!activeFilterKey} transparent animationType="fade" onRequestClose={() => setActiveFilterKey(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setActiveFilterKey(null)}>
          <Pressable style={[styles.modalContent, { backgroundColor: theme.bgPanel }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              {activeFilterKey ? getFilterTitle(activeFilterKey) : ''}
            </Text>
            <ScrollView>
              {activeFilterKey
                ? getFilterOptions(activeFilterKey).map((option) => {
                    const isSelected = String(filters[activeFilterKey]) === String(option);
                    return (
                      <TouchableOpacity
                        key={String(option)}
                        style={[
                          styles.optionItem,
                          { borderBottomColor: theme.borderSubtle, backgroundColor: isSelected ? theme.primary + '22' : 'transparent' },
                        ]}
                        onPress={() => handleFilterChange(activeFilterKey, String(option))}
                      >
                        <Text style={[styles.optionText, { color: theme.textPrimary }]}>
                          {getFilterDisplayValue(activeFilterKey, String(option))}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  searchRow: { flexDirection: 'row', paddingHorizontal: 12, alignItems: 'center', marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginRight: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
  clearBtn: { borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 10 },
  clearBtnText: { fontWeight: '600' },
  filterPillsRow: { paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
  filterPill: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, minWidth: 120 },
  filterPillLabel: { fontSize: 11, marginBottom: 2 },
  filterPillValue: { fontSize: 13, fontWeight: '600' },
  content: { flex: 1 },
  heroContainer: { marginBottom: 12 },
  heroScrollContent: { paddingHorizontal: 12 },
  heroSlide: { height: 200, marginRight: 12, borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImage: { borderRadius: 12 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.40)' },
  heroTextWrap: { padding: 14 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  heroDesc: { color: '#f2f2f2', fontSize: 13, lineHeight: 18 },
  heroDots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 },
  heroDot: { width: 8, height: 8, borderRadius: 4 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8 },
  resultsTitle: { fontSize: 20, fontWeight: '700' },
  backText: { fontSize: 14, fontWeight: '600' },
  resultsRow: { justifyContent: 'space-between', paddingHorizontal: 12 },
  gridItemWrap: { width: '49%', marginBottom: 12 },
  gridCard: { width: '100%', marginRight: 0 },
  loadMoreBtn: { marginHorizontal: 12, marginTop: 8, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  loadMoreBtnText: { color: '#fff', fontWeight: '700' },
  loadMoreIndicator: { marginVertical: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  cardWrap: { marginVertical: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 16 },
  modalContent: { borderRadius: 12, maxHeight: '70%', paddingVertical: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 12, marginBottom: 6 },
  optionItem: { paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1 },
  optionText: { fontSize: 14, fontWeight: '500' },
});

export default AnimeSearchScreen;
