import { useState, useEffect, useMemo } from 'react';
import type { ScheduleData, UseAnimeScheduleReturn, CalendarDay, AnimeInfo } from './Schedule.types';
import { animeService } from '@umamusumeenjoyer/shared-logic';

const generateWeeklyCalendar = (baseDate: Date): CalendarDay[] => {
  const days: CalendarDay[] = [];
  // Find Monday of the current baseDate week
  const day = baseDate.getDay();
  const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
  const monday = new Date(baseDate.getFullYear(), baseDate.getMonth(), diff);
  
  const todayStr = new Date().toDateString();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    days.push({
      date: d,
      isToday: d.toDateString() === todayStr,
      events: []
    });
  }
  
  return days;
};

export const useSchedule = (): UseAnimeScheduleReturn => {
  // Use today as default selected date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Base date tracks the week currently being viewed
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ScheduleData | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const days = generateWeeklyCalendar(baseDate);
      
      const startOfWeek = days[0].date;
      const endOfWeek = new Date(days[6].date);
      endOfWeek.setHours(23, 59, 59, 999);
      
      const startUnix = Math.floor(startOfWeek.getTime() / 1000);
      const endUnix = Math.floor(endOfWeek.getTime() / 1000);

      const response = await animeService.getAnimeSchedule(startUnix, endUnix);
      const { calendarEvents = [] } = response.data || {};

      calendarEvents.forEach((edge: any) => {
        const date = new Date(edge.airingAt * 1000);
        const dateString = date.toDateString();
        
        const dayMatch = days.find(d => d.date.toDateString() === dateString);
        if (dayMatch) {
          dayMatch.events.push({
            id: edge.id.toString(),
            title: edge.media?.title?.romaji || edge.media?.title?.english || 'Unknown',
            thumbnail: edge.media?.coverImage?.large,
            season: edge.media?.season ? `${edge.media.season} ${edge.media.seasonYear || ''}` : '',
            episode: edge.episode ? edge.episode.toString().padStart(2, '0') : '',
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            color: '#3b82f6'
          });
        }
      });

      setData({
        days,
        updates: {
          hasNew: true,
          message: "Data fetched!"
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load schedule'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [baseDate]);

  const selectedDayEvents = useMemo(() => {
    if (!data || !selectedDate) return [];
    const dateString = selectedDate.toDateString();
    const dayMatch = data.days.find(d => d.date.toDateString() === dateString);
    return dayMatch ? dayMatch.events : [];
  }, [data, selectedDate]);

  const actions = {
    handleSelectDate: (date: Date) => setSelectedDate(date),
    handleRetry: fetchData,
    handlePrevWeek: () => {
      const prevWeek = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - 7);
      setBaseDate(prevWeek);
    },
    handleNextWeek: () => {
      const nextWeek = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 7);
      setBaseDate(nextWeek);
    }
  };

  return { data, selectedDate, selectedDayEvents, isLoading, error, actions };
};
