// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reading_plan.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ReadingPlanImpl _$$ReadingPlanImplFromJson(Map<String, dynamic> json) =>
    _$ReadingPlanImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      durationDays: (json['durationDays'] as num).toInt(),
      difficulty:
          $enumDecodeNullable(_$DifficultyLevelEnumMap, json['difficulty']) ??
              DifficultyLevel.beginner,
      estimatedDailyMinutes:
          (json['estimatedDailyMinutes'] as num?)?.toInt() ?? 10,
      type: $enumDecodeNullable(_$PlanTypeEnumMap, json['type']) ??
          PlanType.beginner,
      entries: (json['entries'] as List<dynamic>?)
              ?.map((e) => ReadingPlanEntry.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const <ReadingPlanEntry>[],
    );

Map<String, dynamic> _$$ReadingPlanImplToJson(_$ReadingPlanImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'durationDays': instance.durationDays,
      'difficulty': _$DifficultyLevelEnumMap[instance.difficulty]!,
      'estimatedDailyMinutes': instance.estimatedDailyMinutes,
      'type': _$PlanTypeEnumMap[instance.type]!,
      'entries': instance.entries,
    };

const _$DifficultyLevelEnumMap = {
  DifficultyLevel.beginner: 'beginner',
  DifficultyLevel.intermediate: 'intermediate',
  DifficultyLevel.advanced: 'advanced',
};

const _$PlanTypeEnumMap = {
  PlanType.beginner: 'beginner',
  PlanType.intermediate: 'intermediate',
  PlanType.advanced: 'advanced',
};
