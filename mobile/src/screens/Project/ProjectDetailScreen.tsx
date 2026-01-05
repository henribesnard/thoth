/**
 * Project Detail Screen
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../App';
import { useProjectStore } from '../../store/projectStore';
import { Button, Card, CardContent, Badge } from '../../components/ui';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { STATUS_OPTIONS } from '../../constants/config';

type ProjectDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProjectDetail'
>;
type ProjectDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProjectDetail'>;

const ProjectDetailScreen = () => {
  const navigation = useNavigation<ProjectDetailScreenNavigationProp>();
  const route = useRoute<ProjectDetailScreenRouteProp>();
  const { projectId } = route.params;

  const { currentProject, isLoading, fetchProject } = useProjectStore();

  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]);

  if (isLoading || !currentProject) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  const progress = currentProject.target_word_count
    ? Math.round((currentProject.current_word_count / currentProject.target_word_count) * 100)
    : 0;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'success';
      case 'completed':
        return 'primary';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Badge variant={getStatusBadgeVariant(currentProject.status)}>
          {getStatusLabel(currentProject.status)}
        </Badge>
      </View>

      <ScrollView style={styles.content}>
        {/* Project Info */}
        <View style={styles.projectInfo}>
          <Text style={styles.title}>{currentProject.title}</Text>
          {currentProject.description && (
            <Text style={styles.description}>{currentProject.description}</Text>
          )}
          {currentProject.genre && (
            <Text style={styles.genre}>Genre: {currentProject.genre}</Text>
          )}
        </View>

        {/* Statistics Card */}
        <Card variant="elevated" style={styles.card}>
          <CardContent>
            <Text style={styles.cardTitle}>Statistiques</Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {currentProject.current_word_count.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Mots écrits</Text>
              </View>

              {currentProject.target_word_count && (
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {currentProject.target_word_count.toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>Objectif</Text>
                </View>
              )}
            </View>

            {currentProject.target_word_count && (
              <>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
                </View>
                <Text style={styles.progressText}>Progression: {progress}%</Text>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Chat avec THOTH"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Chat', { projectId: currentProject.id })}
            style={styles.actionButton}
          />

          <Button
            title="Voir les documents"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => {}}
            style={styles.actionButton}
          />
        </View>

        {/* Info Cards */}
        {currentProject.structure_template && (
          <Card variant="outlined" style={styles.card}>
            <CardContent>
              <Text style={styles.cardTitle}>Structure narrative</Text>
              <Text style={styles.cardText}>{currentProject.structure_template}</Text>
            </CardContent>
          </Card>
        )}

        <Card variant="outlined" style={styles.card}>
          <CardContent>
            <Text style={styles.cardTitle}>Dates</Text>
            <Text style={styles.cardText}>
              Créé le: {new Date(currentProject.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.cardText}>
              Modifié le: {new Date(currentProject.updated_at).toLocaleDateString()}
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    padding: spacing.xs,
  },
  backButtonText: {
    fontSize: fontSize.md,
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  projectInfo: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  genre: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  cardText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});

export default ProjectDetailScreen;
