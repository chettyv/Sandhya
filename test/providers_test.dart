import 'package:dharma_daily/src/models/daily_practice.dart';
import 'package:dharma_daily/src/models/streak_data.dart';
import 'package:dharma_daily/src/providers/daily_practice_provider.dart';
import 'package:dharma_daily/src/providers/streak_provider.dart';
import 'package:dharma_daily/src/services/persistence_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'test_helpers.dart';

void main() {
  group('StreakNotifier', () {
    test('marks completion, increments streak, handles gaps and week rollover', () async {
      final today = DateTime.now();
      final start = startOfWeek(today);
      final initial = StreakData(
        currentStreak: 0,
        longestStreak: 0,
        lastCompletionDate: null,
        weekStart: start,
        weeklyStatus: List<bool>.filled(7, false),
      );

      final persistence = InMemoryPersistenceService(streak: initial);
      final container = ProviderContainer(overrides: [
        persistenceServiceProvider.overrideWithValue(persistence),
      ]);
      addTearDown(container.dispose);

      // Keep provider alive and wait for async load
      final sub = container.listen<StreakData>(streakProvider, (_, __) {});
      addTearDown(sub.close);
      await Future<void>.delayed(const Duration(milliseconds: 1));

      // Mark today
      container.read(streakProvider.notifier).markCompletedOn(today);
      final state1 = container.read(streakProvider);
      expect(state1.currentStreak, 1);
      expect(state1.longestStreak, 1);
      expect(state1.weeklyStatus[weekdayIndex(today)], isTrue);

      // Mark next day → streak increments
      final nextDay = today.add(const Duration(days: 1));
      container.read(streakProvider.notifier).markCompletedOn(nextDay);
      final state2 = container.read(streakProvider);
      expect(state2.currentStreak, 2);
      expect(state2.longestStreak, 2);
      expect(state2.weeklyStatus[weekdayIndex(nextDay)], isTrue);

      // Skip a day → resets to 1
      final skipDay = today.add(const Duration(days: 3));
      container.read(streakProvider.notifier).markCompletedOn(skipDay);
      final state3 = container.read(streakProvider);
      expect(state3.currentStreak, 1);

      // Week rollover: from Saturday to next Sunday resets week array
      final saturday = start.add(const Duration(days: 6));
      container.read(streakProvider.notifier).markCompletedOn(saturday);
      final sundayNext = start.add(const Duration(days: 7));
      container.read(streakProvider.notifier).markCompletedOn(sundayNext);
      final state4 = container.read(streakProvider);
      expect(state4.weekStart, startOfWeek(sundayNext));
      expect(state4.weeklyStatus[0], isTrue);
    });
  });

  group('DailyPracticeNotifier', () {
    test('completing all practices marks streak once per day', () async {
      final today = DailyPractice.today();
      final practice = today.copyWith();
      final streak = StreakData.initialFor(today.date);
      final persistence = InMemoryPersistenceService(practice: practice, streak: streak);

      final container = ProviderContainer(overrides: [
        persistenceServiceProvider.overrideWithValue(persistence),
      ]);
      addTearDown(container.dispose);

      // Keep providers alive and wait for lazy loads
      final sub = container.listen<StreakData>(streakProvider, (_, __) {});
      final sub2 = container.listen<DailyPractice>(dailyPracticeProvider, (_, __) {});
      addTearDown(sub.close);
      addTearDown(sub2.close);
      await Future<void>.delayed(const Duration(milliseconds: 5));

      final dp = container.read(dailyPracticeProvider.notifier);
      await dp.setReadingCompleted(true);
      await dp.setPrayerCompleted(true);
      await dp.saveJournal('Reflected.');

      final s1 = container.read(streakProvider);
      expect(s1.currentStreak, 1);
      expect(s1.weeklyStatus[weekdayIndex(today.date)], isTrue);

      // Toggling one back and forth should not add another mark today
      await dp.setPrayerCompleted(false);
      await dp.setPrayerCompleted(true);
      final s2 = container.read(streakProvider);
      expect(s2.currentStreak, 1);
    });
  });
}
