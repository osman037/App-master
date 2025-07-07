import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface RecoveryGuideProps {
  isDark: boolean;
}

export default function RecoveryGuide({ isDark }: RecoveryGuideProps) {
  const quotes = [
    {
      text: "اللہ سے ڈرو اور جان لو کہ اللہ تمہارے ساتھ ہے",
      english: "Fear Allah and know that Allah is with you",
      reference: "Quran 2:194"
    },
    {
      text: "جو شخص توبہ کرے اور نیک عمل کرے تو اللہ اس کی برائیوں کو نیکیوں سے بدل دیتا ہے",
      english: "Whoever repents and does good deeds, Allah will change their evil deeds into good ones",
      reference: "Quran 25:70"
    },
    {
      text: "اور جو اللہ سے ڈرے، اللہ اس کے لیے نکلنے کا راستہ بنا دیتا ہے",
      english: "And whoever fears Allah, He will make for him a way out",
      reference: "Quran 65:2"
    },
    {
      text: "اللہ کے ذکر سے دل اطمینان پاتے ہیں",
      english: "In the remembrance of Allah do hearts find rest",
      reference: "Quran 13:28"
    },
    {
      text: "اور جو صبر کرے اور معاف کر دے تو یہ بہت ہمت کا کام ہے",
      english: "And whoever is patient and forgives, indeed that is of the matters of determination",
      reference: "Quran 42:43"
    },
    {
      text: "نماز بے حیائی اور برائی سے روکتی ہے",
      english: "Prayer prevents immorality and wrongdoing",
      reference: "Quran 29:45"
    },
    {
      text: "اور جو اللہ پر بھروسہ کرے تو وہ اس کے لیے کافی ہے",
      english: "And whoever relies upon Allah, then He is sufficient for him",
      reference: "Quran 65:3"
    },
    {
      text: "اللہ توبہ کرنے والوں سے محبت کرتا ہے",
      english: "Allah loves those who repent",
      reference: "Quran 2:222"
    },
    {
      text: "اور انسان کے لیے وہی کچھ ہے جس کی وہ کوشش کرے",
      english: "And that there is nothing for man except what he strives for",
      reference: "Quran 53:39"
    },
    {
      text: "جو شخص اللہ کی راہ میں جہاد کرے تو وہ اپنے لیے جہاد کرتا ہے",
      english: "Whoever strives, strives only for himself",
      reference: "Quran 29:6"
    }
  ];

  const motivationalQuotes = [
    "Your past does not define your future. Every moment is a chance to begin again.",
    "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.",
    "The struggle you're in today is developing the strength you need for tomorrow.",
    "Recovery is not a destination, it's a daily choice to live better.",
    "You are stronger than your urges. You are bigger than your addiction.",
    "Every clean day is a victory. Celebrate your progress, no matter how small.",
    "Your future self is counting on the decisions you make today.",
    "Healing begins when you choose to face your struggles with courage."
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📖</Text>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Recovery Quotes</Text>
        <Text style={[styles.titleUrdu, { color: isDark ? '#fff' : '#000' }]}>بحالی کے اقوال</Text>
      </View>

      <View style={[styles.motivationCard, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
        <Text style={styles.motivationVerse}>"وَمَن تَابَ وَعَمِلَ صَالِحًا فَإِنَّهُ يَتُوبُ إِلَى اللَّهِ مَتَابًا"</Text>
        <Text style={[styles.motivationTranslation, { color: isDark ? '#ccc' : '#666' }]}>"And whoever repents and does righteous deeds"</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>Islamic Quotes - اسلامی اقوال</Text>
      
      {quotes.map((quote, index) => (
        <View key={index} style={[styles.quoteCard, { backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8' }]}>
          <Text style={[styles.quoteTextUrdu, { color: isDark ? '#fff' : '#000' }]}>{quote.text}</Text>
          <Text style={[styles.quoteTextEnglish, { color: isDark ? '#ccc' : '#555' }]}>{quote.english}</Text>
          <Text style={styles.quoteReference}>{quote.reference}</Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>Motivational Quotes</Text>
      
      {motivationalQuotes.map((quote, index) => (
        <View key={index} style={[styles.motivationalCard, { backgroundColor: isDark ? '#2a2a3e' : '#f8f8f8' }]}>
          <Text style={styles.quoteIcon}>💪</Text>
          <Text style={[styles.motivationalText, { color: isDark ? '#fff' : '#000' }]}>{quote}</Text>
        </View>
      ))}

      <View style={[styles.finalMessage, { backgroundColor: isDark ? '#1a1a2e' : '#ffffff' }]}>
        <Text style={styles.finalEmoji}>🤲</Text>
        <Text style={[styles.finalTitle, { color: isDark ? '#fff' : '#000' }]}>یاد رکھیں - Remember</Text>
        <Text style={[styles.finalText, { color: isDark ? '#ccc' : '#666' }]}>اللہ آپ سے آپ کی کمزوری کی وجہ سے محبت کم نہیں کرتا۔</Text>
        <Text style={[styles.finalTextEnglish, { color: isDark ? '#ccc' : '#666' }]}>Allah doesn't love you any less because of your weakness.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  headerEmoji: { fontSize: 40, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  titleUrdu: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  motivationCard: { borderRadius: 15, padding: 20, marginBottom: 20, alignItems: 'center', elevation: 3 },
  motivationVerse: { fontSize: 18, color: '#4CAF50', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  motivationTranslation: { fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
  quoteCard: { borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  quoteTextUrdu: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right', lineHeight: 24 },
  quoteTextEnglish: { fontSize: 14, marginBottom: 8, lineHeight: 20, fontStyle: 'italic' },
  quoteReference: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold', textAlign: 'center' },
  motivationalCard: { borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  quoteIcon: { fontSize: 24, marginRight: 15 },
  motivationalText: { fontSize: 14, lineHeight: 20, flex: 1, fontWeight: '500' },
  finalMessage: { borderRadius: 15, padding: 20, marginBottom: 30, alignItems: 'center', elevation: 3 },
  finalEmoji: { fontSize: 30, marginBottom: 10 },
  finalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  finalText: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 5 },
  finalTextEnglish: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' }
});