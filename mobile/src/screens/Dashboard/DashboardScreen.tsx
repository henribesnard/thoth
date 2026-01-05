/**
 * Dashboard Screen - Main app screen
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../App';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { Button, Card, CardContent, Badge } from '../../components/ui';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { STATUS_OPTIONS } from '../../constants/config';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user, logout } = useAuthStore();
  const { projects, isLoading, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleRefresh = () => {
    fetchProjects();
  };

  const totalWordCount = projects.reduce((sum, p) => sum + p.current_word_count, 0);
  const inProgressCount = projects.filter((p) => p.status === 'in-progress').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;

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
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.full_name || 'Écrivain'} !</Text>
          <Text style={styles.subGreeting}>Prêt à écrire aujourd'hui ?</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{projects.length}</Text>
            <Text style={styles.statLabel}>Projets</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalWordCount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Mots écrits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Terminés</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Nouveau Projet"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('CreateProject')}
            style={styles.actionButton}
          />
          <Button
            title="Chat avec THOTH"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Chat', {})}
            style={styles.actionButton}
          />
        </View>

        {/* Projects List */}
        <View style={styles.projectsSection}>
          <Text style={styles.sectionTitle}>Mes Projets</Text>

          {projects.length === 0 ? (
            <Card variant="outlined">
              <CardContent>
                <Text style={styles.emptyText}>
                  Vous n'avez pas encore de projets.{'\n'}
                  Créez-en un pour commencer !
                </Text>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                variant="elevated"
                onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
                style={styles.projectCard}
              >
                <CardContent>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {getStatusLabel(project.status)}
                    </Badge>
                  </View>

                  {project.description && (
                    <Text style={styles.projectDescription} numberOfLines={2}>
                      {project.description}
                    </Text>
                  )}

                  <View style={styles.projectStats}>
                    <Text style={styles.projectStat}>
                      📝 {project.current_word_count.toLocaleString()} mots
                    </Text>
                    {project.target_word_count && (
                      <Text style={styles.projectStat}>
                        🎯 {Math.round((project.current_word_count / project.target_word_count) * 100)}%
                      </Text>
                    )}
                  </View>

                  {project.target_word_count && (
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${Math.min(
                              (project.current_word_count / project.target_word_count) * 100,
                              100
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
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
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  subGreeting: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  logoutText: {
    fontSize: fontSize.sm,
    color: colors.error.main,
    fontWeight: fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.primary[50],
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary[700],
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.primary[600],
    marginTop: spacing.xs,
  },
  actionsContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  projectsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  projectCard: {
    marginBottom: spacing.md,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  projectTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  projectDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  projectStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  projectStat: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default DashboardScreen;
