import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HabitsSettingsProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
  onHabitsUpdate: () => void;
}

interface Habit {
  id: string;
  name: string;
  enabled: boolean;
  streak: number;
  completedToday: boolean;
}

const defaultHabits: Habit[] = [
  { id: 'namaz', name: 'Namaz (5 times)', enabled: true, streak: 0, completedToday: false },
  { id: 'workout', name: 'Workout', enabled: true, streak: 0, completedToday: false },
  { id: 'coldshower', name: 'Cold Shower', enabled: true, streak: 0, completedToday: false },
];

export default function HabitsSettings({ visible, onClose, isDark, onHabitsUpdate }: HabitsSettingsProps) {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem('habits');
      if (stored) {
        setHabits(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
      onHabitsUpdate();
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const toggleHabit = (id: string) => {
    const updated = habits.map(habit => 
      habit.id === id ? { ...habit, enabled: !habit.enabled } : habit
    );
    saveHabits(updated);
  };

  const updateHabitName = (id: string, name: string) => {
    const updated = habits.map(habit => 
      habit.id === id ? { ...habit, name } : habit
    );
    saveHabits(updated);
  };

  const addNewHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        enabled: true,
        streak: 0,
        completedToday: false,
      };
      const updated = [...habits, newHabit];
      saveHabits(updated);
      setNewHabitName('');
    }
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter(habit => habit.id !== id);
    saveHabits(updated);
  };

  const resetHabitStreak = (id: string) => {
    const updated = habits.map(habit => 
      habit.id === id ? { ...habit, streak: 0, completedToday: false } : habit
    );
    saveHabits(updated);
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
              Habits Settings
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              Current Habits
            </Text>
            
            {habits.map((habit) => (
              <View key={habit.id} style={[styles.habitItem, { borderColor: isDark ? '#333' : '#e0e0e0' }]}>
                <View style={styles.habitHeader}>
                  <TextInput
                    style={[styles.habitNameInput, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ddd' }]}
                    value={habit.name}
                    onChangeText={(text) => updateHabitName(habit.id, text)}
                    placeholder="Habit name"
                    placeholderTextColor={isDark ? '#666' : '#999'}
                  />
                  <Switch
                    value={habit.enabled}
                    onValueChange={() => toggleHabit(habit.id)}
                    trackColor={{ false: '#767577', true: '#4CAF50' }}
                    thumbColor={habit.enabled ? '#fff' : '#f4f3f4'}
                  />
                </View>
                
                <View style={styles.habitStats}>
                  <Text style={[styles.streakText, { color: isDark ? '#ccc' : '#666' }]}>
                    Streak: {habit.streak} days
                  </Text>
                  <View style={styles.habitActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.resetButton]}
                      onPress={() => resetHabitStreak(habit.id)}
                    >
                      <Text style={styles.actionButtonText}>Reset</Text>
                    </TouchableOpacity>
                    {!['namaz', 'workout', 'coldshower'].includes(habit.id) && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => deleteHabit(habit.id)}
                      >
                        <Text style={styles.actionButtonText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
            
            <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              Add New Habit
            </Text>
            
            <View style={styles.addHabitContainer}>
              <TextInput
                style={[styles.newHabitInput, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ddd', backgroundColor: isDark ? '#333' : '#f9f9f9' }]}
                value={newHabitName}
                onChangeText={setNewHabitName}
                placeholder="Enter new habit name"
                placeholderTextColor={isDark ? '#666' : '#999'}
              />
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: newHabitName.trim() ? '#4CAF50' : '#ccc' }]}
                onPress={addNewHabit}
                disabled={!newHabitName.trim()}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.infoText, { color: isDark ? '#888' : '#666' }]}>
              💡 Tip: Enable/disable habits to show/hide them on the main screen. Default habits (Namaz, Workout, Cold Shower) cannot be deleted but can be renamed.
            </Text>
          </ScrollView>
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
    width: '90%',
    maxHeight: '85%',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  habitItem: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitNameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
  },
  habitActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addHabitContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  newHabitInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 10,
  },
});