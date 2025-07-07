import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './TriggerRecorderStyles';

interface Trigger {
  id: string;
  note: string;
  date: string;
  day: string;
}

interface TriggerRecorderProps {
  isDark: boolean;
}

export default function TriggerRecorder({ isDark }: TriggerRecorderProps) {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTriggerNote, setNewTriggerNote] = useState('');

  useEffect(() => {
    loadTriggers();
  }, []);

  const loadTriggers = async () => {
    try {
      const storedTriggers = await AsyncStorage.getItem('triggerRecords');
      if (storedTriggers) {
        const parsedTriggers = JSON.parse(storedTriggers);
        const sortedTriggers = parsedTriggers.sort((a: Trigger, b: Trigger) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTriggers(sortedTriggers);
      }
    } catch (error) {
      console.error('Error loading triggers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addManualTrigger = async () => {
    if (!newTriggerNote.trim()) {
      Alert.alert('Error', 'Please enter a trigger note');
      return;
    }

    try {
      const challengeData = await AsyncStorage.getItem('challengeData');
      let currentDay = 1;
      if (challengeData) {
        const data = JSON.parse(challengeData);
        currentDay = data.currentDay || 1;
      }

      const newTrigger: Trigger = {
        id: Date.now().toString(),
        note: newTriggerNote.trim(),
        date: new Date().toISOString(),
        day: `Day ${currentDay}`
      };

      const updatedTriggers = [newTrigger, ...triggers];
      await AsyncStorage.setItem('triggerRecords', JSON.stringify(updatedTriggers));
      setTriggers(updatedTriggers);
      setNewTriggerNote('');
      setShowAddModal(false);
      Alert.alert('Success', 'Trigger recorded successfully!');
    } catch (error) {
      console.error('Error saving trigger:', error);
      Alert.alert('Error', 'Failed to save trigger');
    }
  };

  const deleteTrigger = async (id: string) => {
    Alert.alert(
      'Delete Trigger',
      'Are you sure you want to delete this trigger record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedTriggers = triggers.filter(trigger => trigger.id !== id);
              await AsyncStorage.setItem('triggerRecords', JSON.stringify(updatedTriggers));
              setTriggers(updatedTriggers);
            } catch (error) {
              console.error('Error deleting trigger:', error);
            }
          }
        }
      ]
    );
  };

  const clearAllTriggers = async () => {
    Alert.alert(
      'Clear All Records',
      'Are you sure you want to delete all trigger records? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('triggerRecords');
              setTriggers([]);
            } catch (error) {
              console.error('Error clearing triggers:', error);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTrigger = ({ item }: { item: Trigger }) => (
    <View style={[styles.triggerCard, { backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8' }]}>
      <View style={styles.triggerHeader}>
        <Text style={[styles.triggerDate, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
          {formatDate(item.date)} - {item.day}
        </Text>
        <TouchableOpacity 
          onPress={() => deleteTrigger(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.triggerNote, { color: isDark ? '#fff' : '#000' }]}>
        {item.note}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>
          Loading triggers...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          📝 Trigger Records
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>
          Learn from your patterns to stay strong
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ Add Trigger Record</Text>
      </TouchableOpacity>

      {triggers.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearAllTriggers}
        >
          <Text style={styles.clearButtonText}>Clear All Records</Text>
        </TouchableOpacity>
      )}

      {triggers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={[styles.emptyTitle, { color: isDark ? '#fff' : '#000' }]}>
            No Triggers Recorded
          </Text>
          <Text style={[styles.emptyText, { color: isDark ? '#ccc' : '#666' }]}>
            Stay strong! When you face challenges, record your triggers to learn and grow.
          </Text>
          <Text style={styles.islamicQuote}>"وَمَن جَاهَدَ فَإِنَّمَا يُجَاهِدُ لِنَفْسِهِ"</Text>
          <Text style={[styles.quoteTranslation, { color: isDark ? '#aaa' : '#888' }]}>
            "And whoever strives, strives only for himself"
          </Text>
        </View>
      ) : (
        <FlatList
          data={triggers}
          renderItem={renderTrigger}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#2a2a3e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>
              Record a Trigger
            </Text>
            <Text style={[styles.modalSubtitle, { color: isDark ? '#ccc' : '#666' }]}>
              What triggered you today? Understanding your patterns helps you grow stronger.
            </Text>
            
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: isDark ? '#1a1a2e' : '#f5f5f5',
                color: isDark ? '#fff' : '#000',
                borderColor: isDark ? '#444' : '#ddd'
              }]}
              placeholder="Describe what triggered you..."
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={newTriggerNote}
              onChangeText={setNewTriggerNote}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewTriggerNote('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={addManualTrigger}
              >
                <Text style={styles.saveButtonText}>Save Trigger</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}