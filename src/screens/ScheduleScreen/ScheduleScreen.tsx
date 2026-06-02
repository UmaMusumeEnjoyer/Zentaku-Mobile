import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useSchedule } from './useSchedule';
import WeeklyCalendar from './components/WeeklyCalendar';
import Header from '../../components/Header/Header';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';

const ScheduleScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const s = makeStyles(theme);
  const navigation = useNavigation<any>();
  
  const { 
    data, 
    selectedDate, 
    selectedDayEvents, 
    isLoading, 
    error, 
    actions 
  } = useSchedule();

  const monthName = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const renderEventItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={s.eventCard} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('AnimeDetail', { id: item.id })}
    >
      <View style={s.timeContainer}>
        <Text style={s.timeText}>{item.time}</Text>
      </View>
      
      <View style={s.eventContent}>
        <Image source={{ uri: item.thumbnail }} style={s.eventImage} />
        <View style={s.eventInfo}>
          <Text style={s.eventTitle} numberOfLines={2}>{item.title}</Text>
          <View style={s.eventMeta}>
            {item.episode ? (
              <View style={s.tag}>
                <Text style={s.tagText}>Ep {item.episode}</Text>
              </View>
            ) : null}
            <View style={[s.tag, { backgroundColor: theme.bgHover }]}>
              <Text style={s.tagText}>{item.season || 'TBA'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={s.playBtn}>
          <Play size={16} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bgApp} />
      
      <Header title="Lịch chiếu" />
      
      {/* Week Controls */}
      <View style={s.weekControls}>
        <TouchableOpacity onPress={actions.handlePrevWeek} style={s.iconBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={s.monthText}>{monthName}</Text>
        <TouchableOpacity onPress={actions.handleNextWeek} style={s.iconBtn}>
          <ChevronRight color={theme.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      {data && (
        <WeeklyCalendar 
          days={data.days} 
          selectedDate={selectedDate} 
          onSelectDate={actions.handleSelectDate} 
        />
      )}

      {/* Loading or Events List */}
      <View style={s.listContainer}>
        {isLoading ? (
          <View style={s.centerBox}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : error ? (
          <View style={s.centerBox}>
            <Text style={{ color: theme.statusError }}>{error.message}</Text>
            <TouchableOpacity onPress={actions.handleRetry} style={s.retryBtn}>
              <Text style={s.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : selectedDayEvents.length === 0 ? (
          <View style={s.centerBox}>
            <Text style={s.emptyText}>Không có lịch chiếu nào vào ngày này.</Text>
          </View>
        ) : (
          <FlatList
            data={selectedDayEvents}
            keyExtractor={(item) => `${item.id}-${item.episode}`}
            renderItem={renderEventItem}
            contentContainerStyle={s.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeTokens) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.bgApp,
  },
  weekControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    backgroundColor: theme.bgPanel,
  },
  iconBtn: {
    padding: spacing['2'],
  },
  monthText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
  },
  listContainer: {
    flex: 1,
    backgroundColor: theme.bgApp,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['4'],
  },
  emptyText: {
    color: theme.textSecondary,
    fontSize: typography.fontSize.md,
  },
  retryBtn: {
    marginTop: spacing['4'],
    backgroundColor: theme.primary,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: radius.md,
  },
  retryText: {
    color: theme.btnPrimaryText,
    fontWeight: typography.fontWeight.bold,
  },
  listContent: {
    padding: spacing['4'],
    paddingBottom: 100, // accommodate bottom nav
  },
  eventCard: {
    flexDirection: 'row',
    marginBottom: spacing['4'],
    alignItems: 'flex-start',
  },
  timeContainer: {
    width: 50,
    alignItems: 'center',
    marginRight: spacing['3'],
  },
  timeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
    marginTop: spacing['1'],
  },
  eventContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.bgPanel,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.borderSubtle,
  },
  eventImage: {
    width: 70,
    height: 100,
    backgroundColor: theme.bgHover,
  },
  eventInfo: {
    flex: 1,
    padding: spacing['3'],
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
    marginBottom: spacing['2'],
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: theme.primary + '20', // tinted primary
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginRight: spacing['2'],
  },
  tagText: {
    fontSize: 10,
    color: theme.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  playBtn: {
    padding: spacing['3'],
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ScheduleScreen;
