// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scripture_reference.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ScriptureReferenceImpl _$$ScriptureReferenceImplFromJson(
        Map<String, dynamic> json) =>
    _$ScriptureReferenceImpl(
      id: json['id'] as String,
      verseId: json['verseId'] as String,
      title: json['title'] as String,
      source: $enumDecode(_$ScriptureSourceEnumMap, json['source']),
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const <String>[],
      difficulty:
          $enumDecodeNullable(_$DifficultyLevelEnumMap, json['difficulty']) ??
              DifficultyLevel.beginner,
      estimatedMinutes: (json['estimatedMinutes'] as num?)?.toInt() ?? 10,
    );

Map<String, dynamic> _$$ScriptureReferenceImplToJson(
        _$ScriptureReferenceImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'verseId': instance.verseId,
      'title': instance.title,
      'source': _$ScriptureSourceEnumMap[instance.source]!,
      'tags': instance.tags,
      'difficulty': _$DifficultyLevelEnumMap[instance.difficulty]!,
      'estimatedMinutes': instance.estimatedMinutes,
    };

const _$ScriptureSourceEnumMap = {
  ScriptureSource.bhagavadGita: 'bhagavadGita',
  ScriptureSource.upanishads: 'upanishads',
  ScriptureSource.vedas: 'vedas',
  ScriptureSource.puranas: 'puranas',
  ScriptureSource.mantra: 'mantra',
  ScriptureSource.other: 'other',
};

const _$DifficultyLevelEnumMap = {
  DifficultyLevel.beginner: 'beginner',
  DifficultyLevel.intermediate: 'intermediate',
  DifficultyLevel.advanced: 'advanced',
};
