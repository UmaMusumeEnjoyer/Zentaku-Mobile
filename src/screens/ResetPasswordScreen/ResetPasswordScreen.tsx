import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';

import { authService } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, ThemeTokens } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['Auth']);
  const s = makeStyles(theme);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendEmail = async () => {
    if (!email) {
      setErrorMsg(t('Auth:validation.email_required') || 'Email is required');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await authService.forgotPassword(email);
      setSuccessMsg('Reset link sent to your email. Please check your inbox and enter the token below.');
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token || !password || !confirmPassword) {
      setErrorMsg('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(t('Auth:validation.confirm_password_mismatch') || 'Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setErrorMsg(t('Auth:validation.password_min_length') || 'Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await authService.resetPassword(token, password, confirmPassword);
      setSuccessMsg(t('Auth:resetPassword.success') || 'Password reset successfully');
      setTimeout(() => {
        navigation.navigate('Login', { initialMode: 'login' });
      }, 2000);
    } catch (err: any) {
      setErrorMsg(t('Auth:resetPassword.error') || err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <View style={s.card}>
            <Text style={s.title}>{t('Auth:resetPassword.title') || 'Reset Password'}</Text>
            
            {errorMsg ? (
              <View style={s.errorBox}>
                <Text style={s.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {successMsg ? (
              <View style={s.successBox}>
                <Text style={s.successText}>{successMsg}</Text>
              </View>
            ) : null}

            {step === 1 ? (
              <View>
                <Text style={s.description}>
                  {t('Auth:resetPassword.description') || 'Enter your email address to receive a password reset token.'}
                </Text>
                <TextInput
                  style={s.input}
                  placeholder={t('Auth:placeholders.email') || 'Email'}
                  placeholderTextColor={theme.textDisabled}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity
                  style={[s.submitBtn, isLoading && s.submitBtnDisabled]}
                  onPress={handleSendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.textOnPrimary} />
                  ) : (
                    <Text style={s.submitBtnText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={s.description}>
                  Enter the token sent to your email and your new password.
                </Text>
                <TextInput
                  style={s.input}
                  placeholder="Reset Token"
                  placeholderTextColor={theme.textDisabled}
                  autoCapitalize="none"
                  value={token}
                  onChangeText={setToken}
                />
                <View style={s.passwordContainer}>
                  <TextInput
                    style={s.passwordInput}
                    placeholder={t('Auth:placeholders.password') || 'New Password'}
                    placeholderTextColor={theme.textDisabled}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeIcon}>
                    {showPassword ? <EyeOff size={20} color={theme.textSecondary} /> : <Eye size={20} color={theme.textSecondary} />}
                  </TouchableOpacity>
                </View>
                <View style={s.passwordContainer}>
                  <TextInput
                    style={s.passwordInput}
                    placeholder={t('Auth:placeholders.confirm_password') || 'Confirm Password'}
                    placeholderTextColor={theme.textDisabled}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={s.eyeIcon}>
                    {showConfirmPassword ? <EyeOff size={20} color={theme.textSecondary} /> : <Eye size={20} color={theme.textSecondary} />}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[s.submitBtn, isLoading && s.submitBtnDisabled]}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.textOnPrimary} />
                  ) : (
                    <Text style={s.submitBtnText}>{t('Auth:resetPassword.submit') || 'Reset Password'}</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Login', { initialMode: 'login' })}>
              <Text style={s.backText}>{t('Auth:resetPassword.back_to_login') || 'Back to Login'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: ThemeTokens) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bgApp },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['8'],
  },
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
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: theme.textPrimary,
    marginBottom: spacing['2'],
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: theme.textSecondary,
    marginBottom: spacing['4'],
    textAlign: 'center',
  },
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.bgApp,
    borderWidth: 1,
    borderColor: theme.borderSubtle,
    borderRadius: radius.md,
    marginBottom: spacing['3'],
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    fontSize: typography.fontSize.base,
    color: theme.textPrimary,
  },
  eyeIcon: {
    padding: spacing['3'],
  },
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
  successBox: {
    backgroundColor: '#10b98122', // Assuming emerald-500/20
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: radius.md,
    padding: spacing['3'],
    marginBottom: spacing['3'],
  },
  successText: {
    color: '#10b981',
    fontSize: typography.fontSize.sm,
  },
  backText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    color: theme.primary,
    marginTop: spacing['3'],
  },
});

export default ResetPasswordScreen;
