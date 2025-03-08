import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getFavoriteHymns, FavoriteHymn } from '../../../utils/database';
import { useTheme } from '../../../context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';

const getLanguageDisplay = (language: string): string => {
  const languages = {
    cinamwanga: 'Namwanga',
    bemba: 'Bemba',
    cewa: 'Cewa',
    tumbaka: 'Tumbuka'
  };
  return languages[language as keyof typeof languages] || language;
};

export default function FavoriteHymns() {
  const { language } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [favorites, setFavorites] = useState<FavoriteHymn[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadFavorites = async () => {
    try {
      setRefreshing(true);
      const favHymns = await getFavoriteHymns(language as string);
      setFavorites(favHymns);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    await loadFavorites();
  }, [language]);

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused, language]);

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#000000' : theme.colors.background }
    ]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[
        styles.header,
        { 
          borderBottomColor: isDarkMode ? theme.colors.primary + '40' : theme.colors.primary + '20',
          backgroundColor: isDarkMode ? '#000000' : theme.colors.background
        }
      ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={theme.colors.accent} 
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            { color: isDarkMode ? '#FFFFFF' : theme.colors.primary }
          ]}>Favorite Hymns</Text>
          <Text style={[
            styles.subtitle,
            { color: isDarkMode ? '#FFFFFF80' : theme.colors.primary }
          ]}>
            {favorites.length} {favorites.length === 1 ? 'hymn' : 'hymns'} from all languages
          </Text>
        </View>
      </View>

      <FlatList
        data={favorites}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 50).duration(500)}
          >
            <TouchableOpacity
              style={[
                styles.hymnItem,
                { 
                  backgroundColor: isDarkMode ? '#111111' : theme.colors.background,
                  borderColor: isDarkMode ? theme.colors.primary + '40' : theme.colors.primary + '20',
                  shadowColor: isDarkMode ? '#000000' : theme.colors.primary
                }
              ]}
              onPress={() => router.push(`/hymns/${item.language}/${item.hymnId}`)}
              activeOpacity={0.7}
            >
              <View style={styles.hymnNumberContainer}>
                <View style={[
                  styles.hymnNumber,
                  { backgroundColor: isDarkMode ? '#FFFFFF20' : theme.colors.primary + '15' }
                ]}>
                  <Text style={[
                    styles.hymnNumberText,
                    { color: isDarkMode ? '#FFFFFF' : theme.colors.primary }
                  ]}>{item.number}</Text>
                </View>
                <View style={[
                  styles.hymnDivider,
                  { backgroundColor: isDarkMode ? '#FFFFFF40' : theme.colors.primary + '30' }
                ]} />
              </View>
              <View style={styles.hymnContent}>
                <Text style={[
                  styles.hymnTitle,
                  { color: isDarkMode ? '#FFFFFF' : theme.colors.text }
                ]}>{item.title}</Text>
                <View style={styles.hymnMetadata}>
                  <View style={[
                    styles.languageTag,
                    { backgroundColor: isDarkMode ? theme.colors.accent : theme.colors.primary + '15' }
                  ]}>
                    <Text style={[
                      styles.languageText,
                      { color: isDarkMode ? '#FFFFFF' : theme.colors.primary }
                    ]}>
                      {getLanguageDisplay(item.language)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.dateAdded,
                    { color: isDarkMode ? '#FFFFFF80' : theme.colors.text + '80' }
                  ]}>
                    Added {new Date(item.dateAdded || '').toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.arrowContainer,
                { backgroundColor: isDarkMode ? '#FFFFFF20' : theme.colors.primary + '15' }
              ]}>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={isDarkMode ? '#FFFFFF' : theme.colors.primary} 
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        keyExtractor={(item) => `${item.language}-${item.hymnId}`}
        contentContainerStyle={[
          styles.listContainer,
          { backgroundColor: isDarkMode ? '#000000' : theme.colors.background }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={[
            styles.emptyContainer,
            { backgroundColor: isDarkMode ? '#000000' : theme.colors.background }
          ]}>
            <Ionicons 
              name="heart-outline" 
              size={64} 
              color={theme.colors.accent} 
            />
            <Text style={[
              styles.emptyTitle,
              { color: isDarkMode ? '#FFFFFF' : theme.colors.primary }
            ]}>No Favorites Yet</Text>
            <Text style={[
              styles.emptyText,
              { color: isDarkMode ? '#FFFFFF' : theme.colors.text }
            ]}>
              Add hymns to your favorites by tapping the heart icon while viewing them.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  hymnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hymnNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  hymnNumber: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hymnNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  hymnDivider: {
    width: 1,
    height: 24,
    marginLeft: theme.spacing.md,
  },
  hymnContent: {
    flex: 1,
  },
  hymnTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  hymnMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  languageTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateAdded: {
    fontSize: 12,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl * 2,
    marginTop: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
}); 