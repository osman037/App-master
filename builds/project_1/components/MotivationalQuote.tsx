import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MotivationalQuoteProps {
  isDark: boolean;
}

const islamicQuotes = [
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    english: "And whoever fears Allah, He will make for him a way out",
    reference: "Quran 65:2"
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "Indeed, with hardship comes ease",
    reference: "Quran 94:6"
  },
  {
    arabic: "وَاللَّهُ يُحِبُّ الصَّابِرِينَ",
    english: "And Allah loves the patient",
    reference: "Quran 3:146"
  },
  {
    arabic: "وَمَن جَاهَدَ فَإِنَّمَا يُجَاهِدُ لِنَفْسِهِ",
    english: "And whoever strives, strives only for himself",
    reference: "Quran 29:6"
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    english: "Indeed, Allah will not change the condition of a people until they change what is in themselves",
    reference: "Quran 13:11"
  },
  {
    arabic: "وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ",
    english: "And those who guard their private parts",
    reference: "Quran 23:5"
  },
  {
    arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
    english: "Indeed, Allah loves those who repent and those who purify themselves",
    reference: "Quran 2:222"
  },
  {
    arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    english: "And seek help through patience and prayer",
    reference: "Quran 2:45"
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "For indeed, with hardship will be ease",
    reference: "Quran 94:5"
  },
  {
    arabic: "وَمَن يَصْبِرْ وَيَغْفِرْ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ",
    english: "But whoever is patient and forgives - indeed, that is of the matters of determination",
    reference: "Quran 42:43"
  },
];

export default function MotivationalQuote({ isDark }: MotivationalQuoteProps) {
  const [currentQuote, setCurrentQuote] = useState(islamicQuotes[0]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadDailyQuote();
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadDailyQuote = async () => {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem('lastQuoteDate');
      const storedIndex = await AsyncStorage.getItem('currentQuoteIndex');
      
      if (storedDate !== today) {
        const newIndex = storedIndex ? (parseInt(storedIndex) + 1) % islamicQuotes.length : 0;
        setQuoteIndex(newIndex);
        setCurrentQuote(islamicQuotes[newIndex]);
        
        await AsyncStorage.setItem('lastQuoteDate', today);
        await AsyncStorage.setItem('currentQuoteIndex', newIndex.toString());
      } else if (storedIndex) {
        const index = parseInt(storedIndex);
        setQuoteIndex(index);
        setCurrentQuote(islamicQuotes[index]);
      }
    } catch (error) {
      console.error('Error loading daily quote:', error);
    }
  };

  const handleNextQuote = async () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const newIndex = (quoteIndex + 1) % islamicQuotes.length;
    setQuoteIndex(newIndex);
    setCurrentQuote(islamicQuotes[newIndex]);
    
    try {
      await AsyncStorage.setItem('currentQuoteIndex', newIndex.toString());
    } catch (error) {
      console.error('Error saving quote index:', error);
    }
  };

  const getGradientColor = () => {
    const colors = [
      isDark ? '#4CAF50' : '#2E7D32',
      isDark ? '#2196F3' : '#1565C0', 
      isDark ? '#9C27B0' : '#6A1B9A',
      isDark ? '#FF9800' : '#E65100',
      isDark ? '#F44336' : '#C62828',
    ];
    return colors[quoteIndex % colors.length];
  };

  return (
    <Animated.View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
        borderColor: getGradientColor(),
        borderWidth: 2,
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🌙</Text>
        <Text style={[styles.headerText, { color: getGradientColor() }]}>Daily Spiritual Boost</Text>
        <Text style={styles.sparkle}>✨</Text>
      </View>
      
      <Animated.View style={[styles.quoteContainer, { opacity: fadeAnim }]}>
        <View style={[styles.arabicContainer, { 
          backgroundColor: `${getGradientColor()}15`,
          borderColor: getGradientColor(),
          borderWidth: 1,
        }]}>
          <Text style={[styles.arabicText, { color: getGradientColor() }]}>{currentQuote.arabic}</Text>
        </View>
        
        <View style={styles.englishContainer}>
          <Text style={[styles.englishText, { color: isDark ? '#e0e0e0' : '#333' }]}>
            "{currentQuote.english}"
          </Text>
        </View>
        
        <View style={[styles.referenceContainer, {
          backgroundColor: getGradientColor(),
        }]}>
          <Text style={styles.reference}>📖 {currentQuote.reference}</Text>
        </View>
      </Animated.View>
      
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.nextButton, {
            backgroundColor: getGradientColor(),
            shadowColor: getGradientColor(),
          }]}
          onPress={handleNextQuote}
        >
          <Text style={styles.nextButtonText}>🔄 Next Inspiration</Text>
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { 
                width: `${((quoteIndex + 1) / islamicQuotes.length) * 100}%`,
                backgroundColor: getGradientColor(),
              }
            ]} />
          </View>
          <Text style={[styles.indicatorText, { color: getGradientColor() }]}>
            {quoteIndex + 1} of {islamicQuotes.length}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 25,
    padding: 25,
    elevation: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sparkle: {
    fontSize: 20,
    marginLeft: 8,
  },
  quoteContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  arabicContainer: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    width: '100%',
  },
  arabicText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 35,
  },
  englishContainer: {
    marginBottom: 15,
  },
  englishText: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 26,
  },
  referenceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  reference: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
  bottomSection: {
    alignItems: 'center',
  },
  nextButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  indicatorText: {
    fontSize: 13,
    fontWeight: '600',
  },
});