// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offline_status.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$OfflineStatusImpl _$$OfflineStatusImplFromJson(Map<String, dynamic> json) =>
    _$OfflineStatusImpl(
      isOnline: json['isOnline'] as bool,
      lastOnlineAt: json['lastOnlineAt'] == null
          ? null
          : DateTime.parse(json['lastOnlineAt'] as String),
      cacheStatus:
          $enumDecodeNullable(_$CacheHealthEnumMap, json['cacheStatus']) ??
              CacheHealth.noCache,
      essentialContentCached: json['essentialContentCached'] as bool? ?? false,
      totalCachedItems: (json['totalCachedItems'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$OfflineStatusImplToJson(_$OfflineStatusImpl instance) =>
    <String, dynamic>{
      'isOnline': instance.isOnline,
      'lastOnlineAt': instance.lastOnlineAt?.toIso8601String(),
      'cacheStatus': _$CacheHealthEnumMap[instance.cacheStatus]!,
      'essentialContentCached': instance.essentialContentCached,
      'totalCachedItems': instance.totalCachedItems,
    };

const _$CacheHealthEnumMap = {
  CacheHealth.fullyCached: 'fullyCached',
  CacheHealth.partiallyCached: 'partiallyCached',
  CacheHealth.noCache: 'noCache',
};
