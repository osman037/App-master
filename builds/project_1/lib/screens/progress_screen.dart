import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fl_chart/fl_chart.dart';

class ProgressScreen extends StatefulWidget {
  @override
  _ProgressScreenState createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  int daysPassed = 0;
  int longestStreak = 0;
  int totalResets = 0;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  _loadStats() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? startTime = prefs.getString('challengeStartTime');
    
    setState(() {
      if (startTime != null) {
        daysPassed = DateTime.now().difference(DateTime.parse(startTime)).inDays;
      }
      longestStreak = prefs.getInt('longestStreak') ?? 0;
      totalResets = prefs.getInt('totalResets') ?? 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return SingleChildScrollView(
      padding: EdgeInsets.all(20),
      child: Column(
        children: [
          _buildStatsCard('Current Streak', '$daysPassed days', Icons.local_fire_department, Colors.orange, theme),
          SizedBox(height: 15),
          _buildStatsCard('Longest Streak', '$longestStreak days', Icons.emoji_events, Colors.gold, theme),
          SizedBox(height: 15),
          _buildStatsCard('Total Resets', '$totalResets', Icons.refresh, Colors.blue, theme),
          SizedBox(height: 20),
          _buildProgressChart(theme),
        ],
      ),
    );
  }

  Widget _buildStatsCard(String title, String value, IconData icon, Color color, ThemeData theme) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 30),
          ),
          SizedBox(width: 20),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: theme.textTheme.bodyMedium),
              Text(value, style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProgressChart(ThemeData theme) {
    return Container(
      height: 300,
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          Text('Weekly Progress', style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
          SizedBox(height: 20),
          Expanded(
            child: LineChart(
              LineChartData(
                gridData: FlGridData(show: false),
                titlesData: FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: List.generate(7, (index) => FlSpot(index.toDouble(), (index * 2).toDouble())),
                    isCurved: true,
                    color: Color(0xFF6C63FF),
                    barWidth: 3,
                    dotData: FlDotData(show: true),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}