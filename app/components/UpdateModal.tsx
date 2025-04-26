import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { Linking } from 'react-native';

const { width } = Dimensions.get('window');

interface UpdateModalProps {
  isVisible: boolean;
  onClose: () => void;
  version: string;
}

export default function UpdateModal({ isVisible, onClose, version }: UpdateModalProps) {
  const handleUpdate = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('market://details?id=com.wedevelopers.anchymnbook');
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="cloud-download" size={32} color={theme.colors.primary} />
            <Text style={styles.title}>New Update Available</Text>
          </View>
          
          <Text style={styles.description}>
            A new version ({version}) of ANC Hymn Book is available on the Play Store. Update now to get the latest features and improvements.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Later</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.updateButton]} 
              onPress={handleUpdate}
              activeOpacity={0.7}
            >
              <Text style={styles.updateButtonText}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  blurContainer: {
    width: '100%',
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textLight,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  updateButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  updateButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
}); 