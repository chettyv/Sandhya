import 'package:freezed_annotation/freezed_annotation.dart';

part 'daily_verse.freezed.dart';
part 'daily_verse.g.dart';

/// Immutable representation of a verse surfaced in the app.
@freezed
class DailyVerse with _$DailyVerse {
  const factory DailyVerse({
    required String id,
    required String title,
    required String scripture,
    String? transliteration,
    required String reference,
    String? commentary,
    Map<String, String>? translations,
    String? devotionalTitle,
    String? devotionalReflection,
    String? prayerTitle,
    String? prayerText,
    String? journalPrompt,
    @Default(10) int recommendedMeditationMinutes,
  }) = _DailyVerse;

  factory DailyVerse.fromJson(Map<String, dynamic> json) =>
      _$DailyVerseFromJson(json);
}
