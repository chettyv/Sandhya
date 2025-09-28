import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/scripture_library_data.dart';
import '../models/reading_plan.dart';
import '../models/reading_plan_entry.dart';
import '../models/user_reading_progress.dart';
import '../services/persistence_service.dart';
import 'daily_practice_provider.dart';

// Available plans
final readingPlansProvider = Provider<List<ReadingPlan>>((ref) => readingPlans);

final planByIdProvider = Provider.family<ReadingPlan?, String>((ref, id) {
  return ref.watch(readingPlansProvider).where((p) => p.id == id).firstOrNull;
});

class ReadingPlanProgressNotifier
    extends StateNotifier<Map<String, ReadingPlanProgress>> {
  ReadingPlanProgressNotifier(this.ref) : super(const {}) {
    _load();
  }

  final Ref ref;

  Future<void> _load() async {
    final svc = ref.read(persistenceServiceProvider);
    final map = await svc.loadReadingPlanProgressMap();
    if (map.isNotEmpty) state = map;
  }

  Future<void> _save() async {
    final svc = ref.read(persistenceServiceProvider);
    await svc.saveReadingPlanProgressMap(state);
  }

  void startPlan(ReadingPlan plan) {
    if (state.containsKey(plan.id)) return; // already started
    final updated = {...state};
    updated[plan.id] = ReadingPlanProgress(
      planId: plan.id,
      startedAt: DateTime.now(),
      completedDays: const {},
    );
    state = updated;
    _save();
  }

  void markEntryCompleted(String planId, int day) {
    final existing = state[planId];
    if (existing == null) return;
    final updated = existing.markCompleted(day, DateTime.now());
    state = {...state, planId: updated};
    _save();
    // Also reflect completion in daily practice tracking
    ref.read(dailyPracticeProvider.notifier).setReadingCompleted(true);
  }

  void resetPlan(String planId) {
    final existing = state[planId];
    if (existing == null) return;
    final reset = existing.copyWith(completedDays: const {});
    state = {...state, planId: reset};
    _save();
  }
}

final planProgressProvider = StateNotifierProvider<ReadingPlanProgressNotifier,
    Map<String, ReadingPlanProgress>>((ref) {
  return ReadingPlanProgressNotifier(ref);
});

final planProgressForProvider =
    Provider.family<ReadingPlanProgress?, String>((ref, planId) {
  return ref.watch(planProgressProvider)[planId];
});

final activePlansProvider = Provider<List<ReadingPlan>>((ref) {
  final plans = ref.watch(readingPlansProvider);
  final progress = ref.watch(planProgressProvider);
  return plans.where((p) {
    final pr = progress[p.id];
    if (pr == null) return false;
    final completedDays = pr.completedDays.keys.toSet();
    return !p.isComplete(completedDays);
  }).toList();
});

final currentDayEntryProvider =
    Provider.family<ReadingPlanEntry?, String>((ref, planId) {
  final plan = ref.watch(planByIdProvider(planId));
  if (plan == null) return null;
  final progress = ref.watch(planProgressForProvider(planId));
  final completed = progress?.completedDays.keys.toSet() ?? <int>{};
  // Next day is first not completed day
  for (final e in plan.entries) {
    if (!completed.contains(e.dayNumber)) return e;
  }
  return plan.entries.isEmpty ? null : plan.entries.last; // fallback
});

extension FirstOrNull<E> on Iterable<E> {
  E? get firstOrNull => isEmpty ? null : first;
}
