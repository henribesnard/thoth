/**
 * THOTH Mobile App - Main Entry Point
 * React Native + Expo Mobile-First Application
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Platform, useWindowDimensions } from 'react-native';

// Stores
import { useAuthStore } from './src/store/authStore';

// Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import ProjectDetailScreen from './src/screens/Project/ProjectDetailScreen';
import CreateProjectScreen from './src/screens/Project/CreateProjectScreen';
import ChatScreen from './src/screens/Chat/ChatScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  ProjectDetail: { projectId: string };
  CreateProject: undefined;
  Chat: { projectId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();
  const { width } = useWindowDimensions();

  // Limite la largeur sur desktop pour une meilleure UX
  const isDesktop = Platform.OS === 'web' && width > 768;
  const containerStyle = isDesktop
    ? {
        maxWidth: 480,
        marginHorizontal: 'auto' as const,
        width: '100%',
        minHeight: '100vh',
        boxShadow: '0 0 30px rgba(0,0,0,0.1)',
      }
    : { flex: 1 };

  useEffect(() => {
    loadUser();

    // Injection du CSS pour cacher les scrollbars sur web
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
        body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  const AppContent = (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            // Auth Stack
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            // App Stack
            <>
              <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'THOTH Dashboard' }}
              />
              <Stack.Screen
                name="ProjectDetail"
                component={ProjectDetailScreen}
                options={{ title: 'Projet' }}
              />
              <Stack.Screen
                name="CreateProject"
                component={CreateProjectScreen}
                options={{ title: 'Nouveau Projet' }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ title: 'Chat THOTH' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );

  // Sur desktop web, wrapper dans un conteneur avec largeur max
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
        <View style={containerStyle as any}>{AppContent}</View>
      </View>
    );
  }

  return AppContent;
}
