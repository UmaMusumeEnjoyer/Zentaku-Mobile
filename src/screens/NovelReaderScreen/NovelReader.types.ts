export interface NovelMetadata {
  id: string;
  title: string;
  coverImage: string;
  author: string;
  illustrator: string;
  synopsis: string;
  tags: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  totalVolumes: number;
  currentVolume: number;
}

export interface ChapterContent {
  id: string;
  volumeTitle: string; 
  chapterTitle: string; 
  commentCount: number;
  wordCount: number;
  lastUpdated: string; 
  paragraphs: Array<{
    id: string;
    text: string;
    type: 'text' | 'dialogue' | 'thought';
    isHighlighted?: boolean; 
  }>;
}

export interface ViewSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif'; // Reduced to generic groups
  lineHeight: number;
  theme: 'light' | 'sepia' | 'dark'; // Reduced from web
}

export interface UseLightNovelReaderReturn {
  novelData: NovelMetadata | null;
  chapterData: ChapterContent | null;
  chapterList: any[];
  isLoading: boolean;
  error: string | null;
  // UI States
  viewSettings: ViewSettings;
  // Actions
  updateSettings: (newSettings: Partial<ViewSettings>) => void;
  navigateChapter: (direction: 'next' | 'prev') => void;
}
