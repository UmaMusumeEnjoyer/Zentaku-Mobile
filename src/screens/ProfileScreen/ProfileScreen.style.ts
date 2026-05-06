/**
 * ProfileScreen.style.ts
 *
 * StyleSheet factory for ProfileScreen.
 * Uses ThemeTokens from the design system.
 */
import { StyleSheet, Dimensions, Platform } from 'react-native';
import type { ThemeTokens } from '../../styles/theme';
import { typography, spacing, radius } from '../../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    /* ===== LAYOUT ===== */
    safeArea: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacing['16'],
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing['6'],
    },
    loadingText: {
      marginTop: spacing['3'],
      color: theme.textSecondary,
      fontSize: typography.fontSize.base,
    },

    /* ===== PROFILE HEADER (replaces sidebar) ===== */
    headerContainer: {
      alignItems: 'center',
      paddingHorizontal: spacing['4'],
      paddingTop: spacing['6'],
      paddingBottom: spacing['4'],
    },
    avatarWrapper: {
      marginBottom: spacing['3'],
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      backgroundColor: theme.bgPanel,
    },
    namesContainer: {
      alignItems: 'center',
      marginBottom: spacing['3'],
    },
    displayName: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
      textAlign: 'center',
    },
    username: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.regular,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    btnEditProfile: {
      backgroundColor: theme.bgSubtle,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['5'],
      borderRadius: radius.md,
      marginBottom: spacing['3'],
      minWidth: 160,
      alignItems: 'center',
    },
    btnEditProfileText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: theme.textPrimary,
    },
    metaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['2'],
      marginBottom: spacing['2'],
    },
    metaText: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
    },
    separator: {
      height: 1,
      backgroundColor: theme.borderSubtle,
      width: '100%',
      marginVertical: spacing['3'],
    },
    staffBadge: {
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.xl,
      paddingVertical: 2,
      paddingHorizontal: spacing['2'],
      alignSelf: 'center',
    },
    staffBadgeText: {
      fontSize: typography.fontSize.xs,
      color: '#a371f7',
    },
    badgeTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
      marginBottom: spacing['1'],
      textAlign: 'center',
    },

    /* ===== TAB BAR ===== */
    tabBarContainer: {
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      backgroundColor: theme.bgApp,
    },
    tabBarScroll: {
      paddingHorizontal: spacing['4'],
    },
    tabItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing['3'],
      paddingHorizontal: spacing['4'],
      marginRight: spacing['1'],
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabItemActive: {
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: theme.textSecondary,
      marginLeft: spacing['2'],
    },
    tabTextActive: {
      color: theme.textPrimary,
      fontWeight: typography.fontWeight.semiBold,
    },

    /* ===== SECTION HEADERS ===== */
    sectionContainer: {
      paddingHorizontal: spacing['4'],
      paddingTop: spacing['5'],
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing['3'],
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },

    /* ===== ACTIVITY HISTORY (Heatmap) ===== */
    heatmapWrapper: {
      paddingHorizontal: spacing['4'],
      paddingTop: spacing['4'],
    },
    heatmapScrollContainer: {
      paddingRight: spacing['4'],
    },
    heatmapColumn: {
      flexDirection: 'column',
      marginRight: 2,
    },
    heatmapCell: {
      width: 10,
      height: 10,
      borderRadius: 2,
      margin: 1,
    },
    heatmapCellSelected: {
      borderWidth: 1.5,
      borderColor: theme.textPrimary,
    },
    heatmapLegend: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: spacing['2'],
      gap: 3,
    },
    heatmapLegendText: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
    },

    /* ===== ACTIVITY FEED ===== */
    feedContainer: {
      paddingHorizontal: spacing['4'],
    },
    feedRow: {
      flexDirection: 'row',
      marginBottom: 0,
    },
    feedTimeline: {
      alignItems: 'center',
      width: 28,
      marginRight: spacing['3'],
    },
    feedIconCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 2,
    },
    feedIconAdd: {
      backgroundColor: theme.statusSuccess + '33',
    },
    feedIconUpdate: {
      backgroundColor: theme.statusInfo + '33',
    },
    feedIconDefault: {
      backgroundColor: theme.bgSubtle,
    },
    feedIconText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
    feedLine: {
      width: 2,
      flex: 1,
      backgroundColor: theme.borderSubtle,
      minHeight: 20,
    },
    feedContentWrapper: {
      flex: 1,
      paddingBottom: spacing['4'],
    },
    feedHeader: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 4,
    },
    feedUser: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
    },
    feedAction: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
    },
    feedTarget: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.primary,
    },
    feedTime: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
    },
    feedEmpty: {
      paddingVertical: spacing['5'],
      paddingHorizontal: spacing['4'],
    },
    feedEmptyText: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
      fontStyle: 'italic',
    },
    btnLoadMore: {
      backgroundColor: theme.bgSubtle,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.md,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['4'],
      alignSelf: 'center',
      marginTop: spacing['3'],
    },
    btnLoadMoreText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: theme.textPrimary,
    },

    /* ===== CUSTOM LISTS ===== */
    listCard: {
      backgroundColor: theme.bgPanel,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.md,
      padding: spacing['4'],
      marginBottom: spacing['3'],
    },
    listNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing['1'],
    },
    listName: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
      flex: 1,
    },
    privateBadge: {
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.sm,
      paddingVertical: 1,
      paddingHorizontal: spacing['1'],
      marginLeft: spacing['2'],
    },
    privateBadgeText: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
    },
    listDesc: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
    },
    listMeta: {
      marginTop: spacing['2'],
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
    },
    emptyText: {
      color: theme.textSecondary,
      fontStyle: 'italic',
      paddingVertical: spacing['5'],
      fontSize: typography.fontSize.base,
    },

    /* ===== FAVORITES GRID ===== */
    favoritesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing['3'],
      paddingHorizontal: spacing['4'],
    },

    /* ===== MODAL STYLES ===== */
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing['5'],
    },
    modalContent: {
      backgroundColor: theme.bgPanel,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.md,
      padding: spacing['5'],
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing['4'],
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
    },
    modalCloseBtn: {
      padding: spacing['1'],
    },
    modalCloseText: {
      fontSize: typography.fontSize.xl,
      color: theme.textSecondary,
    },

    /* Form styles */
    formGroup: {
      marginBottom: spacing['4'],
    },
    formLabel: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: theme.textPrimary,
      marginBottom: spacing['1'],
    },
    formInput: {
      backgroundColor: theme.bgApp,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.sm,
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['2'],
      fontSize: typography.fontSize.base,
      color: theme.textPrimary,
    },
    formTextarea: {
      backgroundColor: theme.bgApp,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.sm,
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['2'],
      fontSize: typography.fontSize.base,
      color: theme.textPrimary,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    formCheckboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['2'],
    },
    formHint: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
      marginTop: spacing['1'],
    },
    errorMsg: {
      backgroundColor: theme.statusError + '22',
      borderRadius: radius.sm,
      padding: spacing['3'],
      marginBottom: spacing['3'],
    },
    errorMsgText: {
      color: theme.statusError,
      fontSize: typography.fontSize.base,
    },

    /* Avatar section in edit modal */
    avatarSection: {
      marginBottom: spacing['4'],
    },
    avatarActions: {
      flexDirection: 'row',
      gap: spacing['3'],
      marginTop: spacing['2'],
    },
    btnAvatarAction: {
      backgroundColor: theme.bgSubtle,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.sm,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['3'],
    },
    btnAvatarActionText: {
      fontSize: typography.fontSize.sm,
      color: theme.textPrimary,
      fontWeight: typography.fontWeight.medium,
    },
    btnAvatarDelete: {
      borderColor: theme.statusError + '44',
    },
    btnAvatarDeleteText: {
      color: theme.statusError,
    },

    /* Modal footer */
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing['3'],
      marginTop: spacing['5'],
    },
    btnCancel: {
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['4'],
      borderRadius: radius.sm,
    },
    btnCancelText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: theme.textSecondary,
    },
    btnCreate: {
      backgroundColor: theme.statusSuccess,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['4'],
      borderRadius: radius.sm,
    },
    btnCreateDisabled: {
      opacity: 0.7,
    },
    btnCreateText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: '#FFFFFF',
    },
    btnSave: {
      backgroundColor: theme.btnPrimaryBg,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['4'],
      borderRadius: radius.sm,
    },
    btnSaveText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.btnPrimaryText,
    },
  });
