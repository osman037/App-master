import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import KegalExercises from './KegalExercises';
import AboutUs from './AboutUs';
import HabitsSettings from './HabitsSettings';
import ProgressCalendar from './ProgressCalendar';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
  onNavigate: (screen: string) => void;
  onHabitsUpdate: () => void;
}

export default function Sidebar({ visible, onClose, isDark, onNavigate, onHabitsUpdate }: SidebarProps) {
  const [showKegal, setShowKegal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleRequestFeature = async () => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: ['usmanrehmaniofficial@gmail.com'],
          subject: 'NoFap Journey - Feature Request',
          body: 'Hi,\n\nI would like to request a new feature for the NoFap Journey app:\n\n[Please describe your feature request here]\n\nThanks!',
        });
      } else {
        alert('Mail composer is not available on this device');
      }
    } catch (error) {
      console.error('Error opening mail composer:', error);
      alert('Error opening mail composer');
    }
    onClose();
  };

  const menuItems = [
    { id: 'recovery-guide', title: 'Recovery Guide', icon: '📚', screen: 'recovery-guide' },
    { id: 'kegal', title: 'Kegal Exercises', icon: '💪', action: () => setShowKegal(true) },
    { id: 'habits', title: 'Habits Settings', icon: '⚡', action: () => setShowHabits(true) },
    { id: 'triggers', title: 'Trigger Records', icon: '📝', screen: 'triggers' },
    { id: 'recovery-quotes', title: 'Recovery Quotes', icon: '📖', screen: 'recovery-quotes' },
    { id: 'calendar', title: 'Progress Calendar', icon: '📅', action: () => setShowCalendar(true) },
    { id: 'coach', title: 'AI Coach', icon: '🤖', screen: 'coach' },
    { id: 'request', title: 'Request Feature', icon: '💡', action: handleRequestFeature },
    { id: 'about', title: 'About Us', icon: 'ℹ️', action: () => setShowAbout(true) },
  ];

  const handleItemPress = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.screen) {
      onNavigate(item.screen);
      onClose();
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.overlayTouch} 
            onPress={onClose}
            activeOpacity={1}
          />
          <View style={[styles.sidebar, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
                NoFap Journey
              </Text>
              <Text style={styles.headerSubtitle}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, { borderBottomColor: isDark ? '#333' : '#e0e0e0' }]}
                  onPress={() => handleItemPress(item)}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={[styles.menuText, { color: isDark ? '#fff' : '#000' }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuArrow, { color: isDark ? '#666' : '#999' }]}>›</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: isDark ? '#666' : '#999' }]}>
                "وَمَن جَاهَدَ فَإِنَّمَا يُجَاهِدُ لِنَفْسِهِ"
              </Text>
              <Text style={[styles.footerTranslation, { color: isDark ? '#888' : '#aaa' }]}>
                "And whoever strives, strives only for himself"
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      
      <KegalExercises 
        visible={showKegal} 
        onClose={() => setShowKegal(false)} 
        isDark={isDark} 
      />
      
      <AboutUs 
        visible={showAbout} 
        onClose={() => setShowAbout(false)} 
        isDark={isDark} 
      />
      
      <HabitsSettings 
        visible={showHabits} 
        onClose={() => setShowHabits(false)} 
        isDark={isDark}
        onHabitsUpdate={onHabitsUpdate}
      />
      
      <ProgressCalendar 
        visible={showCalendar} 
        onClose={() => setShowCalendar(false)} 
        isDark={isDark} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayTouch: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 280,
    height: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#4CAF50',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  footerTranslation: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});