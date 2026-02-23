/**
 * src/screens/AuthScreen.tsx
 *
 * Clone AuthPage của pbl5_webFE — adapted cho React Native.
 * - 2 chế độ: 'login' | 'signup', toggle animation bằng Animated
 * - Dùng authService từ shared-logic trực tiếp (thay form event handler)
 * - Dùng useTranslation(['Auth']) — cùng namespace với webFE
 */
import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { authService } from '@umamusumeenjoyer/shared-logic';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { typography, spacing, radius } from '../styles/theme';
import type { ThemeTokens } from '../styles/theme';
import type { RootStackParamList } from '../navigation/types';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

type AuthMode = 'login' | 'signup';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

const AuthScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { t } = useTranslation(['Auth']);

  const [mode, setMode] = useState<AuthMode>(route.params?.initialMode ?? 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const slideAnim = useRef(new Animated.Value(0)).current;

  // ---- Form state ----
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: '',
    username: '',
    password: '',
    confirm_password: '',
  });

  const s = makeStyles(theme);

  // ---- Toggle mode ----
  const switchMode = (next: AuthMode) => {
    if (next === mode) return;
    setErrorMsg('');
    Animated.timing(slideAnim, {
      toValue: next === 'signup' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMode(next));
  };

  // ---- Login submit ----
  const handleLoginSubmit = async () => {
    if (!loginForm.email || !loginForm.password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await login({ email: loginForm.email, password: loginForm.password });
      if (result.success) {
        navigation.replace('HomeLogin');
      } else {
        setErrorMsg(result.message);
      }
    } catch {
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Register submit ----
  const handleRegisterSubmit = async () => {
    if (!registerForm.email || !registerForm.username || !registerForm.password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (registerForm.password !== registerForm.confirm_password) {
      setErrorMsg('Passwords do not match!');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await authService.register({
        email: registerForm.email,
        username: registerForm.username,
        password: registerForm.password,
      });
      setErrorMsg((response.data as any)?.message ?? 'Registration successful! Please verify your email.');
      switchMode('login');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.details) {
        const msgs = Object.values(data.details).flat().join('\n');
        setErrorMsg(msgs);
      } else {
        setErrorMsg(data?.message || data?.email?.[0] || data?.username?.[0] || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------

  return (
    <SafeAreaView style={s.safeArea}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ---- App Brand ---- */}
          <View style={s.brandRow}>
            <Text style={s.brandName}>AniApp</Text>
          </View>

          {/* ---- Mode Tabs ---- */}
          <View style={s.tabRow}>
            <TouchableOpacity
              style={[s.tab, mode === 'login' && s.tabActive]}
              onPress={() => switchMode('login')}
            >
              <Text style={[s.tabText, mode === 'login' && s.tabTextActive]}>
                {t('Auth:signin.title')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tab, mode === 'signup' && s.tabActive]}
              onPress={() => switchMode('signup')}
            >
              <Text style={[s.tabText, mode === 'signup' && s.tabTextActive]}>
                {t('Auth:signup.title')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ---- Card ---- */}
          <View style={s.card}>

            {/* ---- Error message ---- */}
            {errorMsg !== '' && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* ================================================================
                LOGIN FORM
            ================================================================ */}
            {mode === 'login' && (
              <View>
                <Text style={s.formTitle}>{t('Auth:signin.title')}</Text>
                <Text style={s.dividerText}>{t('Auth:signin.divider')}</Text>

                <TextInput
                  style={s.input}
                  placeholder={t('Auth:placeholders.email')}
                  placeholderTextColor={theme.textDisabled}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={loginForm.email}
                  onChangeText={(v) => setLoginForm((f) => ({ ...f, email: v }))}
                />
                <TextInput
                  style={s.input}
                  placeholder={t('Auth:placeholders.password')}
                  placeholderTextColor={theme.textDisabled}
                  secureTextEntry
                  value={loginForm.password}
                  onChangeText={(v) => setLoginForm((f) => ({ ...f, password: v }))}
                />

                <TouchableOpacity
                  style={[s.submitBtn, isLoading && s.submitBtnDisabled]}
                  onPress={handleLoginSubmit}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.textOnPrimary} />
                  ) : (
                    <Text style={s.submitBtnText}>{t('Auth:signin.submit')}</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={[s.forgotText, { color: theme.primary }]}>
                    {t('Auth:signin.forgot_password')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ================================================================
                SIGNUP FORM
            ================================================================ */}
            {mode === 'signup' && (
              <View>
                <Text style={s.formTitle}>{t('Auth:signup.title')}</Text>

                <TextInput
                  style={s.input}
                  placeholder={t('Auth:placeholders.email')}
                  placeholderTextColor={theme.textDisabled}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={registerForm.email}
                  onChangeText={(v) => setRegisterForm((f) => ({ ...f, email: v }))}
                />
                <TextInput
                  style={s.input}
                  placeholder={t('Auth:placeholders.username')}
                  placeholderTextColor={theme.textDisabled}
                  autoCapitalize="none"
                  value={registerForm.username}
                  onChangeText={(v) => setRegisterForm((f) => ({ ...f, username: v }))}
                />
                <TextInput
                  style={s.input}
                  placeholder={t('Auth:placeholders.password')}
                  placeholderTextColor={theme.textDisabled}
                  secureTextEntry
                  value={registerForm.password}
                  onChangeText={(v) => setRegisterForm((f) => ({ ...f, password: v }))}
                />
                <TextInput
                  style={s.input}
                  placeholder={t('Auth:placeholders.confirm_password')}
                  placeholderTextColor={theme.textDisabled}
                  secureTextEntry
                  value={registerForm.confirm_password}
                  onChangeText={(v) => setRegisterForm((f) => ({ ...f, confirm_password: v }))}
                />

                <Text style={s.termsText}>{t('Auth:signup.terms')}</Text>

                <TouchableOpacity
                  style={[s.submitBtn, isLoading && s.submitBtnDisabled]}
                  onPress={handleRegisterSubmit}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.textOnPrimary} />
                  ) : (
                    <Text style={s.submitBtnText}>{t('Auth:signup.submit')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ---- Toggle hint ---- */}
          <View style={s.switchRow}>
            {mode === 'login' ? (
              <>
                <Text style={s.switchText}>{t('Auth:toggle.hello_friend')} </Text>
                <TouchableOpacity onPress={() => switchMode('signup')}>
                  <Text style={[s.switchLink, { color: theme.primary }]}>
                    {t('Auth:toggle.to_signup')}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={s.switchText}>{t('Auth:toggle.welcome_back')} </Text>
                <TouchableOpacity onPress={() => switchMode('login')}>
                  <Text style={[s.switchLink, { color: theme.primary }]}>
                    {t('Auth:toggle.to_signin')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ----------------------------------------------------------------
// Styles
// ----------------------------------------------------------------

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.bgApp },
    flex: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing['5'],
      paddingVertical: spacing['8'],
    },

    // Brand
    brandRow: { alignItems: 'center', marginBottom: spacing['6'] },
    brandName: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: theme.primary,
      letterSpacing: 1,
    },

    // Tabs
    tabRow: {
      flexDirection: 'row',
      backgroundColor: theme.bgPanel,
      borderRadius: radius.full,
      padding: 4,
      marginBottom: spacing['5'],
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing['2'],
      alignItems: 'center',
      borderRadius: radius.full,
    },
    tabActive: { backgroundColor: theme.btnPrimaryBg },
    tabText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: theme.textSecondary,
    },
    tabTextActive: {
      color: theme.textOnPrimary,
      fontWeight: typography.fontWeight.bold,
    },

    // Card
    card: {
      backgroundColor: theme.bgPanel,
      borderRadius: radius.xl,
      padding: spacing['5'],
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    formTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
      marginBottom: spacing['1'],
    },
    dividerText: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
      marginBottom: spacing['4'],
    },

    // Inputs
    input: {
      backgroundColor: theme.bgApp,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      borderRadius: radius.md,
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['3'],
      fontSize: typography.fontSize.base,
      color: theme.textPrimary,
      marginBottom: spacing['3'],
    },

    // Submit
    submitBtn: {
      backgroundColor: theme.btnPrimaryBg,
      borderRadius: radius.full,
      paddingVertical: spacing['3'],
      alignItems: 'center',
      marginTop: spacing['2'],
      marginBottom: spacing['3'],
    },
    submitBtnDisabled: { opacity: 0.6 },
    submitBtnText: {
      color: theme.textOnPrimary,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
    },

    // Misc
    forgotText: {
      fontSize: typography.fontSize.sm,
      textAlign: 'center',
      marginTop: spacing['1'],
    },
    termsText: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
      marginBottom: spacing['3'],
      lineHeight: typography.lineHeight.tight,
    },
    errorBox: {
      backgroundColor: theme.statusError + '22',
      borderWidth: 1,
      borderColor: theme.statusError,
      borderRadius: radius.md,
      padding: spacing['3'],
      marginBottom: spacing['3'],
    },
    errorText: {
      color: theme.statusError,
      fontSize: typography.fontSize.sm,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing['5'],
      flexWrap: 'wrap',
    },
    switchText: { fontSize: typography.fontSize.sm, color: theme.textSecondary },
    switchLink: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  });

export default AuthScreen;
