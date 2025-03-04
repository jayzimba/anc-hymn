import { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getHymnById } from '../../../data/hymnData';

// TODO: Implement actual favorite storage and retrieval
const getFavoriteHymns = (language: string) => {
  // This is a placeholder. Replace with actual implementation using AsyncStorage or similar
  return [];
};

export default function FavoriteHymns() {
  const { language } = useLocalSearchParams();
  const router = useRouter();
  const [favoriteHymns, setFavoriteHymns] = useState(getFavoriteHymns(language as string));

  const renderHymnItem = ({ item, index }: { item: { id: number; title: string; number: string }, index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(500)}
    >
      <TouchableOpacity
        style={styles.hymnItem}
        onPress={() => router.push(`/hymns/${language}/${item.id}`)}
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
            color={theme.colors.primary} 
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
          <Text style={styles.title}>Favorite Hymns</Text>
          <Text style={styles.subtitle}>
            {favoriteHymns.length} {favoriteHymns.length === 1 ? 'hymn' : 'hymns'}
          </Text>
        </View>
      </View>

      <FlatList
        data={favoriteHymns}
        renderItem={renderHymnItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="heart-outline" 
              size={64} 
              color={theme.colors.primary} 
            />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
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
  title: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.primary,
    opacity: 0.8,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
}); 