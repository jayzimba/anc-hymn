import { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getHymnById, getHymnContent, getHymnsForLanguage } from '../../../data/hymnData';
import { useTheme } from '../../../context/ThemeContext';

export default function HymnContent() {
  const { language, id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const currentId = Number(id);
  const hymn = getHymnById(language as string, currentId);
  const content = getHymnContent(language as string, currentId);
  const allHymns = getHymnsForLanguage(language as string);
  const currentIndex = allHymns.findIndex((h: { id: number }) => h.id === currentId);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set new timeout
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1500); // Buttons become visible again after 1.5 seconds of no scrolling
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement actual favorite storage logic
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < allHymns.length) {
      router.replace(`/hymns/${language}/${allHymns[newIndex].id}`);
    }
  };

  if (!hymn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={theme.colors.primary}
          />
          <Text style={styles.errorTitle}>Hymn Not Found</Text>
          <Text style={styles.errorText}>
            The requested hymn could not be found.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.primary + '20' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.hymnTitle, { color: theme.colors.primary }]}>{hymn.title}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={[styles.content, { color: theme.colors.text }]}>{content}</Text>
      </ScrollView>

      <View style={[styles.navigationContainer, { borderTopColor: theme.colors.primary + '20' }]}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={() => handleNavigate('prev')}
          disabled={currentIndex === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={32} 
            color={currentIndex === 0 ? theme.colors.primary + '40' : theme.colors.primary} 
          />
        </TouchableOpacity>
        <Text style={[styles.hymnNumber, { color: theme.colors.primary }]}>#{hymn.number}</Text>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === allHymns.length - 1 && styles.navButtonDisabled]}
          onPress={() => handleNavigate('next')}
          disabled={currentIndex === allHymns.length - 1}
        >
          <Ionicons 
            name="chevron-forward" 
            size={32} 
            color={currentIndex === allHymns.length - 1 ? theme.colors.primary + '40' : theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <View style={[
        styles.floatingButtonsContainer,
        isScrolling && styles.floatingButtonsTransparent
      ]}>
        <TouchableOpacity
          style={[
            styles.floatingButton,
            isDarkMode && styles.buttonActive,
            isScrolling && styles.buttonTransparent
          ]}
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon"}
            size={24}
            color={isDarkMode ? theme.colors.background : theme.colors.primary}
            style={isScrolling && { opacity: 0.3 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.floatingButton,
            isFavorite && styles.buttonActive,
            isScrolling && styles.buttonTransparent
          ]}
          onPress={() => setIsFavorite(!isFavorite)}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? theme.colors.background : theme.colors.primary}
            style={isScrolling && { opacity: 0.3 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary + '20',
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  hymnNumber: {
    fontSize: 25,
    color: theme.colors.primary,
    opacity: 0.8,
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
  },
  hymnTitle: {
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
  },
  contentWrapper: {
    padding: theme.spacing.lg,
  },
  content: {
    fontSize: 18,
    color: theme.colors.text,
    lineHeight: 28,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: 32,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: theme.spacing.xl,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary + '20',
  },
  navButton: {
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xl,
  },
  navButtonDisabled: {
    opacity: 0.8,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    right: theme.spacing.sm,
    bottom: 130,
    gap: 10,
  },
  floatingButtonsTransparent: {
    opacity: 0.3,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  buttonActive: {
    backgroundColor: theme.colors.primary,
  },
  buttonTransparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
}); 