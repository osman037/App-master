import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryColor = Color(0xFF6C63FF);
  static const Color secondaryColor = Color(0xFF03DAC6);
  static const Color errorColor = Color(0xFFFF6B6B);
  static const Color successColor = Color(0xFF4ECDC4);
  static const Color warningColor = Color(0xFFFFE66D);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primarySwatch: MaterialColor(0xFF6C63FF, {
      50: Color(0xFFEFEEFF),
      100: Color(0xFFD6D4FF),
      200: Color(0xFFB5B1FF),
      300: Color(0xFF948EFF),
      400: Color(0xFF7B73FF),
      500: Color(0xFF6C63FF),
      600: Color(0xFF5A52E8),
      700: Color(0xFF4A42CC),
      800: Color(0xFF3B34B0),
      900: Color(0xFF2D2785),
    }),
    scaffoldBackgroundColor: Color(0xFFF5F5F5),
    cardColor: Colors.white,
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Colors.black,
      elevation: 2,
      shadowColor: Colors.black26,
    ),
    textTheme: TextTheme(
      headlineLarge: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
      headlineMedium: TextStyle(color: Colors.black, fontWeight: FontWeight.w600),
      bodyLarge: TextStyle(color: Colors.black87),
      bodyMedium: TextStyle(color: Colors.black54),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primarySwatch: MaterialColor(0xFF6C63FF, {
      50: Color(0xFFEFEEFF),
      100: Color(0xFFD6D4FF),
      200: Color(0xFFB5B1FF),
      300: Color(0xFF948EFF),
      400: Color(0xFF7B73FF),
      500: Color(0xFF6C63FF),
      600: Color(0xFF5A52E8),
      700: Color(0xFF4A42CC),
      800: Color(0xFF3B34B0),
      900: Color(0xFF2D2785),
    }),
    scaffoldBackgroundColor: Color(0xFF0F0F23),
    cardColor: Color(0xFF1A1A2E),
    appBarTheme: AppBarTheme(
      backgroundColor: Color(0xFF1A1A2E),
      foregroundColor: Colors.white,
      elevation: 2,
      shadowColor: Colors.black54,
    ),
    textTheme: TextTheme(
      headlineLarge: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
      headlineMedium: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
      bodyLarge: TextStyle(color: Colors.white70),
      bodyMedium: TextStyle(color: Colors.white54),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    ),
  );
}