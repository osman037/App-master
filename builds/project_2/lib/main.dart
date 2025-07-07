import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/home_screen.dart';
import 'utils/theme.dart';

void main() {
  runApp(NofapJourneyApp());
}

class NofapJourneyApp extends StatefulWidget {
  @override
  _NofapJourneyAppState createState() => _NofapJourneyAppState();
}

class _NofapJourneyAppState extends State<NofapJourneyApp> {
  bool _isDarkMode = false;

  @override
  void initState() {
    super.initState();
    _loadTheme();
    _updateThemeBasedOnTime();
  }

  _loadTheme() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _isDarkMode = prefs.getBool('isDarkMode') ?? false;
    });
  }

  _updateThemeBasedOnTime() {
    final hour = DateTime.now().hour;
    final shouldBeDark = hour < 6 || hour >= 18;
    if (shouldBeDark != _isDarkMode) {
      setState(() {
        _isDarkMode = shouldBeDark;
      });
      _saveTheme();
    }
  }

  _saveTheme() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setBool('isDarkMode', _isDarkMode);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NofapJourney',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: HomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}