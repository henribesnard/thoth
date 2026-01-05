/**
 * Register Screen
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

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      clearError();
      await register(email, password, fullName);
      // Navigation will happen automatically when isAuthenticated changes
    } catch (err) {
      Alert.alert('Erreur d\'inscription', error || 'Une erreur est survenue');
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
          <Text style={styles.subtitle}>Créez votre compte</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Inscription</Text>

          <Input
            label="Nom complet"
            placeholder="Jean Dupont"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            editable={!isLoading}
          />

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
            placeholder="Min. 8 caractères"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
            helperText="Au moins 8 caractères"
          />

          <Input
            label="Confirmer le mot de passe"
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Button
            title="S'inscrire"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.registerButton}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Déjà un compte ?{' '}
              <Text style={styles.loginLinkTextBold}>Se connecter</Text>
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
  registerButton: {
    marginTop: spacing.lg,
  },
  loginLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  loginLinkTextBold: {
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
});

export default RegisterScreen;
