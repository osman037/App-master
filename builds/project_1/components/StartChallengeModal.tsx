import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StartChallengeModalProps {
  visible: boolean;
  onStartChallenge: () => void;
}

const { width } = Dimensions.get('window');

export default function StartChallengeModal({ visible, onStartChallenge }: StartChallengeModalProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleStartChallenge = async () => {
    setIsStarting(true);
    try {
      const startTime = Date.now();
      await AsyncStorage.setItem('challengeStartTime', startTime.toString());
      await AsyncStorage.setItem('hasStartedChallenge', 'true');
      onStartChallenge();
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
    setIsStarting(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] }
        ]}>
          <View style={styles.header}>
            <Text style={styles.welcomeEmoji}>🌟</Text>
            <Text style={styles.bismillah}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>
            <Text style={styles.title}>NofapJourney</Text>
            <Text style={styles.subtitle}>Your Path to Transformation</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.verseContainer}>
              <Text style={styles.verse}>"وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ"</Text>
              <Text style={styles.translation}>"And those who guard their private parts"</Text>
              <Text style={styles.reference}>📖 Quran 23:5</Text>
            </View>
            
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureText}>Track Progress</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>💪</Text>
                <Text style={styles.featureText}>Build Habits</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🌱</Text>
                <Text style={styles.featureText}>Grow Spiritually</Text>
              </View>
            </View>
            
            <Text style={styles.description}>
              Begin your journey towards self-discipline and spiritual growth. 
              May Allah grant you strength and unwavering determination.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.startButton, isStarting && styles.startButtonDisabled]}
            onPress={handleStartChallenge}
            disabled={isStarting}
          >
            <Text style={styles.startButtonText}>
              {isStarting ? '🚀 Starting Your Journey...' : '🌟 Begin NofapJourney'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.motivationText}>
            "Every master was once a beginner. Every pro was once an amateur."
          </Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.92,
    backgroundColor: '#1a1a2e',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
    elevation: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  bismillah: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#4CAF50',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    marginBottom: 25,
  },
  verseContainer: {
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  verse: {
    fontSize: 22,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    lineHeight: 32,
  },
  translation: {
    fontSize: 17,
    color: '#ffffff',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
    fontWeight: '500',
  },
  reference: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 12,
    color: '#cccccc',
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginBottom: 15,
  },
  startButtonDisabled: {
    backgroundColor: '#666666',
    shadowColor: '#666666',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  motivationText: {
    fontSize: 13,
    color: '#888888',
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  },
});