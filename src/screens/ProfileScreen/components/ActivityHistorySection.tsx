/**
 * ActivityHistorySection — Contribution heatmap (horizontal scrollable).
 *
 * Mirrors web ActivityHistory, reusing useActivityHistory from shared-logic.
 * Renders a horizontally scrollable grid of 53 weeks × 7 days.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useActivityHistory } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from '../ProfileScreen.style';

interface ActivityHistorySectionProps {
  username: string;
  onTotalCountChange?: (total: number) => void;
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
}

// Color levels for the heatmap cells
const HEATMAP_COLORS_DARK: Record<string, string> = {
  'level-0': '#161b22',
  'level-1': '#0e4429',
  'level-2': '#006d32',
  'level-3': '#26a641',
  'level-4': '#39d353',
};

const HEATMAP_COLORS_LIGHT: Record<string, string> = {
  'level-0': '#ebedf0',
  'level-1': '#9be9a8',
  'level-2': '#40c463',
  'level-3': '#30a14e',
  'level-4': '#216e39',
};

const ActivityHistorySection: React.FC<ActivityHistorySectionProps> = ({
  username,
  onTotalCountChange,
  selectedDate,
  onDateSelect,
}) => {
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation('ActivityHistory');
  const s = createStyles(theme);

  const { heatmapCounts, loading, yearWeeks, getLevelClass } =
    useActivityHistory(username, onTotalCountChange);

  const colors =
    themeMode === 'dark' ? HEATMAP_COLORS_DARK : HEATMAP_COLORS_LIGHT;

  if (loading) {
    return (
      <View style={s.heatmapWrapper}>
        <Text style={s.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <View style={s.heatmapWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.heatmapScrollContainer}
      >
        {yearWeeks.map((week, wIndex) => (
          <View key={wIndex} style={s.heatmapColumn}>
            {week.map((day) => {
              if (day.isFuture) return null;

              const count = heatmapCounts[day.date] || 0;
              const levelClass = getLevelClass(count);
              const isSelected = selectedDate === day.date;
              const cellColor = colors[levelClass] || colors['level-0'];

              return (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    s.heatmapCell,
                    { backgroundColor: cellColor },
                    isSelected && s.heatmapCellSelected,
                  ]}
                  onPress={() => onDateSelect?.(day.date)}
                  activeOpacity={0.7}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Legend */}
      <View style={s.heatmapLegend}>
        <Text style={s.heatmapLegendText}>{t('legend.less')}</Text>
        {['level-0', 'level-1', 'level-2', 'level-3', 'level-4'].map(
          (level) => (
            <View
              key={level}
              style={[
                s.heatmapCell,
                { backgroundColor: colors[level] },
              ]}
            />
          ),
        )}
        <Text style={s.heatmapLegendText}>{t('legend.more')}</Text>
      </View>
    </View>
  );
};

export default ActivityHistorySection;
