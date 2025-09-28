// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scripture_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ScriptureCollectionImpl _$$ScriptureCollectionImplFromJson(
        Map<String, dynamic> json) =>
    _$ScriptureCollectionImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$CollectionTypeEnumMap, json['type']),
      referenceIds: (json['referenceIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      estimatedMinutesTotal:
          (json['estimatedMinutesTotal'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$ScriptureCollectionImplToJson(
        _$ScriptureCollectionImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'type': _$CollectionTypeEnumMap[instance.type]!,
      'referenceIds': instance.referenceIds,
      'estimatedMinutesTotal': instance.estimatedMinutesTotal,
    };

const _$CollectionTypeEnumMap = {
  CollectionType.topical: 'topical',
  CollectionType.sourceBased: 'sourceBased',
  CollectionType.difficultyBased: 'difficultyBased',
};
