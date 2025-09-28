import 'package:freezed_annotation/freezed_annotation.dart';

part 'reading_plan_entry.freezed.dart';
part 'reading_plan_entry.g.dart';

@freezed
class ReadingPlanEntry with _$ReadingPlanEntry {
  const factory ReadingPlanEntry({
    required int dayNumber,
    required String verseId,
    String? guidance,
    @Default(<String>[]) List<String> reflectionQuestions,
    @Default(<String>[]) List<String> suggestedPractices,
    @Default(10) int estimatedMinutes,
    @Default(<int>[]) List<int> prerequisites,
  }) = _ReadingPlanEntry;

  factory ReadingPlanEntry.fromJson(Map<String, dynamic> json) =>
      _$ReadingPlanEntryFromJson(json);
}

extension ReadingPlanEntryX on ReadingPlanEntry {
  bool isAccessible(Set<int> completedDays) {
    if (prerequisites.isEmpty) return true;
    return prerequisites.every(completedDays.contains);
  }
}

