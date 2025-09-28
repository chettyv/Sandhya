import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/streak_data.dart';
import '../services/persistence_service.dart';

final streakProvider =
    StateNotifierProvider<StreakNotifier, StreakData>((ref) {
  return StreakNotifier(ref);
});

class StreakNotifier extends StateNotifier<StreakData> {
  StreakNotifier(this.ref) : super(StreakData.initialFor(DateTime.now())) {
    Future.microtask(_load);
  }

  final Ref ref;

  PersistenceService get _store => ref.read(persistenceServiceProvider);

  Future<void> _load() async {
    final loaded = await _store.loadStreakData();
    if (loaded == null) {
      state = StreakData.initialFor(DateTime.now());
    } else {
      // Ensure current week context is correct if the week has changed
      final now = DateTime.now();
      final correctWeekStart = startOfWeek(now);
      if (!_isSameDay(loaded.weekStart, correctWeekStart)) {
        state = loaded.copyWith(weekStart: correctWeekStart, weeklyStatus: List<bool>.filled(7, false));
      } else {
        state = loaded;
      }
    }
  }

  Future<void> _persist() async {
    await _store.saveStreakData(state);
  }

  void markCompletedOn(DateTime date) {
    final next = state.markCompletedOn(date);
    if (next == state) return;
    state = next;
    _persist();
  }
}

bool _isSameDay(DateTime a, DateTime b) =>
    a.year == b.year && a.month == b.month && a.day == b.day;
