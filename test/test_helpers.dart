import 'dart:async';

import 'package:dharma_daily/src/models/daily_practice.dart';
import 'package:dharma_daily/src/models/daily_verse.dart';
import 'package:dharma_daily/src/models/offline_status.dart';
import 'package:dharma_daily/src/models/streak_data.dart';
import 'package:dharma_daily/src/models/user_profile.dart';
import 'package:dharma_daily/src/providers/daily_content_provider.dart';
import 'package:dharma_daily/src/providers/user_profile_provider.dart';
import 'package:dharma_daily/src/services/persistence_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dharma_daily/src/providers/content_cache_provider.dart';
import 'package:dharma_daily/src/providers/day_provider.dart';

// ---------- Common test values ----------

const testWeeklyStatus = <bool>[true, false, true, true, false, true, false];
const testCurrentStreakCount = 5;

// Progress is derived from DailyPractice via progressProvider; we configure
// practice states and let the provider compute the percentage.

// ---------- Test data factories ----------

DailyVerse makeTestVerse({
  String id = 'test-verse-1',
  String title = 'Test Title',
  String scripture = 'Om tat sat',
  String reference = 'Test 1.1',
  String? transliteration = 'om tat sat',
  String? commentary = 'Be present and act with love.',
  Map<String, String>? translations,
  String? devotionalTitle = 'Practice Presence',
  String? devotionalReflection = 'Return to the breath, soften the heart.',
  String? prayerTitle = 'Simple Prayer',
  String? prayerText = 'Lokah samastah sukhino bhavantu',
  String? journalPrompt = 'What am I grateful for today?',
  int recommendedMinutes = 7,
}) {
  return DailyVerse(
    id: id,
    title: title,
    scripture: scripture,
    transliteration: transliteration,
    reference: reference,
    commentary: commentary,
    translations: translations ?? const {'en': 'English translation here.'},
    devotionalTitle: devotionalTitle,
    devotionalReflection: devotionalReflection,
    prayerTitle: prayerTitle,
    prayerText: prayerText,
    journalPrompt: journalPrompt,
    recommendedMeditationMinutes: recommendedMinutes,
  );
}

DailyPractice makePractice({
  bool reading = false,
  bool prayer = false,
  bool journal = false,
}) {
  return DailyPractice(
    date: DateTime.now(),
    readingCompleted: reading,
    prayerCompleted: prayer,
    journalCompleted: journal,
  );
}

StreakData makeStreakData({
  List<bool> weekly = testWeeklyStatus,
  int current = testCurrentStreakCount,
  DateTime? lastCompletion,
}) {
  final today = DateTime.now();
  return StreakData(
    currentStreak: current,
    longestStreak: current,
    lastCompletionDate: lastCompletion ?? today,
    weekStart: startOfWeek(today),
    weeklyStatus: weekly,
  );
}

UserProfile makeProfile({
  bool complete = true,
}) {
  if (complete) {
    return const UserProfile(
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
      deityPreferences: <String>['Krishna'],
      spiritualGoals: <String>['Meditation'],
      preferredLanguage: 'en',
      audioEnabled: false,
    );
  }
  // Incomplete profile leaves required fields empty
  return UserProfile.defaults();
}

OfflineStatus makeOfflineStatus({bool isOnline = false, int totalCached = 0}) {
  return OfflineStatus(
    isOnline: isOnline,
    lastOnlineAt: isOnline ? DateTime.now() : null,
    cacheStatus: totalCached > 0 ? CacheHealth.partiallyCached : CacheHealth.noCache,
    essentialContentCached: totalCached > 0,
    totalCachedItems: totalCached,
  );
}

// ---------- Persistence stub & Provider overrides ----------

class InMemoryPersistenceService extends PersistenceService {
  InMemoryPersistenceService({
    DailyPractice? practice,
    StreakData? streak,
    UserProfile? profile,
  })  : _practice = practice,
        _streak = streak,
        _profile = profile;

  DailyPractice? _practice;
  StreakData? _streak;
  UserProfile? _profile;

  @override
  Future<DailyPractice?> loadDailyPractice(DateTime date) async => _practice;

  @override
  Future<void> saveDailyPractice(DailyPractice practice) async {
    _practice = practice;
  }

  @override
  Future<StreakData?> loadStreakData() async => _streak;

  @override
  Future<void> saveStreakData(StreakData data) async {
    _streak = data;
  }

  Future<UserProfile?> loadUserProfile() async => _profile;

  Future<void> saveUserProfile(UserProfile profile) async {
    _profile = profile;
  }
}

// Simple test-only profile notifier that never touches persistence.
// (Intentionally left without references to avoid loading persistence in tests.)

/// Builds a common set of provider overrides for tests.
List<Override> buildBaseOverrides({
  required DailyVerse featured,
  List<DailyVerse>? feed,
  DailyPractice? practice,
  StreakData? streak,
  UserProfile? profile,
}) {
  final persistence = InMemoryPersistenceService(
    practice: practice,
    streak: streak,
    profile: profile,
  );

  final overrides = <Override>[
    // Avoid midnight timers in tests
    currentDayProvider.overrideWith((ref) => Stream<DateTime>.value(DateTime.now())),
    // Provide predictable persistence-backed state for notifiers
    persistenceServiceProvider.overrideWithValue(persistence),

    // Use a deterministic feed & featured verse
    verseFeedProvider.overrideWithValue(feed ?? <DailyVerse>[featured]),
    featuredVerseProvider.overrideWith((ref) async => featured),
  ];

  // If a profile is provided, seed profile state and computed completeness.
  if (profile != null) {
    overrides.addAll([
      userProfileProvider.overrideWith((ref) => UserProfileNotifier.test(ref, profile)),
      isProfileCompleteProvider.overrideWithValue(profile.isComplete),
    ]);
  }

  return overrides;
}

/// Convenience override to force an offline or online state.
Override overrideOfflineStatus(OfflineStatus status) {
  return offlineStatusProvider.overrideWith((ref) => Stream<OfflineStatus>.value(status));
}

// ---------- Widget builders ----------

Widget wrapWithMaterial(Widget child) {
  return MaterialApp(
    theme: ThemeData(useMaterial3: true),
    home: Scaffold(body: Center(child: child)),
  );
}

Widget buildTestApp({
  required Widget home,
  List<Override> overrides = const <Override>[],
}) {
  return ProviderScope(
    overrides: overrides,
    child: MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: home,
    ),
  );
}

// ---------- Finder helpers (light sugar) ----------

Finder findTextExact(String text) => find.text(text);
Finder findType(Type t) => find.byType(t);
