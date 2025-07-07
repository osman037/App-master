import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

interface RecoveryGuideSectionProps {
  isDark: boolean;
}

export default function RecoveryGuideSection({ isDark }: RecoveryGuideSectionProps) {
  const episodes = [
    {
      episode: "Episode 01",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539512831400389/?mibextid=Nif5oz"
    },
    {
      episode: "Episode 02",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539513424733663/?mibextid=Nif5oz"
    },
    {
      episode: "Episode 03",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539515314733474/?mibextid=Nif5oz"
    },
    {
      episode: "Episode 04",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539516278066711/?mibextid=Nif5oz"
    },
    {
      episode: "Episode 05",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539516584733347/?mibextid=Nif5oz"
    },
    {
      episode: "Episode 06",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539516871399985/?mibextid=Nif5oz"
    },
    {
      episode: "Episode 07",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539518534733152/?mibextid=Nif5oz"
    },
    {
      episode: "Episode 08",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539518974733108/?mibextid=Nif5oz"
    },
    {
      episode: "Episode 09",
      url: "https://www.facebook.com/groups/538769621474710/permalink/539519368066402/?mibextid=Nif5oz"
    }
  ];

  const handleEpisodePress = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📚</Text>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>NOFAP Recovery Guide</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>Complete Recovery Series</Text>
      </View>

      <View style={styles.episodesList}>
        {episodes.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.episodeCard, { backgroundColor: isDark ? '#2a2a3e' : '#ffffff' }]}
            onPress={() => handleEpisodePress(item.url)}
            activeOpacity={0.7}
          >
            <View style={styles.episodeContent}>
              <View style={[styles.episodeNumber, { backgroundColor: isDark ? '#4CAF50' : '#2E7D32' }]}>
                <Text style={styles.episodeNumberText}>{String(index + 1).padStart(2, '0')}</Text>
              </View>
              <View style={styles.episodeInfo}>
                <Text style={[styles.episodeTitle, { color: isDark ? '#fff' : '#000' }]}>{item.episode}</Text>
                <Text style={[styles.episodeDescription, { color: isDark ? '#ccc' : '#666' }]}>Recovery Guide Series</Text>
              </View>
              <View style={styles.playIcon}>
                <Text style={styles.playIconText}>▶️</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: isDark ? '#1a1a2e' : '#f8f8f8' }]}>
        <Text style={styles.infoEmoji}>💡</Text>
        <Text style={[styles.infoTitle, { color: isDark ? '#fff' : '#000' }]}>How to Use This Guide</Text>
        <Text style={[styles.infoText, { color: isDark ? '#ccc' : '#666' }]}>
          Each episode contains valuable insights and strategies for your recovery journey. 
          Tap on any episode to open it in your browser and start learning.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  headerEmoji: { fontSize: 50, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center' },
  episodesList: { marginBottom: 20 },
  episodeCard: {
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  episodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  episodeNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  episodeNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  episodeDescription: {
    fontSize: 14,
  },
  playIcon: {
    marginLeft: 10,
  },
  playIconText: {
    fontSize: 20,
  },
  infoCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  infoEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});