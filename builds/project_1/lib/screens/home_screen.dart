import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/progress_circle.dart';
import '../widgets/motivational_quote.dart';
import '../widgets/habits_tracker.dart';
import '../widgets/relapse_button.dart';
import '../widgets/sidebar_drawer.dart';
import 'progress_screen.dart';
import 'recovery_guide_screen.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _hasStartedChallenge = false;
  bool _showStartModal = false;
  String _currentScreen = 'home';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _checkFirstTime();
  }

  _checkFirstTime() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool hasStarted = prefs.getBool('hasStartedChallenge') ?? false;
    
    if (!hasStarted) {
      setState(() {
        _showStartModal = true;
      });
    } else {
      setState(() {
        _hasStartedChallenge = true;
      });
    }
  }

  _startChallenge() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool('hasStartedChallenge', true);
    await prefs.setString('challengeStartTime', DateTime.now().toIso8601String());
    
    setState(() {
      _showStartModal = false;
      _hasStartedChallenge = true;
    });
  }

  _handleRelapse() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('hasStartedChallenge');
    await prefs.remove('challengeStartTime');
    
    setState(() {
      _hasStartedChallenge = false;
      _showStartModal = true;
    });
  }

  _handleNavigation(String screenId) {
    setState(() {
      _currentScreen = screenId;
    });
  }

  String _getScreenTitle() {
    switch (_currentScreen) {
      case 'progress': return 'Progress & Stats';
      case 'recovery': return 'Recovery Guide';
      case 'habits': return 'Habit Settings';
      case 'triggers': return 'Trigger Records';
      case 'quotes': return 'Motivational Quotes';
      case 'about': return 'About Us';
      default: return 'NofapJourney';
    }
  }

  Widget _buildCurrentScreen() {
    switch (_currentScreen) {
      case 'progress':
        return ProgressScreen();
      case 'recovery':
      case 'habits':
      case 'triggers':
      case 'quotes':
      case 'about':
        return RecoveryGuideScreen(screenType: _currentScreen);
      default:
        return _buildHomeContent();
    }
  }

  Widget _buildHomeContent() {
    return SingleChildScrollView(
      padding: EdgeInsets.only(bottom: 20),
      child: Column(
        children: [
          MotivationalQuote(),
          if (_hasStartedChallenge) ..[
            ProgressCircle(),
            RelapseButton(onRelapse: _handleRelapse),
          ],
          HabitsTracker(),
        ],
      ),
    );
  }

  Widget _buildStartChallengeModal() {
    final theme = Theme.of(context);
    
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        margin: EdgeInsets.all(20),
        padding: EdgeInsets.all(30),
        decoration: BoxDecoration(
          color: theme.cardColor,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 20,
              offset: Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF6C63FF), Color(0xFF5A52E8)],
                ),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.self_improvement,
                size: 40,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Welcome to NofapJourney!',
              style: theme.textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 24,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 15),
            Text(
              'Start your journey to freedom and self-improvement. Track your progress, build healthy habits, and stay motivated.',
              style: theme.textTheme.bodyLarge?.copyWith(
                fontSize: 16,
                height: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 25),
            Container(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _startChallenge,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF6C63FF),
                  padding: EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 3,
                ),
                child: Text(
                  'Start My Journey 🚀',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          _getScreenTitle(),
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.menu),
          onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        ),
        actions: [
          if (_currentScreen != 'home')
            IconButton(
              icon: Icon(Icons.home),
              onPressed: () => _handleNavigation('home'),
            ),
        ],
        elevation: 2,
      ),
      drawer: SidebarDrawer(
        onNavigate: _handleNavigation,
        onClose: () => Navigator.of(context).pop(),
      ),
      body: Stack(
        children: [
          _buildCurrentScreen(),
          if (_showStartModal) _buildStartChallengeModal(),
        ],
      ),
    );
  }
}