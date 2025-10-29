import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { Button, TextInput } from '../components';
import { useAuthStore, useSurveyStore } from '../store';
import { DEMO_SURVEYS } from '../utils/demoSurveyData';
import { RootStackParamList } from '../types';

interface OTPVerificationScreenProps {
  navigation: any;
  route: RouteProp<RootStackParamList, 'OTPVerification'>;
}

const DEMO_OTP = '123456';

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { phoneNumber } = route.params;
  const { setAuth, setLoading } = useAuthStore();
  const { setSurveys } = useSurveyStore();
  const [otp, setOtp] = useState(DEMO_OTP);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const maskedPhone = useMemo(() => {
    if (phoneNumber.length < 4) {
      return phoneNumber;
    }
    const tail = phoneNumber.slice(-4);
    return `••• ••${tail}`;
  }, [phoneNumber]);

  const handleVerify = async () => {
    if (otp.trim() !== DEMO_OTP) {
      setError('For the demo flow, enter the code 123456.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);
      setLoading(true);

      await setAuth('demo-token', {
        id: 'demo-user',
        phoneNumber,
      });

      setSurveys(DEMO_SURVEYS);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Enter your demo code</Text>
          <Text style={styles.subtitle}>
            We sent a demo one-time code to <Text style={styles.phoneHighlight}>{maskedPhone}</Text>. Use <Text style={styles.phoneHighlight}>{DEMO_OTP}</Text> to continue.
          </Text>

          <TextInput
            label="Verification code"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            required
            error={error ?? undefined}
          />

          <Button
            title={submitting ? 'Signing you in…' : 'Verify & Enter App'}
            onPress={handleVerify}
            loading={submitting}
            size="large"
          />

          <Text style={styles.helperText}>
            Need a fresh start? Go back and update your number or reuse the sample values to explore the flow again.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 24,
  },
  phoneHighlight: {
    color: '#007AFF',
    fontWeight: '600',
  },
  helperText: {
    marginTop: 16,
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
});
