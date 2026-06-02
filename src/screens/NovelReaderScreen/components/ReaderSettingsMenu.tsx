import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Type, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, radius, typography } from '../../../styles/theme';
import type { ViewSettings } from '../NovelReader.types';

interface ReaderSettingsMenuProps {
  visible: boolean;
  onClose: () => void;
  settings: ViewSettings;
  onUpdate: (newSettings: Partial<ViewSettings>) => void;
}

const ReaderSettingsMenu: React.FC<ReaderSettingsMenuProps> = ({ visible, onClose, settings, onUpdate }) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.panel, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
              
              {/* Font Size */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Kích thước chữ</Text>
                <View style={styles.row}>
                  <TouchableOpacity 
                    style={[styles.btn, { backgroundColor: theme.bgHover }]}
                    onPress={() => onUpdate({ fontSize: Math.max(12, settings.fontSize - 2) })}
                  >
                    <Minus color={theme.textPrimary} size={20} />
                  </TouchableOpacity>
                  <Text style={[styles.valueText, { color: theme.textPrimary }]}>{settings.fontSize}</Text>
                  <TouchableOpacity 
                    style={[styles.btn, { backgroundColor: theme.bgHover }]}
                    onPress={() => onUpdate({ fontSize: Math.min(32, settings.fontSize + 2) })}
                  >
                    <Plus color={theme.textPrimary} size={20} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Theme */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Giao diện</Text>
                <View style={styles.row}>
                  {(['light', 'sepia', 'dark'] as const).map(t => (
                    <TouchableOpacity 
                      key={t}
                      style={[
                        styles.themeBtn, 
                        settings.theme === t && styles.themeBtnActive,
                        settings.theme === t && { borderColor: theme.primary }
                      ]}
                      onPress={() => onUpdate({ theme: t })}
                    >
                      <View style={[styles.themeCircle, { 
                        backgroundColor: t === 'light' ? '#ffffff' : t === 'sepia' ? '#f4ecd8' : '#121212',
                        borderColor: t === 'light' ? '#ddd' : 'transparent',
                        borderWidth: 1
                      }]} />
                      <Text style={[styles.themeText, { color: theme.textPrimary }]}>
                        {t === 'light' ? 'Trắng' : t === 'sepia' ? 'Sepia' : 'Đen'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['4'],
  },
  panel: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radius.lg,
    padding: spacing['5'],
    borderWidth: 1,
  },
  section: {
    marginBottom: spacing['5'],
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing['3'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    padding: spacing['3'],
    borderRadius: radius.full,
  },
  valueText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  themeBtn: {
    alignItems: 'center',
    padding: spacing['2'],
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeBtnActive: {},
  themeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: spacing['2'],
  },
  themeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  }
});

export default ReaderSettingsMenu;
