import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class HabitsTracker extends StatefulWidget {
  @override
  _HabitsTrackerState createState() => _HabitsTrackerState();
}

class _HabitsTrackerState extends State<HabitsTracker> {
  Map<String, bool> todayHabits = {};
  Map<String, int> habitStreaks = {};
  
  final List<Map<String, dynamic>> habits = [
    {
      'id': 'prayer',
      'name': '5 Daily Prayers',
      'icon': Icons.mosque,
      'color': Colors.green,
      'motivation': 'Connect with Allah 🤲'
    },
    {
      'id': 'exercise',
      'name': 'Physical Exercise',
      'icon': Icons.fitness_center,
      'color': Colors.orange,
      'motivation': 'Strong body, strong mind 💪'
    },
    {
      'id': 'reading',
      'name': 'Read Quran/Books',
      'icon': Icons.menu_book,
      'color': Colors.blue,
      'motivation': 'Knowledge is power 📚'
    },
    {
      'id': 'meditation',
      'name': 'Meditation/Dhikr',
      'icon': Icons.self_improvement,
      'color': Colors.purple,
      'motivation': 'Inner peace & clarity 🧘'
    },
    {
      'id': 'coldshower',
      'name': 'Cold Shower',
      'icon': Icons.shower,
      'color': Colors.cyan,
      'motivation': 'Build discipline 🚿'
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadHabits();
  }

  _loadHabits() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String today = DateTime.now().toIso8601String().split('T')[0];
    
    // Load today's habits
    String? todayData = prefs.getString('habits_$today');
    if (todayData != null) {
      setState(() {
        todayHabits = Map<String, bool>.from(json.decode(todayData));
      });
    } else {
      // Initialize with false for all habits
      for (var habit in habits) {
        todayHabits[habit['id']] = false;
      }
    }
    
    // Load streaks
    String? streaksData = prefs.getString('habit_streaks');
    if (streaksData != null) {
      setState(() {
        habitStreaks = Map<String, int>.from(json.decode(streaksData));
      });
    } else {
      for (var habit in habits) {
        habitStreaks[habit['id']] = 0;
      }
    }
  }

  _saveHabits() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String today = DateTime.now().toIso8601String().split('T')[0];
    
    await prefs.setString('habits_$today', json.encode(todayHabits));
    await prefs.setString('habit_streaks', json.encode(habitStreaks));
  }

  _toggleHabit(String habitId) {
    setState(() {
      todayHabits[habitId] = !todayHabits[habitId]!;
      
      if (todayHabits[habitId]!) {
        habitStreaks[habitId] = (habitStreaks[habitId] ?? 0) + 1;
      } else {
        habitStreaks[habitId] = 0;
      }
    });
    _saveHabits();
  }

  double _getCompletionPercentage() {
    int completed = todayHabits.values.where((v) => v).length;
    return (completed / habits.length) * 100;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    double completionPercentage = _getCompletionPercentage();
    
    return Container(
      margin: EdgeInsets.all(20),
      padding: EdgeInsets.all(25),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Power Habits',
                style: theme.textTheme.headlineMedium?.copyWith(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: completionPercentage >= 80 
                    ? Colors.green.withOpacity(0.2)
                    : Colors.orange.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Text(
                  '${completionPercentage.toInt()}%',
                  style: TextStyle(
                    color: completionPercentage >= 80 ? Colors.green : Colors.orange,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 20),
          ...habits.map((habit) {
            bool isCompleted = todayHabits[habit['id']] ?? false;
            int streak = habitStreaks[habit['id']] ?? 0;
            
            return Container(
              margin: EdgeInsets.only(bottom: 15),
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isCompleted 
                  ? habit['color'].withOpacity(0.1)
                  : (isDark ? Colors.grey[800] : Colors.grey[100]),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isCompleted 
                    ? habit['color']
                    : Colors.transparent,
                  width: 2,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: habit['color'].withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      habit['icon'],
                      color: habit['color'],
                      size: 24,
                    ),
                  ),
                  SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          habit['name'],
                          style: theme.textTheme.bodyLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                            decoration: isCompleted 
                              ? TextDecoration.lineThrough 
                              : null,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          habit['motivation'],
                          style: theme.textTheme.bodyMedium?.copyWith(
                            fontSize: 12,
                            color: habit['color'],
                          ),
                        ),
                        if (streak > 0)
                          Text(
                            '🔥 $streak day streak',
                            style: TextStyle(
                              color: Colors.orange,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () => _toggleHabit(habit['id']),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: isCompleted ? habit['color'] : Colors.transparent,
                        border: Border.all(
                          color: habit['color'],
                          width: 2,
                        ),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: isCompleted
                        ? Icon(
                            Icons.check,
                            color: Colors.white,
                            size: 18,
                          )
                        : null,
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
          if (completionPercentage == 100)
            Container(
              margin: EdgeInsets.only(top: 15),
              padding: EdgeInsets.all(15),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.green, Colors.teal],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '🎉 Perfect Day! All habits completed! 🎉',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}