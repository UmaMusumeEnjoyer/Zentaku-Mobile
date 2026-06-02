import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';
import type { CalendarDay } from '../Schedule.types';

interface WeeklyCalendarProps {
  days: CalendarDay[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ days, selectedDate, onSelectDate }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['common']);
  const s = makeStyles(theme);

  // Helper to format day name (e.g., 'Mon', 'Tue')
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <View style={s.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {days.map((day, index) => {
          const isSelected = day.date.toDateString() === selectedDate.toDateString();
          const hasEvents = day.events.length > 0;
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[s.dayContainer, isSelected && s.dayContainerSelected]} 
              onPress={() => onSelectDate(day.date)}
            >
              <Text style={[s.dayName, isSelected && s.textSelected]}>
                {getDayName(day.date)}
              </Text>
              
              <View style={[
                s.dateCircle, 
                isSelected ? s.dateCircleSelected : day.isToday ? s.dateCircleToday : null
              ]}>
                <Text style={[
                  s.dateNum, 
                  (isSelected || day.isToday) && s.textSelected
                ]}>
                  {day.date.getDate()}
                </Text>
              </View>

              <View style={s.indicatorContainer}>
                {hasEvents && <View style={s.indicator} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) => StyleSheet.create({
  container: {
    paddingVertical: spacing['2'],
    backgroundColor: theme.bgPanel,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderSubtle,
  },
  scrollContent: {
    paddingHorizontal: spacing['2'],
    flexDirection: 'row',
    justifyContent: 'space-around',
    minWidth: '100%',
  },
  dayContainer: {
    alignItems: 'center',
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['1'],
    width: 48,
  },
  dayContainerSelected: {
    // Optionally add a background to the whole column
  },
  dayName: {
    fontSize: typography.fontSize.xs,
    color: theme.textSecondary,
    marginBottom: spacing['2'],
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['1'],
  },
  dateCircleToday: {
    backgroundColor: theme.primary + '40', // 25% opacity
  },
  dateCircleSelected: {
    backgroundColor: theme.primary,
  },
  dateNum: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
  },
  textSelected: {
    color: theme.btnPrimaryText,
  },
  indicatorContainer: {
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.primary,
  }
});

export default WeeklyCalendar;
