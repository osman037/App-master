import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HabitsTrackerProps {
  isDark: boolean;
}

interface Habit {
  id: string;
  name: string;
  enabled: boolean;
  streak: number;
  completedToday: boolean;
  icon: string;
}

const defaultHabits: Habit[] = [
  { id: 'namaz', name: 'Namaz (5 times)', enabled: true, streak: 0, completedToday: false, icon: '🕌' },
  { id: 'workout', name: 'Workout', enabled: true, streak: 0, completedToday: false, icon: '💪' },
  { id: 'coldshower', name: 'Cold Shower', enabled: true, streak: 0, completedToday: false, icon: '🚿' },
  { id: 'reading', name: 'Reading Quran', enabled: true, streak: 0, completedToday: false, icon: '📖' },
  { id: 'meditation', name: 'Meditation', enabled: true, streak: 0, completedToday: false, icon: '🧘' },
];

export default function HabitsTracker({ isDark }: HabitsTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [animations] = useState(habits.map(() => new Animated.Value(1)));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadHabits();
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem('habits');
      if (stored) {
        const loadedHabits = JSON.parse(stored);
        setHabits(loadedHabits);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const toggleHabit = (id: string, index: number) => {
    const updated = habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    });
    
    // Enhanced animation
    Animated.sequence([
      Animated.timing(animations[index], {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(animations[index], {
        toValue: 1.1,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    saveHabits(updated);
  };

  const enabledHabits = habits.filter(habit => habit.enabled);
  const completedCount = enabledHabits.filter(habit => habit.completedToday).length;
  const completionPercentage = enabledHabits.length > 0 ? (completedCount / enabledHabits.length) * 100 : 0;

  const getProgressColor = () => {
    if (completionPercentage === 100) return isDark ? '#FFD700' : '#FF6F00';
    if (completionPercentage >= 80) return isDark ? '#4CAF50' : '#2E7D32';
    if (completionPercentage >= 60) return isDark ? '#2196F3' : '#1565C0';
    if (completionPercentage >= 40) return isDark ? '#FF9800' : '#E65100';
    return isDark ? '#F44336' : '#C62828';
  };

  const getMotivationMessage = () => {
    if (completionPercentage === 100) return "🏆 PERFECT DAY! You're unstoppable!";
    if (completionPercentage >= 80) return "🔥 Amazing progress! Keep pushing!";
    if (completionPercentage >= 60) return "💪 Great momentum! You're doing well!";
    if (completionPercentage >= 40) return "⚡ Good start! Let's complete more!";
    if (completionPercentage > 0) return "🌱 Every step counts! Keep going!";
    return "🚀 Ready to start your transformation?";
  };

  return (
    <Animated.View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
        borderColor: getProgressColor(),
        borderWidth: 2,
        transform: [{ scale: pulseAnim }],
      }
    ]}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>⚡</Text>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: getProgressColor() }]}>Daily Power Habits</Text>
          <Text style={[styles.subtitle, { color: getProgressColor() }]}>
            {completedCount}/{enabledHabits.length} completed • {Math.round(completionPercentage)}% mastery
          </Text>
        </View>
        <Text style={styles.trophyEmoji}>{completionPercentage === 100 ? '🏆' : '🎯'}</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={[styles.progressBarContainer, {
          backgroundColor: isDark ? '#333' : '#e0e0e0',
          borderColor: getProgressColor(),
          borderWidth: 1,
        }]}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                width: `${completionPercentage}%`,
                backgroundColor: getProgressColor(),
              }
            ]}
          />
        </View>
        <Text style={[styles.motivationText, { color: getProgressColor() }]}>
          {getMotivationMessage()}
        </Text>
      </View>

      <View style={styles.habitsContainer}>
        {enabledHabits.map((habit, index) => {
          const isCompleted = habit.completedToday;
          const cardColor = isCompleted ? getProgressColor() : (isDark ? '#2a2a3e' : '#f8f8f8');
          
          return (
            <Animated.View 
              key={habit.id} 
              style={[{ transform: [{ scale: animations[index] }] }]}
            >
              <TouchableOpacity
                style={[
                  styles.habitCard,
                  {
                    backgroundColor: cardColor,
                    borderColor: getProgressColor(),
                    borderWidth: isCompleted ? 3 : 1,
                    shadowColor: isCompleted ? getProgressColor() : '#000',
                    elevation: isCompleted ? 12 : 6,
                  }
                ]}
                onPress={() => toggleHabit(habit.id, index)}
                activeOpacity={0.8}
              >
                <View style={styles.habitContent}>
                  <View style={styles.habitLeft}>
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                    <View style={styles.habitInfo}>
                      <Text style={[
                        styles.habitName,
                        { color: isCompleted ? '#fff' : (isDark ? '#fff' : '#000') }
                      ]}>
                        {habit.name}
                      </Text>
                      <View style={styles.streakContainer}>
                        <Text style={[
                          styles.streakText,
                          { color: isCompleted ? '#fff' : getProgressColor() }
                        ]}>
                          🔥 {habit.streak} day streak
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[
                    styles.checkIcon,
                    { 
                      backgroundColor: isCompleted ? '#fff' : 'transparent',
                      borderColor: isCompleted ? '#fff' : getProgressColor(),
                      borderWidth: 2,
                    }
                  ]}>
                    <Text style={[
                      styles.checkText,
                      { color: isCompleted ? getProgressColor() : (isDark ? '#666' : '#ccc') }
                    ]}>
                      {isCompleted ? '✓' : '○'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <View style={[styles.footerQuote, {
        backgroundColor: `${getProgressColor()}20`,
        borderColor: getProgressColor(),
        borderWidth: 1,
      }]}>
        <Text style={[styles.quoteText, { color: getProgressColor() }]}>
          "Excellence is not an act, but a habit" - Aristotle
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 25,
    padding: 25,
    elevation: 15,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  trophyEmoji: {
    fontSize: 28,
  },
  progressSection: {
    marginBottom: 25,
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  habitsContainer: {
    gap: 15,
    marginBottom: 20,
  },
  habitCard: {
    borderRadius: 20,
    padding: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 20,
    fontWeight: '800',
  },
  footerQuote: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
  },
});