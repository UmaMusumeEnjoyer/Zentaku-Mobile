export interface ChapterInfo {
  id: string;
  title: string;
  mangaTitle: string;
  chapterNumber: string;
  uploader?: string;
  groupName?: string;
  commentCount?: number;
}

export interface MangaPage {
  id: string;
  url: string;
  pageNumber: number;
}

export interface ReaderSettings {
  direction: 'vertical' | 'horizontal'; // Only keeping relevant ones for mobile
}

export interface MangaDetailsPlaceholder {
  id: string;
  title: string;
  coverImage: string;
  season?: string;
  studio?: string;
  status?: string;
  format?: string;
  genres?: string[];
  description?: string;
  totalChapters?: number;
  readChapters?: number;
}

export interface UseMangaReaderReturn {
  isLoading: boolean;
  error: string | null;
  chapterInfo: ChapterInfo | null;
  mangaDetails: MangaDetailsPlaceholder;
  pages: MangaPage[];
  settings: ReaderSettings;
  currentPage: number;
  chapterList: any[];
  actions: {
    updateSetting: (key: keyof ReaderSettings, value: any) => void;
    nextChapter: () => void;
    prevChapter: () => void;
    goToPage: (pageNumber: number) => void;
  };
}
