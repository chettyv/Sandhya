import 'package:freezed_annotation/freezed_annotation.dart';

part 'cached_content.freezed.dart';
part 'cached_content.g.dart';

enum CacheSource { embedded, downloaded, personalized }

@freezed
class CachedContent with _$CachedContent {
  const factory CachedContent({
    required String verseId,
    required DateTime cachedAt,
    DateTime? expiresAt,
    @Default(CacheSource.embedded) CacheSource cacheSource,
    @Default(0) int accessCount,
    @Default(0) int fileSize,
  }) = _CachedContent;

  factory CachedContent.fromJson(Map<String, dynamic> json) =>
      _$CachedContentFromJson(json);
}

extension CachedContentX on CachedContent {
  bool get isExpired => expiresAt != null && DateTime.now().isAfter(expiresAt!);
  Duration get age => DateTime.now().difference(cachedAt);
  // Higher priority means more likely to keep during cleanup
  double get retentionPriority {
    final freshness = (1.0 / (1 + age.inHours));
    final usage = (accessCount).toDouble();
    return freshness * 0.7 + usage * 0.05 + (isExpired ? -1.0 : 0.0);
  }
}
