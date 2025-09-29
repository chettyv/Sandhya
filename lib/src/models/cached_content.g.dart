// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cached_content.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CachedContentImpl _$$CachedContentImplFromJson(Map<String, dynamic> json) =>
    _$CachedContentImpl(
      verseId: json['verseId'] as String,
      cachedAt: DateTime.parse(json['cachedAt'] as String),
      expiresAt: json['expiresAt'] == null
          ? null
          : DateTime.parse(json['expiresAt'] as String),
      cacheSource:
          $enumDecodeNullable(_$CacheSourceEnumMap, json['cacheSource']) ??
              CacheSource.embedded,
      accessCount: (json['accessCount'] as num?)?.toInt() ?? 0,
      fileSize: (json['fileSize'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$CachedContentImplToJson(_$CachedContentImpl instance) =>
    <String, dynamic>{
      'verseId': instance.verseId,
      'cachedAt': instance.cachedAt.toIso8601String(),
      'expiresAt': instance.expiresAt?.toIso8601String(),
      'cacheSource': _$CacheSourceEnumMap[instance.cacheSource]!,
      'accessCount': instance.accessCount,
      'fileSize': instance.fileSize,
    };

const _$CacheSourceEnumMap = {
  CacheSource.embedded: 'embedded',
  CacheSource.downloaded: 'downloaded',
  CacheSource.personalized: 'personalized',
};
