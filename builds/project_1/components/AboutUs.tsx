import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Linking } from 'react-native';

interface AboutUsProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

export default function AboutUs({ visible, onClose, isDark }: AboutUsProps) {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
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
              ℹ️ About Us
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.welcomeText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              Welcome to NoFap Journey
            </Text>
            
            <Text style={[styles.bodyText, { color: isDark ? '#ccc' : '#666' }]}>
              — a supportive space built to help you break free from destructive habits and reclaim control over your life. This app isn't just a tracker — it's a companion on your path to mental clarity, discipline, and self-respect.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              🎯 Our Mission is Simple:
            </Text>
            
            <Text style={[styles.bodyText, { color: isDark ? '#ccc' : '#666' }]}>
              To empower every individual fighting addiction to rebuild themselves, one clean day at a time. We believe no one deserves to feel trapped, alone, or powerless. Whether you've relapsed 100 times or you're on Day 1 today, this platform exists to uplift, motivate, and track your progress toward a stronger, healthier you.
            </Text>
            
            <Text style={[styles.bodyText, { color: isDark ? '#ccc' : '#666' }]}>
              Every feature in this app — from the streak counter to daily motivational reminders — was designed to remind you: your future is bigger than your past.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              🙏 Special Thanks
            </Text>
            
            <Text style={[styles.bodyText, { color: isDark ? '#ccc' : '#666' }]}>
              This project is deeply personal to me, Muhammad Usman. Like many, I faced this silent battle myself. During my recovery, I realized the need for a tool and community that truly understands what it means to fight this struggle daily. And so, NoFap Journey was born.
            </Text>
            
            <Text style={[styles.bodyText, { color: isDark ? '#ccc' : '#666' }]}>
              I extend heartfelt gratitude to our brothers who guided and supported me through this dark phase — especially the admin and members of this powerful Facebook group:
            </Text>
            
            <TouchableOpacity 
              style={[styles.linkButton, { backgroundColor: '#1877F2' }]}
              onPress={() => handleLinkPress('https://web.facebook.com/share/g/12Lyx65eSTF/')}
            >
              <Text style={styles.linkText}>👉 Nofap Support Group</Text>
            </TouchableOpacity>
            
            <Text style={[styles.bodyText, { color: isDark ? '#ccc' : '#666' }]}>
              Your kindness and brotherhood made this possible.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              📞 Contact Information
            </Text>
            
            <Text style={[styles.bodyText, { color: isDark ? '#ccc' : '#666' }]}>
              For feedback, questions, or to connect with me directly:
            </Text>
            
            <View style={styles.contactContainer}>
              <View style={[styles.contactItem, { backgroundColor: isDark ? '#333' : '#f8f8f8' }]}>
                <Text style={[styles.contactText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                  📧 Email: usmanrehmaniofficial@gmail.com
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.linkButton, { backgroundColor: '#1877F2' }]}
                onPress={() => handleLinkPress('https://web.facebook.com/profile.php?id=61556582417379')}
              >
                <Text style={styles.linkText}>📘 Facebook: Muhammad Usman</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.closingSection, { borderTopColor: isDark ? '#333' : '#e0e0e0' }]}>
              <Text style={[styles.closingText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                Thank you for joining this journey.
              </Text>
              
              <Text style={[styles.motivationText, { color: isDark ? '#fff' : '#000' }]}>
                Stay committed. Stay clean. Stay unbreakable. 💪
              </Text>
              
              <Text style={[styles.arabicText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                "وَاللَّهُ مَعَ الصَّابِرِينَ"
              </Text>
              <Text style={[styles.translationText, { color: isDark ? '#888' : '#aaa' }]}>
                "And Allah is with the patient"
              </Text>
            </View>
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
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
    textAlign: 'justify',
  },
  linkButton: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactContainer: {
    marginVertical: 10,
  },
  contactItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closingSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  closingText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  arabicText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  translationText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
});