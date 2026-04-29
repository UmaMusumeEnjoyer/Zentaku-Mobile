import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useAnimeDetail } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';
import { ENV } from '../../utils/env';

type Props = NativeStackScreenProps<RootStackParamList, 'AnimeWatch'>;

type Episode = {
  id: string;
  number: number;
  title: string;
};

type Server = {
  id: string;
  name: string;
  type: 'sub' | 'dub';
};

type StreamData = {
  videoUrl: string;
  subUrl: string | null;
  referer: string | null;
};

const DEFAULT_BACKEND = '/api';

const toSafeHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

const getApiBaseUrl = () => {
  const configuredBase = ENV.API_BASE_URL?.trim();
  if (configuredBase) return configuredBase.replace(/\/$/, '');

  const backendDomain = ENV.BACKEND_DOMAIN?.trim();
  if (backendDomain) {
    return `${backendDomain.replace(/\/$/, '')}/api`;
  }

  return DEFAULT_BACKEND;
};

const stripHtml = (value?: string | null) => {
  if (!value) return '';

  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
};

const AnimeWatchScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation(['common', 'AnimeModal']);
  const { width } = useWindowDimensions();
  const { anime, loading, error } = useAnimeDetail(id);

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [servers] = useState<Server[]>([
    { id: 'hd-1', name: 'Vidstreaming (HD-1)', type: 'sub' },
    { id: 'hd-2', name: 'Vidcloud (HD-2)', type: 'sub' },
  ]);
  const [activeServerId, setActiveServerId] = useState('hd-1');
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [loadingStream, setLoadingStream] = useState(false);
  const [watchError, setWatchError] = useState<string | null>(null);

  const apiBaseUrl = getApiBaseUrl();
  const bannerHeight = Math.min(Math.max(width * 0.56, 220), 320);
  const s = makeStyles(theme, bannerHeight);

  useEffect(() => {
    let isMounted = true;

    setEpisodes([]);
    setCurrentEpisode(null);
    setStreamData(null);
    setWatchError(null);

    const fetchEpisodes = async () => {
      setLoadingEpisodes(true);

      try {
        const response = await fetch(`${apiBaseUrl}/anime/${encodeURIComponent(id)}/episodes`);
        if (!response.ok) {
          throw new Error('Failed to fetch episodes');
        }

        const data = await response.json();
        const mappedEpisodes: Episode[] = (data.episodes || [])
          .map((episode: any) => ({
            id: String(episode.episodeId ?? episode.id),
            number: Number(episode.number ?? 0),
            title: String(episode.title ?? `Episode ${episode.number ?? ''}`).trim(),
          }))
          .sort((left: Episode, right: Episode) => left.number - right.number);

        if (!isMounted) return;

        setEpisodes(mappedEpisodes);
        setCurrentEpisode((previous) => previous ?? mappedEpisodes[0] ?? null);

        if (mappedEpisodes.length === 0) {
          setWatchError('This anime does not have any episodes yet.');
        }
      } catch (fetchError) {
        if (!isMounted) return;

        setWatchError(fetchError instanceof Error ? fetchError.message : 'Unable to load episodes');
      } finally {
        if (isMounted) {
          setLoadingEpisodes(false);
        }
      }
    };

    fetchEpisodes();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, id]);

  useEffect(() => {
    if (!currentEpisode) {
      setStreamData(null);
      return;
    }

    let isMounted = true;

    const fetchStream = async () => {
      setLoadingStream(true);
      setWatchError(null);

      try {
        const response = await fetch(
          `${apiBaseUrl}/anime/episode-src?id=${encodeURIComponent(currentEpisode.id)}&server=${encodeURIComponent(activeServerId)}&category=sub`,
        );

        if (!response.ok) {
          throw new Error('Unable to load stream source');
        }

        const data = await response.json();

        if (!isMounted) return;

        setStreamData({
          videoUrl: String(data.video ?? ''),
          subUrl: data.sub ? String(data.sub) : null,
          referer: data.referer ? String(data.referer) : null,
        });
      } catch (fetchError) {
        if (!isMounted) return;

        setStreamData(null);
        setWatchError(fetchError instanceof Error ? fetchError.message : 'Unable to load stream source');
      } finally {
        if (isMounted) {
          setLoadingStream(false);
        }
      }
    };

    fetchStream();

    return () => {
      isMounted = false;
    };
  }, [activeServerId, apiBaseUrl, currentEpisode]);

  const playerSource = useMemo(() => {
    if (!streamData?.videoUrl) return null;

    const safeVideoUrl = toSafeHttpUrl(streamData.videoUrl);
    if (!safeVideoUrl) return null;

    return {
      uri: safeVideoUrl,
      headers: { Referer: new URL(safeVideoUrl).origin },
      contentType: safeVideoUrl.includes('.m3u8') ? 'hls' : 'auto',
      useCaching: true,
    } as const;
  }, [streamData]);

  const player = useVideoPlayer(playerSource, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.play();
  });

  const currentEpisodeIndex = currentEpisode ? episodes.findIndex((episode) => episode.id === currentEpisode.id) : -1;

  const goToEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  const goToPreviousEpisode = () => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisode(episodes[currentEpisodeIndex - 1]);
    }
  };

  const goToNextEpisode = () => {
    if (currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentEpisodeIndex + 1]);
    }
  };

  if (loading || loadingEpisodes) {
    return (
      <SafeAreaView style={s.safeArea}>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bgApp}
        />
        <View style={s.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={s.loadingText}>{t('common:loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !anime) {
    return (
      <SafeAreaView style={s.safeArea}>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bgApp}
        />
        <View style={s.centerContainer}>
          <Text style={s.errorText}>{error || 'Anime not found'}</Text>
          <TouchableOpacity style={s.backButton} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <Text style={s.backButtonText}>{t('common:buttons.go_back') || 'Go Back'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const description = stripHtml(anime.desc);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />

      <ScrollView style={s.scrollView} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={s.backOverlay} onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>

        {anime.banner_image ? (
          <Image source={{ uri: anime.banner_image }} style={s.bannerImage} resizeMode="cover" />
        ) : (
          <View style={s.bannerPlaceholder} />
        )}

        <View style={s.contentWrapper}>
          <View style={s.headerCard}>
            <Image source={{ uri: anime.cover_image }} style={s.posterImage} resizeMode="cover" />

            <View style={s.headerContent}>
              <Text style={s.title} numberOfLines={3}>
                {anime.name_romaji}
              </Text>

              <View style={s.metaRow}>
                <Text style={s.metaText}>{anime.airing_status || 'Unknown'}</Text>
                <Text style={s.metaDot}>•</Text>
                <Text style={s.metaText}>{anime.airing_format || 'Unknown'}</Text>
              </View>

              <Text style={s.synopsis} numberOfLines={4}>
                {description || 'No synopsis available.'}
              </Text>

              <TouchableOpacity style={s.openButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
                <Text style={s.openButtonText}>Back to details</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.playerCard}>
            {playerSource ? (
              <>
                <VideoView
                  style={s.video}
                  player={player}
                  nativeControls
                  allowsPictureInPicture
                  contentFit="contain"
                  surfaceType={Platform.OS === 'android' ? 'textureView' : undefined}
                  fullscreenOptions={{ enable: true }}
                />
                {loadingStream ? (
                  <View style={s.playerLoadingOverlay}>
                    <ActivityIndicator size="large" color={theme.primary} />
                  </View>
                ) : null}
              </>
            ) : (
              <View style={s.playerFallback}>
                <Text style={s.playerFallbackTitle}>{watchError || 'Preparing player...'}</Text>
                <Text style={s.playerFallbackText}>Select an episode to start watching.</Text>
              </View>
            )}
          </View>

          <View style={s.controlsCard}>
            <View style={s.controlsRow}>
              <TouchableOpacity
                style={[s.controlButton, currentEpisodeIndex <= 0 && s.controlButtonDisabled]}
                onPress={goToPreviousEpisode}
                disabled={currentEpisodeIndex <= 0}
                activeOpacity={0.75}
              >
                <Text style={s.controlButtonText}>Prev</Text>
              </TouchableOpacity>

              <View style={s.currentEpisodeBadge}>
                <Text style={s.currentEpisodeLabel}>Current</Text>
                <Text style={s.currentEpisodeText} numberOfLines={1}>
                  {currentEpisode ? `Episode ${currentEpisode.number}${currentEpisode.title ? ` - ${currentEpisode.title}` : ''}` : 'No episode selected'}
                </Text>
              </View>

              <TouchableOpacity
                style={[s.controlButton, currentEpisodeIndex === episodes.length - 1 && s.controlButtonDisabled]}
                onPress={goToNextEpisode}
                disabled={currentEpisodeIndex === episodes.length - 1}
                activeOpacity={0.75}
              >
                <Text style={s.controlButtonText}>Next</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.serverRow}>
              {servers.map((server) => {
                const isActive = server.id === activeServerId;

                return (
                  <TouchableOpacity
                    key={server.id}
                    style={[s.serverChip, isActive && s.serverChipActive]}
                    onPress={() => setActiveServerId(server.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.serverChipText, isActive && s.serverChipTextActive]}>{server.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.episodeRow}>
              {episodes.map((episode) => {
                const isActive = episode.id === currentEpisode?.id;

                return (
                  <TouchableOpacity
                    key={episode.id}
                    style={[s.episodeChip, isActive && s.episodeChipActive]}
                    onPress={() => goToEpisode(episode)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.episodeChipLabel, isActive && s.episodeChipLabelActive]}>
                      EP {episode.number}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {watchError ? <Text style={s.warningText}>{watchError}</Text> : null}
          </View>
        </View>

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeTokens, bannerHeight: number) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacing['10'],
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing['4'],
    },
    loadingText: {
      marginTop: spacing['3'],
      color: theme.textSecondary,
      fontSize: typography.fontSize.base,
    },
    errorText: {
      color: theme.statusError,
      fontSize: typography.fontSize.md,
      textAlign: 'center',
      marginBottom: spacing['4'],
    },
    backButton: {
      backgroundColor: theme.btnPrimaryBg,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['5'],
      borderRadius: radius.md,
    },
    backButtonText: {
      color: theme.btnPrimaryText,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
    },
    backOverlay: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 40 : spacing['3'],
      left: spacing['3'],
      zIndex: 20,
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backArrow: {
      color: '#FFFFFF',
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginTop: -2,
    },
    bannerImage: {
      width: '100%',
      height: bannerHeight,
    },
    bannerPlaceholder: {
      width: '100%',
      height: bannerHeight,
      backgroundColor: theme.bgPanel,
    },
    contentWrapper: {
      paddingHorizontal: spacing['4'],
      marginTop: spacing['4'],
    },
    headerCard: {
      flexDirection: 'row',
      gap: spacing['3'],
      padding: spacing['3'],
      borderRadius: radius.lg,
      backgroundColor: theme.bgPanel,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    posterImage: {
      width: 110,
      height: 156,
      borderRadius: radius.md,
      backgroundColor: theme.bgHover,
    },
    headerContent: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'space-between',
    },
    title: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing['2'],
      flexWrap: 'wrap',
    },
    metaText: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
    },
    metaDot: {
      color: theme.textSecondary,
      marginHorizontal: spacing['1'],
    },
    synopsis: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.normal,
      marginTop: spacing['2'],
    },
    openButton: {
      marginTop: spacing['3'],
      backgroundColor: theme.btnPrimaryBg,
      paddingVertical: spacing['2'],
      borderRadius: radius.md,
      alignItems: 'center',
    },
    openButtonText: {
      color: theme.btnPrimaryText,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
    },
    playerCard: {
      position: 'relative',
      marginTop: spacing['4'],
      borderRadius: radius.lg,
      overflow: 'hidden',
      backgroundColor: '#000000',
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      height: 220,
    },
    video: {
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
    },
    playerLoadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    playerFallback: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing['4'],
      backgroundColor: theme.bgSubtle,
    },
    playerFallbackTitle: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      textAlign: 'center',
    },
    playerFallbackText: {
      marginTop: spacing['2'],
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
      textAlign: 'center',
      lineHeight: typography.lineHeight.normal,
    },
    controlsCard: {
      marginTop: spacing['4'],
      padding: spacing['3'],
      borderRadius: radius.lg,
      backgroundColor: theme.bgPanel,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: spacing['2'],
    },
    controlButton: {
      minWidth: 60,
      paddingHorizontal: spacing['3'],
      borderRadius: radius.md,
      backgroundColor: theme.bgSubtle,
      alignItems: 'center',
      justifyContent: 'center',
    },
    controlButtonDisabled: {
      opacity: 0.45,
    },
    controlButtonText: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
    },
    currentEpisodeBadge: {
      flex: 1,
      minWidth: 0,
      borderRadius: radius.md,
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['2'],
      backgroundColor: theme.bgSubtle,
      justifyContent: 'center',
    },
    currentEpisodeLabel: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    currentEpisodeText: {
      marginTop: 2,
      color: theme.textPrimary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
    },
    serverRow: {
      gap: spacing['2'],
      paddingTop: spacing['3'],
    },
    serverChip: {
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      backgroundColor: theme.bgSubtle,
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['2'],
    },
    serverChipActive: {
      backgroundColor: theme.btnPrimaryBg,
      borderColor: theme.btnPrimaryBg,
    },
    serverChipText: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
    },
    serverChipTextActive: {
      color: theme.btnPrimaryText,
    },
    episodeRow: {
      gap: spacing['2'],
      paddingTop: spacing['3'],
    },
    episodeChip: {
      minWidth: 68,
      borderRadius: radius.md,
      backgroundColor: theme.bgSubtle,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['2'],
      alignItems: 'center',
    },
    episodeChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    episodeChipLabel: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
    },
    episodeChipLabelActive: {
      color: theme.textOnPrimary,
    },
    warningText: {
      marginTop: spacing['3'],
      color: theme.statusError,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.normal,
    },
    bottomSpacer: {
      height: spacing['10'],
    },
  });

export default AnimeWatchScreen;