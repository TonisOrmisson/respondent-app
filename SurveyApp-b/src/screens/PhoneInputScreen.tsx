import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput } from '../components';

interface PhoneInputScreenProps {
  navigation: any;
}

export const PhoneInputScreen: React.FC<PhoneInputScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('+1 555 010 1234');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const normalized = phoneNumber.replace(/[^+\d]/g, '');

    if (normalized.length < 8) {
      setError('Enter a valid phone number to continue.');
      return;
    }

    setError(null);
    navigation.navigate('OTPVerification', { phoneNumber: normalized });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Enter your mobile number</Text>
          <Text style={styles.subtitle}>
            We will text you a demo code so you can explore the participant experience.
          </Text>

          <TextInput
            label="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="+1 555 010 1234"
            error={error ?? undefined}
            required
          />

          <Button title="Send Demo OTP" onPress={handleContinue} size="large" />

          <Text style={styles.helperText}>
            Tip: keep the sample number or enter your own. Use code <Text style={styles.helperHighlight}>123456</Text> on the next step.
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
  helperText: {
    marginTop: 16,
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  helperHighlight: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
