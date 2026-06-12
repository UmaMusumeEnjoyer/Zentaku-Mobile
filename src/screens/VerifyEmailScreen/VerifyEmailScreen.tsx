import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { authService } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, ThemeTokens } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['Auth']);
  const s = makeStyles(theme);

  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleVerify = async () => {
    if (!token.trim()) {
      setErrorMsg('Please enter a verification token');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await authService.verifyEmailPost(token.trim());
      setSuccessMsg('Email verified successfully! You can now login.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to verify email. Token may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <View style={s.card}>
            <Text style={s.title}>Verify Email</Text>
            
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

            {!successMsg ? (
              <View>
                <Text style={s.description}>
                  Enter the verification token sent to your email to verify your account.
                </Text>
                
                <TextInput
                  style={s.input}
                  placeholder="Verification Token"
                  placeholderTextColor={theme.textDisabled}
                  autoCapitalize="none"
                  value={token}
                  onChangeText={setToken}
                />

                <TouchableOpacity
                  style={[s.submitBtn, isLoading && s.submitBtnDisabled]}
                  onPress={handleVerify}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.textOnPrimary} />
                  ) : (
                    <Text style={s.submitBtnText}>Verify</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={s.submitBtn}
                onPress={() => navigation.navigate('Login', { initialMode: 'login' })}
              >
                <Text style={s.submitBtnText}>Go to Login</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Login', { initialMode: 'login' })}>
              <Text style={s.backText}>Back to Login</Text>
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
    backgroundColor: '#10b98122',
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

export default VerifyEmailScreen;
