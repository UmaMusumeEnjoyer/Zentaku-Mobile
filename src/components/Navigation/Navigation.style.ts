import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const createStyles = (theme: any) => StyleSheet.create({
  // Bố cục Bottom Navigation
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.bgPanel,

    paddingVertical: 10,
    paddingBottom: 20, // Safe area padding cho iOS/Android
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    color: theme.textSecondary,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  navTextActive: {
    color: theme.primary,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarImgActive: {
    borderColor: theme.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#EF4444', // Red status error
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.bgPanel,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Modals chung (Settings, Notifications, User Menu)
  modalOverlay: {
    flex: 1,
    
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.bgPanel,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.bgSubtle,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  
  // User Menu (Dropdown thay thế)
  menuList: {
    paddingVertical: 8,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  menuItemTextDanger: {
    fontSize: 16,
    color: '#EF4444',
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 4,
  },

  // Notifications
  notiList: {
    paddingBottom: 20,
  },
  notiItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    gap: 12,
  },
  notiIconContainer: {
    paddingTop: 2,
  },
  notiInfo: {
    flex: 1,
  },
  notiText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  notiBold: {
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  animeHighlight: {
    color: theme.primary,
    fontWeight: 'bold',
  },
  notiMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 8,
  },
  notiTime: {
    fontSize: 12,
    color: theme.textSecondary,
    opacity: 0.8,
  },
  notiCountdown: {
    fontSize: 12,
    color: '#F59E0B', // warning
    fontWeight: '600',
    backgroundColor: theme.bgSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  notiAired: {
    color: '#10B981', // success
  },
  notiEmpty: {
    textAlign: 'center',
    padding: 30,
    color: theme.textSecondary,
    fontStyle: 'italic',
  },

  // Settings
  settingsBody: {
    padding: 20,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 6,
  },
  settingsSectionDesc: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 12,
  },
  settingsOptions: {
    flexDirection: 'column',
    gap: 10,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: theme.bgSubtle,
    borderWidth: 2,
    borderColor: theme.border,
    borderRadius: 8,
    gap: 12,
  },
  settingsBtnActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  settingsBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  settingsBtnTextActive: {
    color: theme.btnText,
  },
});