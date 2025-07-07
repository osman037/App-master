import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RelapseButtonProps {
  isDark: boolean;
  onRelapse: () => void;
}

export default function RelapseButton({ isDark, onRelapse }: RelapseButtonProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [triggerNote, setTriggerNote] = useState('');

  const handleRelapsePress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmRelapse = () => {
    setShowConfirmModal(false);
    setShowTriggerModal(true);
  };

  const handleSaveTriggerAndReset = async () => {
    try {
      // Save trigger record if provided
      if (triggerNote.trim()) {
        const existingTriggers = await AsyncStorage.getItem('triggerRecords');
        const triggers = existingTriggers ? JSON.parse(existingTriggers) : [];
        const newTrigger = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          reason: triggerNote.trim(),
          timestamp: new Date().toLocaleString(),
          type: 'relapse'
        };
        triggers.push(newTrigger);
        await AsyncStorage.setItem('triggerRecords', JSON.stringify(triggers));
      }
      
      // Reset challenge progress
      await AsyncStorage.removeItem('hasStartedChallenge');
      await AsyncStorage.removeItem('challengeStartTime');
      
      // Save relapse data for tracking
      const existingRelapses = await AsyncStorage.getItem('relapseHistory');
      const relapses = existingRelapses ? JSON.parse(existingRelapses) : [];
      const relapseData = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        reason: triggerNote.trim() || 'No reason provided',
        timestamp: new Date().toLocaleString()
      };
      relapses.push(relapseData);
      await AsyncStorage.setItem('relapseHistory', JSON.stringify(relapses));
      
      setShowTriggerModal(false);
      setTriggerNote('');
      onRelapse();
      
      // Show motivational message
      setTimeout(() => {
        Alert.alert(
          '💪 New Beginning',
          'Every setback is a setup for a comeback. You\'re stronger than you think. Let\'s start fresh!',
          [{ text: 'Let\'s Go!', style: 'default' }]
        );
      }, 500);
    } catch (error) {
      console.error('Error handling relapse:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.relapseButton, { backgroundColor: isDark ? '#8B0000' : '#DC143C' }]}
          onPress={handleRelapsePress}
          activeOpacity={0.8}
        >
          <Text style={styles.relapseEmoji}>⚠️</Text>
          <Text style={styles.relapseText}>I Relapsed</Text>
          <Text style={styles.relapseSubtext}>Reset My Progress</Text>
        </TouchableOpacity>
        
        <Text style={[styles.warningText, { color: isDark ? '#ccc' : '#666' }]}>
          Only press if you have broken your challenge
        </Text>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
            <Text style={styles.confirmEmoji}>🤔</Text>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>
              Confirm Relapse
            </Text>
            
            <Text style={[styles.modalSubtitle, { color: isDark ? '#ccc' : '#666' }]}>
              Are you sure you want to reset your progress? This will restart your challenge from day 0.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: isDark ? '#444' : '#f0f0f0' }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: isDark ? '#fff' : '#000' }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmRelapse}
              >
                <Text style={styles.confirmButtonText}>Yes, Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Trigger Recording Modal */}
      <Modal
        visible={showTriggerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTriggerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
            <Text style={styles.triggerEmoji}>📝</Text>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>
              Record Your Trigger
            </Text>
            
            <Text style={[styles.modalSubtitle, { color: isDark ? '#ccc' : '#666' }]}>
              What led to this relapse? Recording triggers helps you identify patterns and avoid them in the future.
            </Text>
            
            <TextInput
              style={[
                styles.triggerInput,
                {
                  backgroundColor: isDark ? '#333' : '#f9f9f9',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#555' : '#ddd'
                }
              ]}
              value={triggerNote}
              onChangeText={setTriggerNote}
              placeholder="e.g., stress, boredom, social media, loneliness..."
              placeholderTextColor={isDark ? '#888' : '#999'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.skipButton, { backgroundColor: isDark ? '#444' : '#f0f0f0' }]}
                onPress={handleSaveTriggerAndReset}
              >
                <Text style={[styles.skipButtonText, { color: isDark ? '#fff' : '#000' }]}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: isDark ? '#4CAF50' : '#2E7D32' }]}
                onPress={handleSaveTriggerAndReset}
              >
                <Text style={styles.saveButtonText}>Save & Reset</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.motivationText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              "The comeback is always stronger than the setback. You've got this! 💪"
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  relapseButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  relapseEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  relapseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  relapseSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  warningText: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 25,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  confirmEmoji: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 15,
  },
  triggerEmoji: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  triggerInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#DC143C',
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {},
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  motivationText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});