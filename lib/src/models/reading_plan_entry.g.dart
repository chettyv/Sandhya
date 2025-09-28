// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reading_plan_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ReadingPlanEntryImpl _$$ReadingPlanEntryImplFromJson(
        Map<String, dynamic> json) =>
    _$ReadingPlanEntryImpl(
      dayNumber: (json['dayNumber'] as num).toInt(),
      verseId: json['verseId'] as String,
      guidance: json['guidance'] as String?,
      reflectionQuestions: (json['reflectionQuestions'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      suggestedPractices: (json['suggestedPractices'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      estimatedMinutes: (json['estimatedMinutes'] as num?)?.toInt() ?? 10,
      prerequisites: (json['prerequisites'] as List<dynamic>?)
              ?.map((e) => (e as num).toInt())
              .toList() ??
          const <int>[],
    );

Map<String, dynamic> _$$ReadingPlanEntryImplToJson(
        _$ReadingPlanEntryImpl instance) =>
    <String, dynamic>{
      'dayNumber': instance.dayNumber,
      'verseId': instance.verseId,
      'guidance': instance.guidance,
      'reflectionQuestions': instance.reflectionQuestions,
      'suggestedPractices': instance.suggestedPractices,
      'estimatedMinutes': instance.estimatedMinutes,
      'prerequisites': instance.prerequisites,
    };
