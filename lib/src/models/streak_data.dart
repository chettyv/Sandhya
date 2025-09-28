import 'dart:math';

import 'package:freezed_annotation/freezed_annotation.dart';

part 'streak_data.freezed.dart';
part 'streak_data.g.dart';

@freezed
class StreakData with _$StreakData {
  const StreakData._();

  const factory StreakData({
    @Default(0) int currentStreak,
    @Default(0) int longestStreak,
    DateTime? lastCompletionDate,
    required DateTime weekStart,
    @Default(<bool>[false, false, false, false, false, false, false])
    List<bool> weeklyStatus,
  }) = _StreakData;

  factory StreakData.initialFor(DateTime now) => StreakData(
        weekStart: startOfWeek(now),
      );

  factory StreakData.fromJson(Map<String, dynamic> json) => _$StreakDataFromJson(json);

  /// Returns a new instance updated to reflect a completion on [date].
  StreakData markCompletedOn(DateTime date) {
    final today = _dateOnly(date);
    final normalizedWeekStart = startOfWeek(today);
    List<bool> status = weeklyStatus;
    if (!_isSameDay(weekStart, normalizedWeekStart)) {
      // Reset week if we've moved to a new week.
      status = List<bool>.filled(7, false);
    }

    final index = weekdayIndex(today); // 0..6, Sunday..Saturday
    status = List<bool>.from(status);
    status[index] = true;

    final last = lastCompletionDate != null ? _dateOnly(lastCompletionDate!) : null;
    int nextStreak;
    if (last == null) {
      nextStreak = 1;
    } else if (_isSameDay(last, today)) {
      nextStreak = currentStreak; // no double count for same day
    } else {
      final days = today.difference(last).inDays;
      nextStreak = days == 1 ? currentStreak + 1 : 1;
    }

    return copyWith(
      currentStreak: nextStreak,
      longestStreak: max(longestStreak, nextStreak),
      lastCompletionDate: today,
      weekStart: normalizedWeekStart,
      weeklyStatus: status,
    );
  }
}

int weekdayIndex(DateTime date) => date.weekday % 7; // Sunday -> 0, Monday -> 1

DateTime startOfWeek(DateTime date) {
  final d = _dateOnly(date);
  final index = weekdayIndex(d); // 0..6
  return d.subtract(Duration(days: index)); // go back to Sunday
}

bool _isSameDay(DateTime a, DateTime b) =>
    a.year == b.year && a.month == b.month && a.day == b.day;

DateTime _dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);
