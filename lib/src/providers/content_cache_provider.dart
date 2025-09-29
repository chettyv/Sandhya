import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/cached_content.dart';
import '../models/daily_verse.dart';
import '../models/offline_status.dart';
import '../services/connectivity_service.dart';
import '../services/content_cache_service.dart';

final cachedIndexProvider = StateNotifierProvider<CachedIndexNotifier, List<CachedContent>>((ref) {
  return CachedIndexNotifier(ref);
});

class CachedIndexNotifier extends StateNotifier<List<CachedContent>> {
  CachedIndexNotifier(this.ref) : super(const []) {
    _refresh();
  }
  final Ref ref;

  Future<void> _refresh() async {
    final svc = ref.read(contentCacheServiceProvider);
    state = await svc.getAllMetadata();
  }

  Future<void> remove(String verseId) async {
    final svc = ref.read(contentCacheServiceProvider);
    await svc.removeVerse(verseId);
    await _refresh();
  }

  Future<void> clearExpired() async {
    final svc = ref.read(contentCacheServiceProvider);
    await svc.clearExpiredCache();
    await _refresh();
  }

  Future<void> cacheAll(List<DailyVerse> verses) async {
    final svc = ref.read(contentCacheServiceProvider);
    await svc.preloadEssentialContent(verses);
    await _refresh();
  }
}

final offlineStatusProvider = StreamProvider<OfflineStatus>((ref) async* {
  final conn = ref.watch(connectivityServiceProvider);
  Future<OfflineStatus> build() async {
    final online = conn.isOnline;
    final meta = ref.read(cachedIndexProvider);
    final hasAny = meta.isNotEmpty;
    final essentialCached = hasAny; // heuristic for now
    final cacheHealth = hasAny ? CacheHealth.partiallyCached : CacheHealth.noCache;
    return OfflineStatus(
      isOnline: online,
      lastOnlineAt: await conn.lastOnlineAt(),
      cacheStatus: essentialCached ? CacheHealth.partiallyCached : cacheHealth,
      essentialContentCached: essentialCached,
      totalCachedItems: meta.length,
    );
  }

  yield await build();
  await for (final _ in conn.onStatusChanged) {
    yield await build();
  }
});

final cachedVerseByIdProvider = FutureProvider.family<DailyVerse?, String>((ref, id) async {
  final svc = ref.read(contentCacheServiceProvider);
  return svc.getCachedVerse(id);
});

final cachePreloadNextFeaturedProvider = FutureProvider<void>((ref) async {
  // Placeholder: callers pass intended verses to preload via cacheAll() where needed.
});

