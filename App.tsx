import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { MainNavigator } from './src/navigation/MainNavigator';

function RootNavigation() {
  const { user } = useApp();
  return user ? <MainNavigator /> : <LoginScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigation />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
