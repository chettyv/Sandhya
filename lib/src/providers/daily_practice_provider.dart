import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/daily_practice.dart';
import '../services/persistence_service.dart';
import 'streak_provider.dart';

final dailyPracticeProvider =
    StateNotifierProvider<DailyPracticeNotifier, DailyPractice>((ref) {
  return DailyPracticeNotifier(ref);
});

class DailyPracticeNotifier extends StateNotifier<DailyPractice> {
  DailyPracticeNotifier(this.ref) : super(DailyPractice.today()) {
    // Lazy async init
    Future.microtask(_loadToday);
  }

  final Ref ref;

  PersistenceService get _store => ref.read(persistenceServiceProvider);

  Future<void> _loadToday() async {
    final today = DailyPractice.today();
    final stored = await _store.loadDailyPractice(today.date);
    state = stored ?? today;
  }

  Future<void> _persist() async {
    await _store.saveDailyPractice(state);
  }

  Future<void> setReadingCompleted(bool completed) async {
    await _refreshIfDateRolledOver();
    final now = DateTime.now();
    final wasAllCompleted = state.allCompleted;
    state = state.copyWith(
      readingCompleted: completed,
      readingCompletedAt: completed ? now : null,
    );
    await _persist();
    _notifyStreak(previousAllCompleted: wasAllCompleted);
  }

  Future<void> setPrayerCompleted(bool completed) async {
    await _refreshIfDateRolledOver();
    final now = DateTime.now();
    final wasAllCompleted = state.allCompleted;
    state = state.copyWith(
      prayerCompleted: completed,
      prayerCompletedAt: completed ? now : null,
    );
    await _persist();
    _notifyStreak(previousAllCompleted: wasAllCompleted);
  }

  Future<void> saveJournal(String text) async {
    await _refreshIfDateRolledOver();
    final now = DateTime.now();
    final wasAllCompleted = state.allCompleted;
    state = state.copyWith(
      journalText: text,
      journalCompleted: true,
      journalCompletedAt: now,
    );
    await _persist();
    _notifyStreak(previousAllCompleted: wasAllCompleted);
  }

  void _notifyStreak({required bool previousAllCompleted}) {
    final isAllCompleted = state.allCompleted;
    if (!previousAllCompleted && isAllCompleted) {
      // Only mark once per day; if already marked today, skip.
      final streak = ref.read(streakProvider);
      final today = DateTime.now();
      final last = streak.lastCompletionDate;
      final alreadyMarkedToday =
          last != null && last.year == today.year && last.month == today.month && last.day == today.day;
      if (!alreadyMarkedToday) {
        ref.read(streakProvider.notifier).markCompletedOn(state.date);
      }
    }
  }

  Future<void> _refreshIfDateRolledOver() async {
    final today = DailyPractice.today();
    final sDate = state.date;
    final sameDay = sDate.year == today.date.year && sDate.month == today.date.month && sDate.day == today.date.day;
    if (!sameDay) {
      final stored = await _store.loadDailyPractice(today.date);
      state = stored ?? today;
    }
  }
}
