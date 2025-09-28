// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_practice.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DailyPracticeImpl _$$DailyPracticeImplFromJson(Map<String, dynamic> json) =>
    _$DailyPracticeImpl(
      date: DateTime.parse(json['date'] as String),
      readingCompleted: json['readingCompleted'] as bool? ?? false,
      prayerCompleted: json['prayerCompleted'] as bool? ?? false,
      journalCompleted: json['journalCompleted'] as bool? ?? false,
      journalText: json['journalText'] as String?,
      readingCompletedAt: json['readingCompletedAt'] == null
          ? null
          : DateTime.parse(json['readingCompletedAt'] as String),
      prayerCompletedAt: json['prayerCompletedAt'] == null
          ? null
          : DateTime.parse(json['prayerCompletedAt'] as String),
      journalCompletedAt: json['journalCompletedAt'] == null
          ? null
          : DateTime.parse(json['journalCompletedAt'] as String),
    );

Map<String, dynamic> _$$DailyPracticeImplToJson(_$DailyPracticeImpl instance) =>
    <String, dynamic>{
      'date': instance.date.toIso8601String(),
      'readingCompleted': instance.readingCompleted,
      'prayerCompleted': instance.prayerCompleted,
      'journalCompleted': instance.journalCompleted,
      'journalText': instance.journalText,
      'readingCompletedAt': instance.readingCompletedAt?.toIso8601String(),
      'prayerCompletedAt': instance.prayerCompletedAt?.toIso8601String(),
      'journalCompletedAt': instance.journalCompletedAt?.toIso8601String(),
    };
