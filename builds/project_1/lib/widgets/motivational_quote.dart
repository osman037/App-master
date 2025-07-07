import 'package:flutter/material.dart';
import 'dart:math';

class MotivationalQuote extends StatefulWidget {
  @override
  _MotivationalQuoteState createState() => _MotivationalQuoteState();
}

class _MotivationalQuoteState extends State<MotivationalQuote>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  int currentQuoteIndex = 0;

  final List<Map<String, String>> quotes = [
    {
      'text': 'And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.',
      'source': 'Quran 65:3'
    },
    {
      'text': 'And it is He who created the heavens and earth in truth. And the day He says, "Be," and it is, His word is the truth.',
      'source': 'Quran 6:73'
    },
    {
      'text': 'And Allah is the best of planners.',
      'source': 'Quran 8:30'
    },
    {
      'text': 'So remember Me; I will remember you.',
      'source': 'Quran 2:152'
    },
    {
      'text': 'And whoever fears Allah - He will make for him a way out.',
      'source': 'Quran 65:2'
    },
    {
      'text': 'Indeed, with hardship comes ease.',
      'source': 'Quran 94:6'
    },
    {
      'text': 'And Allah loves those who purify themselves.',
      'source': 'Quran 2:222'
    },
    {
      'text': 'Your Lord has not taken leave of you, nor has He detested you.',
      'source': 'Quran 93:3'
    },
    {
      'text': 'And it is Allah who sends down rain from heaven, and We produce thereby the vegetation of every kind.',
      'source': 'Quran 6:99'
    },
    {
      'text': 'So be patient. Indeed, the promise of Allah is truth.',
      'source': 'Quran 40:77'
    }
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
    _startQuoteRotation();
  }

  void _startQuoteRotation() {
    Future.delayed(Duration(seconds: 8), () {
      if (mounted) {
        _changeQuote();
      }
    });
  }

  void _changeQuote() {
    _animationController.reverse().then((_) {
      if (mounted) {
        setState(() {
          currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        });
        _animationController.forward();
        _startQuoteRotation();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return AnimatedBuilder(
      animation: _fadeAnimation,
      builder: (context, child) {
        return Opacity(
          opacity: _fadeAnimation.value,
          child: Container(
            margin: EdgeInsets.all(20),
            padding: EdgeInsets.all(25),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isDark 
                  ? [Color(0xFF1A1A2E), Color(0xFF16213E)]
                  : [Color(0xFF6C63FF), Color(0xFF5A52E8)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 15,
                  offset: Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.format_quote,
                      color: Colors.white,
                      size: 28,
                    ),
                    SizedBox(width: 10),
                    Text(
                      'Daily Inspiration',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Text(
                  quotes[currentQuoteIndex]['text']!,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    height: 1.5,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                SizedBox(height: 15),
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    '- ${quotes[currentQuoteIndex]['source']}',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                SizedBox(height: 15),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    quotes.length,
                    (index) => Container(
                      margin: EdgeInsets.symmetric(horizontal: 2),
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: index == currentQuoteIndex 
                          ? Colors.white 
                          : Colors.white38,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
}