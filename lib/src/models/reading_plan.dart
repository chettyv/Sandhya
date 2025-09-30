import 'package:freezed_annotation/freezed_annotation.dart';

import 'reading_plan_entry.dart';
import 'scripture_reference.dart';

part 'reading_plan.freezed.dart';
part 'reading_plan.g.dart';

/// Optional categorization for plan type; can mirror difficulty.
enum PlanType { beginner, intermediate, advanced }

@freezed
class ReadingPlan with _$ReadingPlan {
  const factory ReadingPlan({
    required String id,
    required String title,
    required String description,
    required int durationDays,
    @Default(DifficultyLevel.beginner) DifficultyLevel difficulty,
    @Default(10) int estimatedDailyMinutes,
    @Default(PlanType.beginner) PlanType type,
    @Default(<ReadingPlanEntry>[]) List<ReadingPlanEntry> entries,
  }) = _ReadingPlan;

  factory ReadingPlan.fromJson(Map<String, dynamic> json) =>
      _$ReadingPlanFromJson(json);
}

extension ReadingPlanX on ReadingPlan {
  ReadingPlanEntry? entryForDay(int day) {
    for (final e in entries) {
      if (e.dayNumber == day) return e;
    }
    return null;
  }

  bool isComplete(Set<int> completedDays) {
    if (entries.isEmpty) return false;
    final needed = entries.map((e) => e.dayNumber).toSet();
    return needed.difference(completedDays).isEmpty;
  }

  double progressPercent(Set<int> completedDays) {
    if (entries.isEmpty) return 0;
    final completed = entries.where((e) => completedDays.contains(e.dayNumber)).length;
    return completed / entries.length;
  }
}
