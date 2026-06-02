export interface AnimeInfo {
  id: string;
  title: string;
  thumbnail: string;
  season?: string;
  episode?: string;
  time: string; // HH:mm
  color?: string;
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  events: AnimeInfo[];
}

export interface ScheduleData {
  days: CalendarDay[];
  updates: {
    hasNew: boolean;
    message: string;
  };
}

export interface UseAnimeScheduleReturn {
  data: ScheduleData | null;
  selectedDate: Date;
  selectedDayEvents: AnimeInfo[];
  isLoading: boolean;
  error: Error | null;
  actions: {
    handleSelectDate: (date: Date) => void;
    handleRetry: () => void;
    handlePrevWeek: () => void;
    handleNextWeek: () => void;
  };
}
