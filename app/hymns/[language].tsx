import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getHymnsForLanguage, searchHymns } from '../../data/hymnData';

const { width } = Dimensions.get('window');

const SUPPORTED_LANGUAGES = ['cinamwanga', 'bembe', 'cewa', 'tumbaka'];

export default function HymnsList() {
  const { language } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHymns, setFilteredHymns] = useState(getHymnsForLanguage(language as string));

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    const filtered = searchHymns(language as string, text);
    setFilteredHymns(filtered);
  }, [language]);

  const handleHymnSelect = (hymnId: number) => {
    router.push(`/hymns/${language}/${hymnId}`);
  };

  const renderHymnItem = ({ item, index }: { item: { id: number; title: string; number: string }, index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(500)}
    >
      <TouchableOpacity
        style={styles.hymnItem}
        onPress={() => handleHymnSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.hymnNumberContainer}>
          <View style={styles.hymnNumber}>
            <Text style={styles.hymnNumberText}>{item.number}</Text>
          </View>
          <View style={styles.hymnDivider} />
        </View>
        <View style={styles.hymnContent}>
          <Text style={styles.hymnTitle}>{item.title}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.textLight} 
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const languageName = typeof language === 'string' ? language : language[0];
  const isSupported = languageName === 'cinamwanga';

  if (!isSupported) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.comingSoonContainer}>
          <Ionicons 
            name="time-outline" 
            size={64} 
            color={theme.colors.primary} 
          />
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            {languageName.charAt(0).toUpperCase() + languageName.slice(1)} hymns are being prepared.
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {languageName.charAt(0).toUpperCase() + languageName.slice(1)} Hymns
        </Text>
        <Text style={styles.subtitle}>ISONTELO LYA LWIMBO</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by number or title..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={theme.colors.text + '80'}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => router.push(`/hymns/${language}/favorites`)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="heart" 
            size={24} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHymns}
        renderItem={renderHymnItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="search-outline" 
              size={48} 
              color={theme.colors.primary} 
            />
            <Text style={styles.emptyText}>No hymns found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary + '20',
  },
  title: {
    fontSize: 28,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.primary,
    opacity: 0.8,
    fontWeight: '600',
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    elevation: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  favoritesButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    elevation: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  hymnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
    elevation: 2,
    shadowColor: theme.colors.primary,
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
    backgroundColor: theme.colors.primary + '15',
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hymnNumberText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  hymnDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.primary + '30',
    marginLeft: theme.spacing.md,
  },
  hymnContent: {
    flex: 1,
  },
  hymnTitle: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '500',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  comingSoonTitle: {
    fontSize: 32,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  comingSoonText: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
}); 