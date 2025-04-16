import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { initDatabase } from '../utils/database';
import DailyVerse from './components/DailyVerse';

function RootLayoutNav() {
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <DailyVerse />
    </View>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
