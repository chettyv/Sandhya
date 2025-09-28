import 'package:flutter/material.dart';

/// Centralizes theme configuration for quick customization.
class AppTheme {
  const AppTheme._();

  static ThemeData get light => ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8B5CF6),
          brightness: Brightness.light,
        ),
        fontFamily: 'Manrope',
        useMaterial3: true,
        typography: Typography.material2021(platform: TargetPlatform.android),
        textTheme: const TextTheme(
          headlineLarge: TextStyle(fontWeight: FontWeight.bold),
          titleMedium: TextStyle(fontWeight: FontWeight.w600),
        ),
      );
}
