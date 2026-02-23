/**
 * src/i18n/config.ts
 *
 * Mirror 1:1 của pbl5_webFE/src/i18n/config.ts
 * — Import toàn bộ translations từ @umamusumeenjoyer/shared-logic
 * — Thêm namespace "mobile" riêng cho các key mobile-specific (nav, settings...)
 * — Thay localStorage.getItem → AsyncStorage (xử lý trong LanguageContext)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  commonEn,
  homePageEn,
  commonJp,
  homePageJp,
  newsDetailPageEn, newsDetailPageJp,
  characterPageEn, characterPageJp,
  RankingSectionEn, RankingSectionJp,
  charactersSectionEn, charactersSectionJp,
  staffSectionEn, staffSectionJp,
  statisticsSectionJp, statisticsSectionEn,
  AnimeModalEn, AnimeModalJp,
  MainContentAreaEn, MainContentAreaJp,
  AnimeDetailEn, AnimeDetailJp,
  HeaderEn, HeaderJp,
  GlobalSearchEn, GlobalSearchJp,
  AuthEn, AuthJp,
  StaffPageEn, StaffPageJp,
  AnimeSearchEN, AnimeSearchJP,
  AnimeSectionEN, AnimeSectionJP,
  HomePageLoginEN, HomePageLoginJP,
  AnimeListSearchEN, AnimeListSearchJP,
  ProfilePageEN, ProfilePageJP,
  ActivityHistoryEN, ActivityHistoryJP,
  EditProfileModalEN, EditProfileModalJP,
  ProfilePagePageEN, ProfilePagePageJP,
  ActivityFeedEN, ActivityFeedJP,
  addAnimeModalEN, addAnimeModalJP,
  editListModalEN, editListModalJP,
  likersModalEN, likersModalJP,
  listHeaderEN, listHeaderJP,
  requestListEN, requestListJP,
  requestModalEN, requestModalJP,
  sidebarEN, sidebarJP,
  userAnimeGroupEN, userAnimeGroupJP,
  userItemEN, userItemJP,
  userSearchModalEN, userSearchModalJP,
  animeListPageEN, animeListPageJP,
} from '@umamusumeenjoyer/shared-logic';

// ---- Mobile-specific translations (không có trong shared-logic) ----
import mobileEn from './locales/en/mobile.json';
import mobileJp from './locales/jp/mobile.json';

// ---- Định nghĩa LANGUAGES object (shared-logic export array, không phải object) ----
export const LANGUAGES = {
  en: { label: 'English', nativeLabel: 'English' },
  jp: { label: 'Japanese', nativeLabel: '日本語' },
} as const;

export type LangCode = keyof typeof LANGUAGES; // 'en' | 'jp'

const DEFAULT_LANG: LangCode = 'en';
const DEFAULT_NS = 'common';

// ---- i18next init ----
// lng khởi tạo là DEFAULT_LANG.
// LanguageContext đọc AsyncStorage rồi gọi i18n.changeLanguage() sau khi mount.
i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEn,
      HomePage: homePageEn,
      NewsDetailPage: newsDetailPageEn,
      CharacterPage: characterPageEn,
      RankingSection: RankingSectionEn,
      CharactersSection: charactersSectionEn,
      StaffSection: staffSectionEn,
      StatisticsSection: statisticsSectionEn,
      AnimeModal: AnimeModalEn,
      MainContentArea: MainContentAreaEn,
      AnimeDetail: AnimeDetailEn,
      Header: HeaderEn,
      GlobalSearch: GlobalSearchEn,
      Auth: AuthEn,
      StaffPage: StaffPageEn,
      AnimeSearch: AnimeSearchEN,
      AnimeSection: AnimeSectionEN,
      HomePageLogin: HomePageLoginEN,
      AnimeListSearch: AnimeListSearchEN,
      ProfilePage: ProfilePageEN,
      ActivityHistory: ActivityHistoryEN,
      EditProfileModal: EditProfileModalEN,
      ProfilePagePage: ProfilePagePageEN,
      ActivityFeed: ActivityFeedEN,
      addAnimeModal: addAnimeModalEN,
      editListModal: editListModalEN,
      likersModal: likersModalEN,
      listHeader: listHeaderEN,
      requestList: requestListEN,
      requestModal: requestModalEN,
      sidebar: sidebarEN,
      userAnimeGroup: userAnimeGroupEN,
      userItem: userItemEN,
      userSearchModal: userSearchModalEN,
      animeListPage: animeListPageEN,
      mobile: mobileEn,
    },
    jp: {
      common: commonJp,
      HomePage: homePageJp,
      NewsDetailPage: newsDetailPageJp,
      CharacterPage: characterPageJp,
      RankingSection: RankingSectionJp,
      CharactersSection: charactersSectionJp,
      StaffSection: staffSectionJp,
      StatisticsSection: statisticsSectionJp,
      AnimeModal: AnimeModalJp,
      MainContentArea: MainContentAreaJp,
      AnimeDetail: AnimeDetailJp,
      Header: HeaderJp,
      GlobalSearch: GlobalSearchJp,
      Auth: AuthJp,
      StaffPage: StaffPageJp,
      AnimeSearch: AnimeSearchJP,
      AnimeSection: AnimeSectionJP,
      HomePageLogin: HomePageLoginJP,
      AnimeListSearch: AnimeListSearchJP,
      ProfilePage: ProfilePageJP,
      ActivityHistory: ActivityHistoryJP,
      EditProfileModal: EditProfileModalJP,
      ProfilePagePage: ProfilePagePageJP,
      ActivityFeed: ActivityFeedJP,
      addAnimeModal: addAnimeModalJP,
      editListModal: editListModalJP,
      likersModal: likersModalJP,
      listHeader: listHeaderJP,
      requestList: requestListJP,
      requestModal: requestModalJP,
      sidebar: sidebarJP,
      userAnimeGroup: userAnimeGroupJP,
      userItem: userItemJP,
      userSearchModal: userSearchModalJP,
      animeListPage: animeListPageJP,
      mobile: mobileJp,
    },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  defaultNS: DEFAULT_NS,
  ns: [
    'common', 'HomePage', 'NewsDetailPage', 'CharacterPage',
    'RankingSection', 'CharactersSection', 'StaffSection', 'StatisticsSection',
    'AnimeModal', 'MainContentArea', 'AnimeDetail', 'Header',
    'GlobalSearch', 'Auth', 'StaffPage', 'AnimeSearch', 'AnimeSection',
    'HomePageLogin', 'AnimeListSearch', 'ProfilePage', 'ActivityHistory',
    'EditProfileModal', 'ProfilePagePage', 'ActivityFeed',
    'addAnimeModal', 'editListModal', 'likersModal', 'listHeader',
    'requestList', 'requestModal', 'sidebar',
    'userAnimeGroup', 'userItem', 'userSearchModal', 'animeListPage',
    'mobile',
  ],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
