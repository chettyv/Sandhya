import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/daily_practice.dart';
import '../models/streak_data.dart';

class PersistenceService {
  static const _dailyPrefix = 'daily_practice_';
  static const _streakKey = 'streak_data';

  Future<DailyPractice?> loadDailyPractice(DateTime date) async {
    final prefs = await SharedPreferences.getInstance();
    final key = _dailyKeyFor(date);
    final raw = prefs.getString(key);
    if (raw == null || raw.isEmpty) return null;
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      return DailyPractice.fromJson(map);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveDailyPractice(DailyPractice practice) async {
    final prefs = await SharedPreferences.getInstance();
    final key = _dailyKeyFor(practice.date);
    final raw = jsonEncode(practice.toJson());
    await prefs.setString(key, raw);
  }

  Future<StreakData?> loadStreakData() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_streakKey);
    if (raw == null || raw.isEmpty) return null;
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      return StreakData.fromJson(map);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveStreakData(StreakData data) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = jsonEncode(data.toJson());
    await prefs.setString(_streakKey, raw);
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_streakKey);
    final keys = prefs.getKeys().where((k) => k.startsWith(_dailyPrefix)).toList();
    for (final k in keys) {
      await prefs.remove(k);
    }
  }

  String _dailyKeyFor(DateTime date) {
    final y = date.year.toString().padLeft(4, '0');
    final m = date.month.toString().padLeft(2, '0');
    final day = date.day.toString().padLeft(2, '0');
    return '$_dailyPrefix$y-$m-$day';
  }
}

final persistenceServiceProvider = Provider<PersistenceService>((ref) {
  return PersistenceService();
});
