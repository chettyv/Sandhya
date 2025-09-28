import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user_reading_progress.dart';
import '../models/user_profile.dart';

import '../models/daily_practice.dart';
import '../models/streak_data.dart';

class PersistenceService {
  static const _dailyPrefix = 'daily_practice_';
  static const _streakKey = 'streak_data';
  static const _readingPlanProgressKey = 'reading_plan_progress_v1';
  static const _collectionProgressKey = 'collection_progress_v1';
  static const _userProfileKey = 'user_profile_v1';

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
    await prefs.remove(_userProfileKey);
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

extension ReadingPlanPersistence on PersistenceService {
  Future<Map<String, ReadingPlanProgress>> loadReadingPlanProgressMap() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(PersistenceService._readingPlanProgressKey);
    if (raw == null || raw.isEmpty) return {};
    try {
      final list = (jsonDecode(raw) as List<dynamic>)
          .cast<Map<String, dynamic>>()
          .map(ReadingPlanProgress.fromJson)
          .toList();
      return {for (final p in list) p.planId: p};
    } catch (_) {
      return {};
    }
  }

  Future<void> saveReadingPlanProgressMap(
      Map<String, ReadingPlanProgress> map) async {
    final prefs = await SharedPreferences.getInstance();
    final list = map.values.map((e) => e.toJson()).toList();
    await prefs.setString(
        PersistenceService._readingPlanProgressKey, jsonEncode(list));
  }
}

extension CollectionPersistence on PersistenceService {
  Future<Map<String, CollectionProgress>> loadCollectionProgressMap() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(PersistenceService._collectionProgressKey);
    if (raw == null || raw.isEmpty) return {};
    try {
      final list = (jsonDecode(raw) as List<dynamic>)
          .cast<Map<String, dynamic>>()
          .map(CollectionProgress.fromJson)
          .toList();
      return {for (final c in list) c.collectionId: c};
    } catch (_) {
      return {};
    }
  }

  Future<void> saveCollectionProgressMap(
      Map<String, CollectionProgress> map) async {
    final prefs = await SharedPreferences.getInstance();
    final list = map.values.map((e) => e.toJson()).toList();
    await prefs.setString(
        PersistenceService._collectionProgressKey, jsonEncode(list));
  }
}

extension UserProfilePersistence on PersistenceService {
  Future<UserProfile?> loadUserProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(PersistenceService._userProfileKey);
    if (raw == null || raw.isEmpty) return null;
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      return UserProfile.fromJson(map);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveUserProfile(UserProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = jsonEncode(profile.toJson());
    await prefs.setString(PersistenceService._userProfileKey, raw);
  }
}
