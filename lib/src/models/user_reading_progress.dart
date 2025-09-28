import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_reading_progress.freezed.dart';
part 'user_reading_progress.g.dart';

@freezed
class ReadingPlanProgress with _$ReadingPlanProgress {
  const factory ReadingPlanProgress({
    required String planId,
    required DateTime startedAt,
    @Default(<int, DateTime>{}) Map<int, DateTime> completedDays,
  }) = _ReadingPlanProgress;

  factory ReadingPlanProgress.fromJson(Map<String, dynamic> json) =>
      _$ReadingPlanProgressFromJson(json);
}

extension ReadingPlanProgressX on ReadingPlanProgress {
  int completedCount() => completedDays.length;

  ReadingPlanProgress markCompleted(int day, DateTime when) {
    final map = Map<int, DateTime>.from(completedDays);
    map[day] = when;
    return copyWith(completedDays: map);
  }

  bool isDayCompleted(int day) => completedDays.containsKey(day);
}

@freezed
class CollectionProgress with _$CollectionProgress {
  const factory CollectionProgress({
    required String collectionId,
    required DateTime startedAt,
    @Default(<String, DateTime>{}) Map<String, DateTime> completedReferenceIds,
  }) = _CollectionProgress;

  factory CollectionProgress.fromJson(Map<String, dynamic> json) =>
      _$CollectionProgressFromJson(json);
}

extension CollectionProgressX on CollectionProgress {
  int completedCount() => completedReferenceIds.length;

  CollectionProgress markCompleted(String refId, DateTime when) {
    final map = Map<String, DateTime>.from(completedReferenceIds);
    map[refId] = when;
    return copyWith(completedReferenceIds: map);
  }

  bool isCompleted(String refId) => completedReferenceIds.containsKey(refId);
}

