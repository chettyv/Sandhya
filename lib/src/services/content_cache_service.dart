import 'dart:convert';
import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/cached_content.dart';
import '../models/daily_verse.dart';

class ContentCacheService {
  static const _indexKey = 'content_cache_index_v1';
  static const int defaultMaxBytes = 50 * 1024 * 1024; // 50 MB

  ContentCacheService({this.maxBytes = defaultMaxBytes});

  final int maxBytes;

  Future<Directory> _rootDir() async {
    final dir = await getApplicationDocumentsDirectory();
    final root = Directory('${dir.path}/content_cache');
    if (!await root.exists()) await root.create(recursive: true);
    final verseDir = Directory('${root.path}/verses');
    if (!await verseDir.exists()) await verseDir.create(recursive: true);
    return root;
  }

  Future<File> _fileForVerse(String verseId) async {
    final root = await _rootDir();
    final safe = verseId.replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
    return File('${root.path}/verses/$safe.json');
  }

  Future<List<CachedContent>> _loadIndex() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_indexKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      final list = (jsonDecode(raw) as List)
          .cast<Map<String, dynamic>>()
          .map(CachedContent.fromJson)
          .toList();
      return list;
    } catch (_) {
      return [];
    }
  }

  Future<void> _saveIndex(List<CachedContent> items) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
        _indexKey, jsonEncode(items.map((e) => e.toJson()).toList()));
  }

  Future<int> _currentSizeBytes(List<CachedContent>? idx) async {
    final items = idx ?? await _loadIndex();
    return items.fold<int>(0, (sum, e) => sum + e.fileSize);
  }

  Future<void> _evictIfNeeded(List<CachedContent> index) async {
    var size = await _currentSizeBytes(index);
    if (size <= maxBytes) return;
    index.sort((a, b) => a.retentionPriority.compareTo(b.retentionPriority));
    // Evict until within limit
    while (size > maxBytes && index.isNotEmpty) {
      final victim = index.removeAt(0);
      try {
        final file = await _fileForVerse(victim.verseId);
        if (await file.exists()) {
          final st = await file.stat();
          await file.delete();
          size -= st.size;
        }
      } catch (_) {}
    }
    await _saveIndex(index);
  }

  Future<void> clearExpiredCache() async {
    final index = await _loadIndex();
    index.removeWhere((e) => e.isExpired);
    // Also delete files for expired entries
    for (final e in List<CachedContent>.from(index)) {
      if (e.isExpired) {
        try {
          final f = await _fileForVerse(e.verseId);
          if (await f.exists()) await f.delete();
        } catch (_) {}
      }
    }
    await _saveIndex(index);
  }

  Future<CachedContent?> _findMeta(
      String verseId, List<CachedContent> idx) async {
    try {
      return idx.firstWhere((e) => e.verseId == verseId);
    } catch (_) {
      return null;
    }
  }

  Future<void> cacheVerse(DailyVerse verse,
      {CacheSource source = CacheSource.embedded, Duration? ttl}) async {
    final file = await _fileForVerse(verse.id);
    final payload = jsonEncode(verse.toJson());
    await file.writeAsString(payload, flush: true);
    final bytes = await file.length();

    final index = await _loadIndex();
    final existing = await _findMeta(verse.id, index);
    final updated = CachedContent(
      verseId: verse.id,
      cachedAt: DateTime.now(),
      expiresAt: ttl == null ? null : DateTime.now().add(ttl),
      cacheSource: source,
      accessCount: (existing?.accessCount ?? 0),
      fileSize: bytes,
    );
    if (existing != null) {
      index[index.indexOf(existing)] = updated;
    } else {
      index.add(updated);
    }
    await _evictIfNeeded(index);
    await _saveIndex(index);
  }

  Future<DailyVerse?> getCachedVerse(String verseId) async {
    final index = await _loadIndex();
    final meta = await _findMeta(verseId, index);
    if (meta == null || meta.isExpired) return null;
    final file = await _fileForVerse(verseId);
    if (!await file.exists()) return null;
    try {
      final raw = await file.readAsString();
      final map = jsonDecode(raw) as Map<String, dynamic>;
      // Touch access count
      final touched = meta.copyWith(accessCount: meta.accessCount + 1);
      index[index.indexOf(meta)] = touched;
      await _saveIndex(index);
      return DailyVerse.fromJson(map);
    } catch (_) {
      return null;
    }
  }

  Future<List<DailyVerse>> getCachedVerses(List<String> ids) async {
    final out = <DailyVerse>[];
    for (final id in ids) {
      final v = await getCachedVerse(id);
      if (v != null) out.add(v);
    }
    return out;
  }

  Future<List<CachedContent>> getAllMetadata() => _loadIndex();

  Future<void> removeVerse(String verseId) async {
    final index = await _loadIndex();
    index.removeWhere((e) => e.verseId == verseId);
    await _saveIndex(index);
    try {
      final f = await _fileForVerse(verseId);
      if (await f.exists()) await f.delete();
    } catch (_) {}
  }

  Future<void> preloadEssentialContent(List<DailyVerse> verses) async {
    for (final v in verses) {
      await cacheVerse(v, source: CacheSource.personalized);
    }
  }
}

final contentCacheServiceProvider = Provider<ContentCacheService>((ref) {
  return ContentCacheService();
});
