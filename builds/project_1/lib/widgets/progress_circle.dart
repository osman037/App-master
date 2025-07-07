import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:math' as math;

class ProgressCircle extends StatefulWidget {
  @override
  _ProgressCircleState createState() => _ProgressCircleState();
}

class _ProgressCircleState extends State<ProgressCircle>
    with TickerProviderStateMixin {
  int daysPassed = 0;
  late AnimationController _animationController;
  late Animation<double> _animation;

  final List<Map<String, dynamic>> milestones = [
    {'days': 1, 'title': 'First Day', 'reward': '🌟', 'color': Colors.green},
    {'days': 7, 'title': '1 Week', 'reward': '🔥', 'color': Colors.orange},
    {'days': 30, 'title': '1 Month', 'reward': '💪', 'color': Colors.blue},
    {'days': 90, 'title': '3 Months', 'reward': '🏆', 'color': Colors.purple},
    {'days': 365, 'title': '1 Year', 'reward': '👑', 'color': Colors.amber},
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _loadProgress();
  }

  _loadProgress() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? startTime = prefs.getString('challengeStartTime');
    if (startTime != null) {
      DateTime start = DateTime.parse(startTime);
      setState(() {
        daysPassed = DateTime.now().difference(start).inDays;
      });
      _animationController.forward();
    }
  }

  Color _getProgressColor() {
    if (daysPassed >= 365) return Colors.amber;
    if (daysPassed >= 90) return Colors.purple;
    if (daysPassed >= 30) return Colors.blue;
    if (daysPassed >= 7) return Colors.orange;
    return Colors.green;
  }

  String _getCurrentMilestone() {
    for (int i = milestones.length - 1; i >= 0; i--) {
      if (daysPassed >= milestones[i]['days']) {
        return milestones[i]['reward'];
      }
    }
    return '🌱';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
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
        children: [
          Text(
            'Progress Tracker',
            style: theme.textTheme.headlineMedium?.copyWith(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 30),
          AnimatedBuilder(
            animation: _animation,
            builder: (context, child) {
              return Container(
                width: 200,
                height: 200,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CustomPaint(
                      size: Size(200, 200),
                      painter: ProgressPainter(
                        progress: _animation.value,
                        color: _getProgressColor(),
                        backgroundColor: isDark ? Colors.grey[800]! : Colors.grey[300]!,
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          _getCurrentMilestone(),
                          style: TextStyle(fontSize: 40),
                        ),
                        Text(
                          '$daysPassed',
                          style: theme.textTheme.headlineLarge?.copyWith(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: _getProgressColor(),
                          ),
                        ),
                        Text(
                          daysPassed == 1 ? 'Day' : 'Days',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
          SizedBox(height: 20),
          Text(
            'Keep going! Every day counts! 💪',
            style: theme.textTheme.bodyLarge?.copyWith(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: _getProgressColor(),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
}

class ProgressPainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color backgroundColor;

  ProgressPainter({
    required this.progress,
    required this.color,
    required this.backgroundColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 10;

    // Background circle
    final backgroundPaint = Paint()
      ..color = backgroundColor
      ..strokeWidth = 12
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, backgroundPaint);

    // Progress arc
    final progressPaint = Paint()
      ..color = color
      ..strokeWidth = 12
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final sweepAngle = 2 * math.pi * progress;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}