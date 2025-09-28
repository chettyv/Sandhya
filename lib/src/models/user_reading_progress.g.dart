// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_reading_progress.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ReadingPlanProgressImpl _$$ReadingPlanProgressImplFromJson(
        Map<String, dynamic> json) =>
    _$ReadingPlanProgressImpl(
      planId: json['planId'] as String,
      startedAt: DateTime.parse(json['startedAt'] as String),
      completedDays: (json['completedDays'] as Map<String, dynamic>?)?.map(
            (k, e) => MapEntry(int.parse(k), DateTime.parse(e as String)),
          ) ??
          const <int, DateTime>{},
    );

Map<String, dynamic> _$$ReadingPlanProgressImplToJson(
        _$ReadingPlanProgressImpl instance) =>
    <String, dynamic>{
      'planId': instance.planId,
      'startedAt': instance.startedAt.toIso8601String(),
      'completedDays': instance.completedDays
          .map((k, e) => MapEntry(k.toString(), e.toIso8601String())),
    };

_$CollectionProgressImpl _$$CollectionProgressImplFromJson(
        Map<String, dynamic> json) =>
    _$CollectionProgressImpl(
      collectionId: json['collectionId'] as String,
      startedAt: DateTime.parse(json['startedAt'] as String),
      completedReferenceIds:
          (json['completedReferenceIds'] as Map<String, dynamic>?)?.map(
                (k, e) => MapEntry(k, DateTime.parse(e as String)),
              ) ??
              const <String, DateTime>{},
    );

Map<String, dynamic> _$$CollectionProgressImplToJson(
        _$CollectionProgressImpl instance) =>
    <String, dynamic>{
      'collectionId': instance.collectionId,
      'startedAt': instance.startedAt.toIso8601String(),
      'completedReferenceIds': instance.completedReferenceIds
          .map((k, e) => MapEntry(k, e.toIso8601String())),
    };
