import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Image, Linking } from 'react-native';

interface KegalExercisesProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

const { width, height } = Dimensions.get('window');

export default function KegalExercises({ visible, onClose, isDark }: KegalExercisesProps) {
  const videoUrl = 'https://www.youtube.com/watch?v=LwqN40QSRTo';

  const handleWatchVideo = async () => {
    try {
      await Linking.openURL(videoUrl);
    } catch (error) {
      console.error('Error opening video:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
              💪 Kegal Exercises
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <View style={[styles.imageContainer, { backgroundColor: isDark ? '#333' : '#f8f8f8' }]}>
              <View style={styles.illustrationBox}>
                <Text style={styles.illustrationIcon}>🧘‍♂️</Text>
                <Text style={[styles.illustrationText, { color: isDark ? '#fff' : '#000' }]}>
                  Pelvic Floor Exercise
                </Text>
                <Text style={[styles.illustrationSubtext, { color: isDark ? '#ccc' : '#666' }]}>
                  Strengthen your core muscles
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.watchButton, { 
                backgroundColor: '#FF0000',
                shadowColor: '#FF0000'
              }]}
              onPress={handleWatchVideo}
            >
              <Text style={styles.playIcon}>▶️</Text>
              <Text style={styles.watchButtonText}>Watch on YouTube</Text>
            </TouchableOpacity>
            
            <View style={styles.infoContainer}>
              <Text style={[styles.infoTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                🌟 Benefits of Kegal Exercises:
              </Text>
              <View style={styles.benefitsList}>
                <Text style={[styles.benefitItem, { color: isDark ? '#ccc' : '#666' }]}>
                  ✓ Strengthens pelvic floor muscles
                </Text>
                <Text style={[styles.benefitItem, { color: isDark ? '#ccc' : '#666' }]}>
                  ✓ Improves bladder and bowel control
                </Text>
                <Text style={[styles.benefitItem, { color: isDark ? '#ccc' : '#666' }]}>
                  ✓ Enhances sexual health and performance
                </Text>
                <Text style={[styles.benefitItem, { color: isDark ? '#ccc' : '#666' }]}>
                  ✓ Supports your recovery journey
                </Text>
                <Text style={[styles.benefitItem, { color: isDark ? '#ccc' : '#666' }]}>
                  ✓ Reduces urinary incontinence
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelButtonText, { color: isDark ? '#fff' : '#000' }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  illustrationBox: {
    alignItems: 'center',
  },
  illustrationIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  illustrationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  illustrationSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  benefitsList: {
    paddingLeft: 10,
  },
  benefitItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  cancelButton: {
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});