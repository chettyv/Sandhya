// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'streak_data.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$StreakDataImpl _$$StreakDataImplFromJson(Map<String, dynamic> json) =>
    _$StreakDataImpl(
      currentStreak: (json['currentStreak'] as num?)?.toInt() ?? 0,
      longestStreak: (json['longestStreak'] as num?)?.toInt() ?? 0,
      lastCompletionDate: json['lastCompletionDate'] == null
          ? null
          : DateTime.parse(json['lastCompletionDate'] as String),
      weekStart: DateTime.parse(json['weekStart'] as String),
      weeklyStatus: (json['weeklyStatus'] as List<dynamic>?)
              ?.map((e) => e as bool)
              .toList() ??
          const <bool>[false, false, false, false, false, false, false],
    );

Map<String, dynamic> _$$StreakDataImplToJson(_$StreakDataImpl instance) =>
    <String, dynamic>{
      'currentStreak': instance.currentStreak,
      'longestStreak': instance.longestStreak,
      'lastCompletionDate': instance.lastCompletionDate?.toIso8601String(),
      'weekStart': instance.weekStart.toIso8601String(),
      'weeklyStatus': instance.weeklyStatus,
    };
