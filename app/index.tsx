import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 3) / 2;
const CARD_HEIGHT = 140;

const languages = [
  {
    id: 'cinamwanga',
    name: 'CINAMWANGA',
    description: 'Hymns in Namwanga',
    isSupported: true,
    icon: 'book',
  },
  {
    id: 'bembe',
    name: 'BEMBA',
    description: 'Hymns in Bemba',
    isSupported: false,
    icon: 'book',
  },
  {
    id: 'cewa',
    name: 'CEWA',
    description: 'Hymns in Cewa',
    isSupported: false,
    icon: 'book',
  },
  {
    id: 'tumbaka',
    name: 'TUMBUKA',
    description: 'Hymns in Tumbuka',
    isSupported: false,
    icon: 'book',
  },
];

export default function LanguageSelection() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLanguageSelect = (languageId: string) => {
    router.push(`/hymns/${languageId}`);
  };

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[
          theme.colors.primary,
          '#2E7D32',
          '#1B4D3E',
        ]}
        style={styles.background}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>ANC Hymn Book</Text>
            <Text style={styles.subtitle}>Select Language</Text>
          </View>
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={handleThemeToggle}
          >
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={24} 
              color={theme.colors.background} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <View style={styles.languageGrid}>
              {languages.map((lang, index) => (
                <Animated.View
                  key={lang.id}
                  entering={FadeInDown.delay(index * 100).duration(500)}
                >
                  <TouchableOpacity
                    style={[
                      styles.languageCard,
                      !lang.isSupported && styles.unsupportedCard
                    ]}
                    onPress={() => handleLanguageSelect(lang.id)}
                    activeOpacity={0.7}
                    disabled={!lang.isSupported}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.iconContainer}>
                        <Ionicons 
                          name={lang.icon as any} 
                          size={24} 
                          color={lang.isSupported ? theme.colors.primary : theme.colors.textLight + '80'} 
                        />
                      </View>
                      <View style={styles.arrowContainer}>
                        <Ionicons 
                          name={lang.isSupported ? "chevron-forward" : "lock-closed"} 
                          size={20} 
                          color={lang.isSupported ? theme.colors.primary : theme.colors.textLight + '80'} 
                        />
                      </View>
                    </View>
                    <View style={styles.languageContent}>
                      <Text style={[
                        styles.languageName,
                        !lang.isSupported && styles.unsupportedText
                      ]}>
                        {lang.name}
                      </Text>
                      <Text style={[
                        styles.languageDescription,
                        !lang.isSupported && styles.unsupportedText
                      ]}>
                        {lang.description}
                      </Text>
                      {!lang.isSupported && (
                        <View style={styles.comingSoonBadge}>
                          <Ionicons 
                            name="time-outline" 
                            size={12} 
                            color={theme.colors.background} 
                          />
                          <Text style={styles.comingSoonText}>Coming Soon</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>ANC Version {Constants.expoConfig?.version || '1.0.0'}</Text>
              <Text style={styles.versionText}>Powered by Lampsync Technologies Zambia</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,

  },
  header: {
    backgroundColor: 'transparent',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    color: theme.colors.background,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 20,
    color: theme.colors.background,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  languageCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unsupportedCard: {
    opacity: 0.8,
    backgroundColor: theme.colors.background + 'CC',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  languageName: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  languageDescription: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  unsupportedText: {
    color: theme.colors.textLight + 'CC',
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  comingSoonText: {
    color: theme.colors.background,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  versionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    opacity: 0.7,
    marginTop: 'auto',
    gap: 5
  },
  versionText: {
    fontSize: 12,
    color: theme.colors.background,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 