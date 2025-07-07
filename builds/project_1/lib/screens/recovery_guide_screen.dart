import 'package:flutter/material.dart';

class RecoveryGuideScreen extends StatelessWidget {
  final String screenType;
  
  RecoveryGuideScreen({required this.screenType});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return SingleChildScrollView(
      padding: EdgeInsets.all(20),
      child: Column(
        children: [
          _buildContent(screenType, theme),
        ],
      ),
    );
  }

  Widget _buildContent(String type, ThemeData theme) {
    switch (type) {
      case 'recovery':
        return _buildRecoveryGuide(theme);
      case 'habits':
        return _buildHabitsSettings(theme);
      case 'triggers':
        return _buildTriggerRecords(theme);
      case 'quotes':
        return _buildQuotes(theme);
      case 'about':
        return _buildAboutUs(theme);
      default:
        return _buildRecoveryGuide(theme);
    }
  }

  Widget _buildRecoveryGuide(ThemeData theme) {
    final guides = [
      {'title': 'Understanding Addiction', 'content': 'Learn about the science behind addiction and how to overcome it.', 'icon': Icons.psychology},
      {'title': 'Building Healthy Habits', 'content': 'Replace negative patterns with positive, life-enhancing activities.', 'icon': Icons.fitness_center},
      {'title': 'Mindfulness & Meditation', 'content': 'Practice mindfulness to gain control over urges and thoughts.', 'icon': Icons.self_improvement},
      {'title': 'Social Support', 'content': 'Connect with others on the same journey for mutual support.', 'icon': Icons.group},
    ];
    
    return Column(
      children: guides.map((guide) => Container(
        margin: EdgeInsets.only(bottom: 15),
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: theme.cardColor,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: Offset(0, 5))],
        ),
        child: Row(
          children: [
            Icon(guide['icon'] as IconData, size: 40, color: Color(0xFF6C63FF)),
            SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(guide['title'] as String, style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Text(guide['content'] as String, style: theme.textTheme.bodyMedium),
                ],
              ),
            ),
          ],
        ),
      )).toList(),
    );
  }

  Widget _buildHabitsSettings(ThemeData theme) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: Offset(0, 5))],
      ),
      child: Column(
        children: [
          Icon(Icons.settings, size: 60, color: Colors.orange),
          SizedBox(height: 20),
          Text('Habit Settings', style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
          SizedBox(height: 15),
          Text('Customize your daily habits and set personal goals. This feature helps you build a routine that supports your recovery journey.', style: theme.textTheme.bodyLarge, textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildTriggerRecords(ThemeData theme) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: Offset(0, 5))],
      ),
      child: Column(
        children: [
          Icon(Icons.warning, size: 60, color: Colors.red),
          SizedBox(height: 20),
          Text('Trigger Records', style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
          SizedBox(height: 15),
          Text('Track and understand your triggers to better manage them. Knowledge is power in your recovery journey.', style: theme.textTheme.bodyLarge, textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildQuotes(ThemeData theme) {
    final quotes = [
      'Indeed, with hardship comes ease. - Quran 94:6',
      'And Allah loves those who purify themselves. - Quran 2:222',
      'So be patient. Indeed, the promise of Allah is truth. - Quran 40:77',
      'Your Lord has not taken leave of you, nor has He detested you. - Quran 93:3',
    ];
    
    return Column(
      children: quotes.map((quote) => Container(
        margin: EdgeInsets.only(bottom: 15),
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: [Color(0xFF6C63FF), Color(0xFF5A52E8)]),
          borderRadius: BorderRadius.circular(15),
        ),
        child: Text(quote, style: TextStyle(color: Colors.white, fontSize: 16, fontStyle: FontStyle.italic), textAlign: TextAlign.center),
      )).toList(),
    );
  }

  Widget _buildAboutUs(ThemeData theme) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: Offset(0, 5))],
      ),
      child: Column(
        children: [
          Icon(Icons.info, size: 60, color: Colors.indigo),
          SizedBox(height: 20),
          Text('About NofapJourney', style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
          SizedBox(height: 15),
          Text('NofapJourney is designed to support your path to freedom and self-improvement. Built with love and dedication to help you achieve your goals.', style: theme.textTheme.bodyLarge, textAlign: TextAlign.center),
          SizedBox(height: 20),
          Text('Version 1.0.0', style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey)),
        ],
      ),
    );
  }
}