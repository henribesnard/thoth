/**
 * Create Project Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from '../../../App';
import { useProjectStore } from '../../store/projectStore';
import { Button, Input } from '../../components/ui';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { GENRE_OPTIONS, STRUCTURE_TEMPLATES } from '../../constants/config';
import type { Genre } from '../../types';

type CreateProjectScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateProject'
>;

const CreateProjectScreen = () => {
  const navigation = useNavigation<CreateProjectScreenNavigationProp>();
  const { createProject, isLoading } = useProjectStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState<Genre | ''>('');
  const [targetWordCount, setTargetWordCount] = useState('');
  const [structure, setStructure] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre pour le projet');
      return;
    }

    try {
      const project = await createProject({
        title: title.trim(),
        description: description.trim() || undefined,
        genre: genre || undefined,
        target_word_count: targetWordCount ? parseInt(targetWordCount, 10) : undefined,
        structure_template: structure || undefined,
      });

      Alert.alert('Succès', 'Projet créé avec succès !', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ProjectDetail', { projectId: project.id }),
        },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le projet');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nouveau Projet</Text>
          <Button
            title="Annuler"
            variant="ghost"
            size="sm"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Informations du projet</Text>

          <Input
            label="Titre du projet *"
            placeholder="Ex: Mon premier roman"
            value={title}
            onChangeText={setTitle}
            editable={!isLoading}
          />

          <Input
            label="Description"
            placeholder="Décrivez brièvement votre projet..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            editable={!isLoading}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Genre</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={genre}
                onValueChange={(itemValue) => setGenre(itemValue as Genre)}
                enabled={!isLoading}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionnez un genre" value="" />
                {GENRE_OPTIONS.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>
          </View>

          <Input
            label="Objectif de mots"
            placeholder="Ex: 80000"
            value={targetWordCount}
            onChangeText={setTargetWordCount}
            keyboardType="numeric"
            editable={!isLoading}
            helperText="Nombre de mots que vous visez"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Structure narrative</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={structure}
                onValueChange={(itemValue) => setStructure(itemValue)}
                enabled={!isLoading}
                style={styles.picker}
              >
                <Picker.Item label="Choisir une structure (optionnel)" value="" />
                {STRUCTURE_TEMPLATES.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>
          </View>

          <Button
            title="Créer le projet"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleCreate}
            isLoading={isLoading}
            style={styles.createButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: spacing.md,
  },
  pickerLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  pickerWrapper: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  createButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});

export default CreateProjectScreen;
