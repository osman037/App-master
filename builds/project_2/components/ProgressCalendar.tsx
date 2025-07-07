import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressCalendarProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface DayProgress {
  date: string;
  day: number;
  habits: { [key: string]: boolean };
  relapsed: boolean;
}

const { width } = Dimensions.get('window');

export default function ProgressCalendar({ visible, onClose, isDark }: ProgressCalendarProps) {
  const [progressData, setProgressData] = useState<DayProgress[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [stats, setStats] = useState({ totalDays: 0, cleanDays: 0, relapses: 0, bestStreak: 0 });

  useEffect(() => {
    if (visible) {
      loadProgressData();
    }
  }, [visible]);

  const loadProgressData = async () => {
    try {
      const stored = await AsyncStorage.getItem('progressData');
      if (stored) {
        const data = JSON.parse(stored);
        setProgressData(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const calculateStats = (data: DayProgress[]) => {
    const totalDays = data.length;
    const cleanDays = data.filter(d => !d.relapsed).length;
    const relapses = data.filter(d => d.relapsed).length;
    
    let bestStreak = 0;
    let currentStreak = 0;
    
    data.forEach(day => {
      if (!day.relapsed) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    setStats({ totalDays, cleanDays, relapses, bestStreak });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = progressData.find(d => d.date === dateStr);
      days.push({ day, date: dateStr, data: dayData });
    }
    
    return days;
  };

  const getDayColor = (dayData: any) => {
    if (!dayData?.data) return isDark ? '#333' : '#f0f0f0';
    if (dayData.data.relapsed) return '#F44336';
    return '#4CAF50';
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentMonth);

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
              Progress Calendar
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Stats Section */}
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
                <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.totalDays}</Text>
                <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Total Days</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
                <Text style={[styles.statNumber, { color: '#2196F3' }]}>{stats.cleanDays}</Text>
                <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Clean Days</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
                <Text style={[styles.statNumber, { color: '#FF9800' }]}>{stats.bestStreak}</Text>
                <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Best Streak</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
                <Text style={[styles.statNumber, { color: '#F44336' }]}>{stats.relapses}</Text>
                <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Relapses</Text>
              </View>
            </View>
            
            {/* Calendar Navigation */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity 
                style={[styles.navButton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}
                onPress={() => navigateMonth(-1)}
              >
                <Text style={[styles.navButtonText, { color: isDark ? '#fff' : '#000' }]}>‹</Text>
              </TouchableOpacity>
              
              <Text style={[styles.monthTitle, { color: isDark ? '#fff' : '#000' }]}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              
              <TouchableOpacity 
                style={[styles.navButton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}
                onPress={() => navigateMonth(1)}
              >
                <Text style={[styles.navButtonText, { color: isDark ? '#fff' : '#000' }]}>›</Text>
              </TouchableOpacity>
            </View>
            
            {/* Week Days Header */}
            <View style={styles.weekHeader}>
              {weekDays.map(day => (
                <Text key={day} style={[styles.weekDay, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                  {day}
                </Text>
              ))}
            </View>
            
            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {days.map((day, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dayCell,
                    { backgroundColor: day ? getDayColor(day) : 'transparent' }
                  ]}
                >
                  {day && (
                    <Text style={[styles.dayText, { color: day.data ? '#fff' : (isDark ? '#ccc' : '#666') }]}>
                      {day.day}
                    </Text>
                  )}
                </View>
              ))}
            </View>
            
            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.legendText, { color: isDark ? '#ccc' : '#666' }]}>Clean Day</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
                <Text style={[styles.legendText, { color: isDark ? '#ccc' : '#666' }]}>Relapse</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]} />
                <Text style={[styles.legendText, { color: isDark ? '#ccc' : '#666' }]}>No Data</Text>
              </View>
            </View>
            
            <Text style={[styles.motivationText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
              "Every day is a new opportunity to grow stronger. Your progress tells your story of resilience."
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
    width: '95%',
    maxHeight: '90%',
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
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    fontSize: 14,
    fontWeight: 'bold',
    width: width * 0.12,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  motivationText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
});