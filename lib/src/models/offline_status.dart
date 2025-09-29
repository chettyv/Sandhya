import 'package:freezed_annotation/freezed_annotation.dart';

part 'offline_status.freezed.dart';
part 'offline_status.g.dart';

enum CacheHealth { fullyCached, partiallyCached, noCache }

@freezed
class OfflineStatus with _$OfflineStatus {
  const factory OfflineStatus({
    required bool isOnline,
    DateTime? lastOnlineAt,
    @Default(CacheHealth.noCache) CacheHealth cacheStatus,
    @Default(false) bool essentialContentCached,
    @Default(0) int totalCachedItems,
  }) = _OfflineStatus;

  factory OfflineStatus.fromJson(Map<String, dynamic> json) =>
      _$OfflineStatusFromJson(json);
}

extension OfflineStatusX on OfflineStatus {
  bool get canOperateOffline => essentialContentCached || cacheStatus != CacheHealth.noCache;
  String get statusMessage {
    if (isOnline) {
      switch (cacheStatus) {
        case CacheHealth.fullyCached:
          return 'Online • All essential content cached';
        case CacheHealth.partiallyCached:
          return 'Online • Some content cached';
        case CacheHealth.noCache:
          return 'Online';
      }
    } else {
      switch (cacheStatus) {
        case CacheHealth.fullyCached:
          return 'Offline • Using cached content';
        case CacheHealth.partiallyCached:
          return 'Offline • Limited cached content available';
        case CacheHealth.noCache:
          return 'Offline • No cached content';
      }
    }
  }
}

