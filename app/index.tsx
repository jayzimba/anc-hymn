import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import UpdateModal from './components/UpdateModal';
import * as Updates from 'expo-updates';

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
    id: 'bemba',
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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        const currentVersion = Constants.expoConfig?.version || '1.0.0';
        setLatestVersion(currentVersion);
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      // For testing in development - uncomment the line below to test the modal
      // setLatestVersion('2.0.0');
      // setShowUpdateModal(true);
    }
  };

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
        colors={isDarkMode ? [
          '#1a1a1a',
          '#2d2d2d',
          '#000000',
        ] : [
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
                      isDarkMode && styles.darkCard,
                      !lang.isSupported && styles.unsupportedCard,
                      !lang.isSupported && isDarkMode && styles.darkUnsupportedCard
                    ]}
                    onPress={() => handleLanguageSelect(lang.id)}
                    activeOpacity={0.7}
                    disabled={!lang.isSupported}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[
                        styles.iconContainer,
                        isDarkMode && styles.darkIconContainer
                      ]}>
                        <Ionicons 
                          name={lang.icon as any} 
                          size={24} 
                          color={lang.isSupported ? (isDarkMode ? theme.colors.primary : theme.colors.primary) : (isDarkMode ? '#666666' : theme.colors.textLight + '80')} 
                        />
                      </View>
                      <View style={[
                        styles.arrowContainer,
                        isDarkMode && styles.darkArrowContainer
                      ]}>
                        <Ionicons 
                          name={lang.isSupported ? "chevron-forward" : "lock-closed"} 
                          size={20} 
                          color={lang.isSupported ? (isDarkMode ? theme.colors.primary : theme.colors.primary) : (isDarkMode ? '#666666' : theme.colors.textLight + '80')} 
                        />
                      </View>
                    </View>
                    <View style={styles.languageContent}>
                      <Text style={[
                        styles.languageName,
                        isDarkMode && styles.darkText,
                        !lang.isSupported && styles.unsupportedText
                      ]}>
                        {lang.name}
                      </Text>
                      <Text style={[
                        styles.languageDescription,
                        isDarkMode && styles.darkTextLight,
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
              <Text style={styles.versionText}>Version {Constants.expoConfig?.version || '1.0.0'}</Text>
              <Text style={styles.versionText}>© {new Date().getFullYear()} Africa National Church</Text> 
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <UpdateModal 
        isVisible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        version={latestVersion}
      />
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

  },
  header: {
    backgroundColor: 'transparent',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    alignItems: 'flex-start',
    flex: 1,
  },
  title: {
    fontSize: 25,
    color: theme.colors.background,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.background,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: '500',
    fontStyle: 'italic',
    letterSpacing: 0.3,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  unsupportedCard: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  languageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  languageName: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.3,
  },
  languageDescription: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
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
    marginTop: theme.spacing.xs,
  },
  comingSoonText: {
    color: theme.colors.background,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
    letterSpacing: 0.2,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  // Dark mode styles
  darkCard: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  darkUnsupportedCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    opacity: 0.6,
  },
  darkText: {
    color: '#ffffff',
  },
  darkTextLight: {
    color: '#cccccc',
  },
  darkIconContainer: {
    backgroundColor: '#ffffff',
    borderColor: theme.colors.primary + '30',
  },
  darkArrowContainer: {
    backgroundColor: '#ffffff',
    borderColor: theme.colors.primary + '30',
  },
}); 