import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { getVerse } from '../utils/verseManager';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface Verse {
  text: string;
  reference: string;
  version: string;
  verseurl: string;
}

const DailyVerse = () => {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    loadVerse();
  }, []);

  const loadVerse = async () => {
    try {
      setLoading(true);
      setError(null);
      const verseData = await getVerse();
      if (verseData) {
        setVerse(verseData);
        setIsModalVisible(true);
      }
    } catch (err) {
      setError('Failed to load verse');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsModalVisible(false);
  };

  if (!verse && !loading && !error) {
    return null;
  }

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <BlurView intensity={20} style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Daily Verse</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1B4D3E" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.text }]}>
                {error || 'No verse available'}
              </Text>
            </View>
          ) : verse ? (
            <>
              <View style={styles.verseContainer}>
                <Text style={[styles.verseText, { color: colors.text }]}>
                  "{verse.text}"
                </Text>
                <Text style={[styles.reference, { color: colors.text }]}>
                  - {verse.reference}
                </Text>
                <Text style={[styles.version, { color: colors.text }]}>
                  {verse.version}
                </Text>
              </View>

              <TouchableOpacity 
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#2E7D32', '#1B4D3E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.amenButton}
                >
                  <Text style={styles.amenButtonText}>Amen</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </BlurView>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width - 32,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  verseContainer: {
    marginBottom: 24,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  reference: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    textAlign: 'right',
    opacity: 0.7,
  },
  amenButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  amenButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default DailyVerse; 