import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StartChallengeModal from '../components/StartChallengeModal';
import ProgressCircle from '../components/ProgressCircle';
import RelapseButton from '../components/RelapseButton';
import MotivationalQuote from '../components/MotivationalQuote';
import HabitsTracker from '../components/HabitsTracker';
import Sidebar from '../components/Sidebar';
import TriggerRecorder from '../components/TriggerRecorder';
import RecoveryGuide from '../components/RecoveryGuide';
import RecoveryGuideSection from '../components/RecoveryGuideSection';

export default function HomeScreen() {
  const [showStartModal, setShowStartModal] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [hasStartedChallenge, setHasStartedChallenge] = useState(false);
  const [habitsUpdateTrigger, setHabitsUpdateTrigger] = useState(0);

  useEffect(() => {
    checkFirstTime();
    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasStarted = await AsyncStorage.getItem('hasStartedChallenge');
      if (!hasStarted) {
        setShowStartModal(true);
      } else {
        setHasStartedChallenge(true);
      }
    } catch (error) {
      console.error('Error checking first time:', error);
    }
  };

  const updateTheme = () => {
    const hour = new Date().getHours();
    setIsDark(hour < 6 || hour >= 18);
  };

  const handleStartChallenge = async () => {
    try {
      await AsyncStorage.setItem('hasStartedChallenge', 'true');
      await AsyncStorage.setItem('challengeStartTime', new Date().toISOString());
      setShowStartModal(false);
      setHasStartedChallenge(true);
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };

  const handleRelapse = async () => {
    try {
      await AsyncStorage.removeItem('hasStartedChallenge');
      await AsyncStorage.removeItem('challengeStartTime');
      setHasStartedChallenge(false);
      setShowStartModal(true);
    } catch (error) {
      console.error('Error handling relapse:', error);
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleHabitsUpdate = () => {
    setHabitsUpdateTrigger(prev => prev + 1);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'triggers':
        return <TriggerRecorder isDark={isDark} />;
      case 'recovery-quotes':
        return <RecoveryGuide isDark={isDark} />;
      case 'recovery-guide':
        return <RecoveryGuideSection isDark={isDark} />;
      case 'coach':
        return (
          <View style={[styles.comingSoonContainer, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
            <Text style={styles.comingSoonEmoji}>🤖</Text>
            <Text style={[styles.comingSoonTitle, { color: isDark ? '#fff' : '#000' }]}>AI Coach</Text>
            <Text style={[styles.comingSoonText, { color: isDark ? '#ccc' : '#666' }]}>
              This feature is coming soon!
            </Text>
            <Text style={[styles.comingSoonDescription, { color: isDark ? '#888' : '#999' }]}>
              Get personalized guidance and support from our AI-powered recovery coach.
            </Text>
          </View>
        );
      case 'home':
      default:
        return (
          <ScrollView 
            style={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <MotivationalQuote isDark={isDark} />
            
            {hasStartedChallenge && (
              <>
                <ProgressCircle isDark={isDark} />
                <RelapseButton isDark={isDark} onRelapse={handleRelapse} />
              </>
            )}
            
            <HabitsTracker isDark={isDark} key={habitsUpdateTrigger} />
          </ScrollView>
        );
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'triggers': return 'Trigger Records';
      case 'recovery-quotes': return 'Recovery Quotes';
      case 'recovery-guide': return 'Recovery Guide';
      case 'coach': return 'AI Coach';
      default: return 'NofapJourney';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f0f23' : '#f5f5f5' }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? '#0f0f23' : '#f5f5f5'}
      />
      
      <View style={[styles.header, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <View style={[styles.menuLine, { backgroundColor: isDark ? '#fff' : '#000' }]} />
          <View style={[styles.menuLine, { backgroundColor: isDark ? '#fff' : '#000' }]} />
          <View style={[styles.menuLine, { backgroundColor: isDark ? '#fff' : '#000' }]} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          {getScreenTitle()}
        </Text>
        
        {currentScreen !== 'home' && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={[styles.backButtonText, { color: isDark ? '#fff' : '#000' }]}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>

      <Sidebar 
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        isDark={isDark}
        onNavigate={handleNavigate}
        onHabitsUpdate={handleHabitsUpdate}
      />

      <StartChallengeModal 
        visible={showStartModal}
        onStartChallenge={handleStartChallenge}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuButton: { width: 30, height: 20, justifyContent: 'space-between', marginRight: 15 },
  menuLine: { height: 3, borderRadius: 2 },
  headerTitle: { fontSize: 22, fontWeight: '700', flex: 1, letterSpacing: 0.5 },
  backButton: { padding: 10 },
  backButtonText: { fontSize: 24, fontWeight: 'bold' },
  content: { flex: 1 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    margin: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  comingSoonEmoji: { fontSize: 60, marginBottom: 20 },
  comingSoonTitle: { fontSize: 26, fontWeight: '700', marginBottom: 15 },
  comingSoonText: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  comingSoonDescription: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});