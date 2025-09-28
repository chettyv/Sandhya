import 'package:freezed_annotation/freezed_annotation.dart';

part 'daily_practice.freezed.dart';
part 'daily_practice.g.dart';

@freezed
class DailyPractice with _$DailyPractice {
  const DailyPractice._();

  const factory DailyPractice({
    required DateTime date,
    @Default(false) bool readingCompleted,
    @Default(false) bool prayerCompleted,
    @Default(false) bool journalCompleted,
    String? journalText,
    DateTime? readingCompletedAt,
    DateTime? prayerCompletedAt,
    DateTime? journalCompletedAt,
  }) = _DailyPractice;

  factory DailyPractice.today() => DailyPractice(date: _dateOnly(DateTime.now()));

  factory DailyPractice.fromJson(Map<String, dynamic> json) => _$DailyPracticeFromJson(json);

  int get completedCount => (readingCompleted ? 1 : 0) + (prayerCompleted ? 1 : 0) + (journalCompleted ? 1 : 0);

  double get completionRatio => completedCount / 3.0;

  bool get allCompleted => readingCompleted && prayerCompleted && journalCompleted;
}

DateTime _dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);
