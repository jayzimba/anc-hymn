import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Animated, NativeSyntheticEvent, NativeScrollEvent, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getHymnById, getHymnContent, getHymnsForLanguage } from '../../../data/hymnData';
import { useTheme } from '../../../context/ThemeContext';
import { addFavoriteHymn, removeFavoriteHymn, isHymnFavorite } from '../../../utils/database';
import * as Haptics from 'expo-haptics';

export default function HymnContent() {
  const { language, id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const favoriteAnimationValue = useRef(new Animated.Value(1)).current;
  const themeAnimationValue = useRef(new Animated.Value(1)).current;
  const zoomInAnimationValue = useRef(new Animated.Value(1)).current;
  const zoomOutAnimationValue = useRef(new Animated.Value(1)).current;
  const currentId = Number(id);
  const hymn = getHymnById(language as string, currentId);
  const content = getHymnContent(language as string, currentId);
  const allHymns = getHymnsForLanguage(language as string);
  const currentIndex = allHymns.findIndex((h: { id: number }) => h.id === currentId);

  useEffect(() => {
    checkFavoriteStatus();
  }, [language, currentId]);

  const checkFavoriteStatus = async () => {
    try {
      const favorite = await isHymnFavorite(language as string, currentId);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set new timeout
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1800); // Buttons become visible again after 1.5 seconds of no scrolling
  };

  const animateButton = (animatedValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleThemePress = async () => {
    try {
      animateButton(themeAnimationValue);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleTheme();
    } catch (error) {
      console.error('Error toggling theme:', error);
      toggleTheme(); // Fallback if haptics fail
    }
  };

  const handleFavoritePress = async () => {
    try {
      animateButton(favoriteAnimationValue);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      if (isFavorite) {
        await removeFavoriteHymn(language as string, currentId);
      } else {
        await addFavoriteHymn(language as string, {
          id: currentId,
          title: hymn.title,
          number: hymn.number,
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLongPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push(`/hymns/${language}/favorites`);
    } catch (error) {
      // Fallback if haptics not available
      router.push(`/hymns/${language}/favorites`);
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < allHymns.length) {
      router.replace(`/hymns/${language}/${allHymns[newIndex].id}`);
    }
  };

  const handleZoom = async (type: 'in' | 'out') => {
    try {
      const animationValue = type === 'in' ? zoomInAnimationValue : zoomOutAnimationValue;
      animateButton(animationValue);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      setFontSize(current => {
        if (type === 'in' && current < 32) {
          return current + 2;
        } else if (type === 'out' && current > 14) {
          return current - 2;
        }
        return current;
      });
    } catch (error) {
      console.error('Error adjusting font size:', error);
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
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
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
        <Text style={[
          styles.content, 
          { 
            color: theme.colors.text,
            fontSize: fontSize 
          }
        ]}>{content}</Text>
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
        <Animated.View style={{ transform: [{ scale: zoomInAnimationValue }] }}>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              fontSize >= 32 && styles.buttonDisabled,
              isScrolling && styles.buttonTransparent
            ]}
            onPress={() => handleZoom('in')}
            disabled={fontSize >= 32}
            activeOpacity={1}
          >
            <Ionicons 
              name="add-circle-outline"
              size={24}
              color={fontSize >= 32 ? theme.colors.primary + '40' : theme.colors.primary}
              style={isScrolling && { opacity: 0.3 }}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: zoomOutAnimationValue }] }}>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              fontSize <= 14 && styles.buttonDisabled,
              isScrolling && styles.buttonTransparent
            ]}
            onPress={() => handleZoom('out')}
            disabled={fontSize <= 14}
            activeOpacity={1}
          >
            <Ionicons 
              name="remove-circle-outline"
              size={24}
              color={fontSize <= 14 ? theme.colors.primary + '40' : theme.colors.primary}
              style={isScrolling && { opacity: 0.3 }}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: themeAnimationValue }] }}>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              isDarkMode && styles.buttonActive,
              isScrolling && styles.buttonTransparent
            ]}
            onPress={handleThemePress}
            activeOpacity={1}
          >
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"}
              size={24}
              color={isDarkMode ? theme.colors.background : theme.colors.primary}
              style={isScrolling && { opacity: 0.3 }}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: favoriteAnimationValue }] }}>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              isFavorite && styles.buttonActive,
              isScrolling && styles.buttonTransparent
            ]}
            onPress={handleFavoritePress}
            onLongPress={handleLongPress}
            delayLongPress={500}
            activeOpacity={1}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? theme.colors.background : theme.colors.primary}
              style={isScrolling && { opacity: 0.3 }}
            />
          </TouchableOpacity>
        </Animated.View>
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
    paddingVertical: Platform.OS === 'android' ? theme.spacing.md : 0,
  },
  hymnNumber: {
    fontSize: 25,
    color: theme.colors.primary,
    opacity: 0.8,
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
  },
  hymnTitle: {
    fontSize: 20,
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
    bottom: Platform.OS === 'ios' ? 130 : 110,
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
  buttonDisabled: {
    opacity: 0.4,
  },
}); 