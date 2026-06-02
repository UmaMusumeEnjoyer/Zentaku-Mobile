import { useState, useEffect, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { mediaService } from '@umamusumeenjoyer/shared-logic';

import type { RootStackParamList } from '../../navigation/types';
import type { ChapterContent, NovelMetadata, UseLightNovelReaderReturn, ViewSettings } from './NovelReader.types';

type NovelReaderRouteProp = NativeStackScreenProps<RootStackParamList, 'NovelReader'>['route'];
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useNovelReader = (): UseLightNovelReaderReturn => {
  const route = useRoute<NovelReaderRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  
  const paramId = route.params.novelId;
  const paramChapterId = route.params.chapterId;

  const [novelData, setNovelData] = useState<NovelMetadata | null>(null);
  const [chapterList, setChapterList] = useState<any[]>([]);
  const [chapterData, setChapterData] = useState<ChapterContent | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    fontSize: 16,
    fontFamily: 'sans-serif',
    lineHeight: 1.6,
    theme: 'light', 
  });

  // 1. Fetch Novel Details and Chapters
  useEffect(() => {
    if (!paramId) {
      setError('Novel ID is missing');
      setIsLoading(false);
      return;
    }

    const fetchNovelInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [detailsRes, chaptersRes] = await Promise.all([
          mediaService.getNovelDetails(paramId),
          mediaService.getNovelChapters(paramId)
        ]);

        const data = detailsRes.data;
        setNovelData({
          id: data.id || paramId,
          title: data.title?.romaji || data.title?.english || 'Unknown Title',
          coverImage: data.coverImage?.extraLarge || data.coverImage?.large || '',
          author: data.staff?.edges?.find((e: any) => e.role?.toLowerCase().includes('story'))?.node?.name?.full || 'Unknown',
          illustrator: data.staff?.edges?.find((e: any) => e.role?.toLowerCase().includes('art'))?.node?.name?.full || 'Unknown',
          synopsis: data.description || 'No synopsis available.',
          tags: data.genres || [],
          status: data.status || 'Ongoing',
          totalVolumes: data.volumes || 1,
          currentVolume: 1,
        });

        const chaps = Array.isArray(chaptersRes.data) ? chaptersRes.data : chaptersRes.data?.chapters || [];
        setChapterList(chaps);

        // Auto-navigate to first chapter if not specified
        if (!paramChapterId && chaps.length > 0) {
          const firstChapter = chaps[0];
          navigation.setParams({ chapterId: String(firstChapter.id || firstChapter.number) });
        }

      } catch (err: any) {
        console.error('Failed to load novel info:', err);
        setError(err.message || 'Failed to load novel info');
      } finally {
        if (!paramChapterId) {
          setIsLoading(false);
        }
      }
    };

    fetchNovelInfo();
  }, [paramId, paramChapterId, navigation]);

  // 2. Fetch Chapter Content when paramChapterId changes
  useEffect(() => {
    if (!paramId || !paramChapterId || chapterList.length === 0) return;

    const fetchChapterContent = async () => {
      setIsLoading(true);
      try {
        const contentRes = await mediaService.getNovelChapterContent(paramId, paramChapterId);
        
        const chInfo = chapterList.find((c: any) => String(c.id) === paramChapterId || String(c.number) === paramChapterId);
        
        const rawContent = contentRes.data?.content || contentRes.data?.text || contentRes.data || '';
        
        // Flexible parsing: if it's an array of paragraphs, use it, otherwise split by newline
        let paragraphs: any[] = [];
        if (Array.isArray(rawContent)) {
          paragraphs = rawContent.map((p, i) => ({
            id: p.id || `p${i}`,
            text: p.text || (typeof p === 'string' ? p : ''),
            type: p.type || 'text',
          }));
        } else if (typeof rawContent === 'string') {
          paragraphs = rawContent.split('\n').filter(t => t.trim().length > 0).map((text, i) => {
            // Very simple heuristic for dialogue
            const isDialogue = text.trim().startsWith('"') || text.trim().startsWith('“') || text.trim().startsWith('-');
            return {
              id: `p${i}`,
              text,
              type: isDialogue ? 'dialogue' : 'text',
            };
          });
        }

        setChapterData({
          id: String(chInfo?.id || paramChapterId),
          volumeTitle: `Volume ${chInfo?.volume || 1}`,
          chapterTitle: chInfo?.title || `Chapter ${chInfo?.number || paramChapterId}`,
          commentCount: 0,
          wordCount: paragraphs.reduce((acc, p) => acc + p.text.split(' ').length, 0),
          lastUpdated: 'Recently',
          paragraphs,
        });

      } catch (err: any) {
        console.error('Failed to load chapter content:', err);
        setError('Failed to load chapter content.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterContent();
  }, [paramId, paramChapterId, chapterList]);

  const updateSettings = useCallback((newSettings: Partial<ViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const navigateChapter = useCallback((direction: 'next' | 'prev') => {
    if (!chapterList.length || !paramChapterId) return;
    const currentIndex = chapterList.findIndex(c => String(c.id) === paramChapterId || String(c.number) === paramChapterId);
    
    if (direction === 'next' && currentIndex >= 0 && currentIndex < chapterList.length - 1) {
      const nextCh = chapterList[currentIndex + 1];
      navigation.setParams({ chapterId: String(nextCh.id || nextCh.number) });
    } else if (direction === 'prev' && currentIndex > 0) {
      const prevCh = chapterList[currentIndex - 1];
      navigation.setParams({ chapterId: String(prevCh.id || prevCh.number) });
    }
  }, [chapterList, paramChapterId, navigation]);

  return {
    novelData,
    chapterData,
    chapterList,
    isLoading,
    error,
    viewSettings,
    updateSettings,
    navigateChapter
  };
};
