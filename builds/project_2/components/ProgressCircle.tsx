import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressCircleProps {
  isDark: boolean;
}

export default function ProgressCircle({ isDark }: ProgressCircleProps) {
  const [days, setDays] = useState(0);
  const [timeString, setTimeString] = useState('00:00:00');
  const [animatedValue] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    startAnimations();
    return () => clearInterval(interval);
  }, []);

  const startAnimations = () => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const updateProgress = async () => {
    try {
      const startTime = await AsyncStorage.getItem('challengeStartTime');
      if (startTime) {
        const start = new Date(startTime);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        
        const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setDays(daysPassed);
        setTimeString(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        
        Animated.timing(animatedValue, {
          toValue: Math.min(daysPassed / 90, 1),
          duration: 1500,
          useNativeDriver: false,
        }).start();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getMotivationalMessage = () => {
    if (days === 0) return "🌱 Your transformation starts now!";
    if (days < 3) return "💪 Building unstoppable momentum...";
    if (days < 7) return "🔥 Crushing it day by day!";
    if (days < 14) return "⚡ Incredible progress unlocked!";
    if (days < 30) return "🚀 You're becoming legendary!";
    if (days < 60) return "💎 Diamond mindset activated!";
    if (days < 90) return "🏆 Champion level achieved!";
    return "👑 You are the MASTER!";
  };

  const getMilestoneReward = () => {
    if (days >= 365) return "👑 LEGEND";
    if (days >= 180) return "💎 DIAMOND";
    if (days >= 90) return "🏆 MASTER";
    if (days >= 60) return "🥇 CHAMPION";
    if (days >= 30) return "🔥 WARRIOR";
    if (days >= 14) return "⚡ FIGHTER";
    if (days >= 7) return "💪 STRONG";
    if (days >= 3) return "🌟 RISING";
    if (days >= 1) return "🌱 STARTER";
    return "🚀 READY";
  };

  const getProgressColor = () => {
    if (days >= 90) return isDark ? '#FFD700' : '#FF6F00';
    if (days >= 30) return isDark ? '#4CAF50' : '#2E7D32';
    if (days >= 7) return isDark ? '#2196F3' : '#1565C0';
    return isDark ? '#9C27B0' : '#6A1B9A';
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
      borderColor: getProgressColor(),
      borderWidth: 2,
    }]}>
      <Text style={[styles.sectionTitle, { color: getProgressColor() }]}>
        🎯 NofapJourney Progress
      </Text>
      
      <Animated.View style={[styles.circleContainer, { 
        transform: [{ scale: pulseAnim }],
        shadowColor: getProgressColor(),
        elevation: glowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 20],
        }),
      }]}>
        <View style={[styles.outerRing, { 
          borderColor: getProgressColor(),
          shadowColor: getProgressColor(),
        }]}>
          <View style={[styles.middleRing, { borderColor: getProgressColor() }]}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  height: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: `${getProgressColor()}40`,
                }
              ]}
            />
            <View style={styles.innerContent}>
              <Text style={styles.rewardBadge}>{getMilestoneReward()}</Text>
              <Text style={[styles.daysText, { color: getProgressColor() }]}>
                {days}
              </Text>
              <Text style={[styles.daysLabel, { color: isDark ? '#fff' : '#000' }]}>
                {days === 1 ? 'Day' : 'Days'} Clean
              </Text>
              <View style={[styles.timeContainer, { 
                backgroundColor: isDark ? '#2a2a3e' : '#f0f0f0',
                borderColor: getProgressColor(),
                borderWidth: 1,
              }]}>
                <Text style={[styles.timeText, { color: getProgressColor() }]}>
                  {timeString}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
      
      <View style={[styles.messageContainer, {
        backgroundColor: `${getProgressColor()}20`,
        borderColor: getProgressColor(),
        borderWidth: 1,
      }]}>
        <Text style={[styles.motivationMessage, { color: getProgressColor() }]}>
          {getMotivationalMessage()}
        </Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { 
          backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8',
          borderColor: getProgressColor(),
          borderWidth: 1,
        }]}>
          <Text style={styles.statIcon}>⏰</Text>
          <Text style={[styles.statNumber, { color: getProgressColor() }]}>{days * 24}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Hours</Text>
        </View>
        <View style={[styles.statCard, { 
          backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8',
          borderColor: getProgressColor(),
          borderWidth: 1,
        }]}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={[styles.statNumber, { color: getProgressColor() }]}>{Math.floor(days / 7)}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Weeks</Text>
        </View>
        <View style={[styles.statCard, { 
          backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8',
          borderColor: getProgressColor(),
          borderWidth: 1,
        }]}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={[styles.statNumber, { color: getProgressColor() }]}>{days}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Streak</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    elevation: 15,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 1,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  outerRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  middleRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 90,
  },
  innerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardBadge: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '700',
  },
  daysText: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 4,
  },
  daysLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  timeContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
  },
  motivationMessage: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  statCard: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 90,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});