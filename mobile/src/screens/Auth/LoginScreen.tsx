/**
 * Login Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { useAuthStore } from '../../store/authStore';
import { Button, Input } from '../../components/ui';
import { colors, spacing, fontSize, fontWeight } from '../../theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      clearError();
      await login(email, password);
      // Navigation will happen automatically when isAuthenticated changes
    } catch (err) {
      Alert.alert('Erreur de connexion', error || 'Une erreur est survenue');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>THOTH</Text>
          <Text style={styles.subtitle}>Votre assistant d'écriture littéraire</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Connexion</Text>

          <Input
            label="Email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Input
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Button
            title="Se connecter"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>
              Pas encore de compte ?{' '}
              <Text style={styles.registerLinkTextBold}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginTop: spacing.lg,
  },
  registerLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  registerLinkTextBold: {
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
});

export default LoginScreen;
