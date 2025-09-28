import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/scripture_library_data.dart';
import '../models/scripture_collection.dart';
import '../models/scripture_reference.dart';
import '../providers/daily_content_provider.dart';
import '../models/daily_verse.dart';

// Base providers for data
final scriptureReferencesProvider =
    Provider<List<ScriptureReference>>((ref) => scriptureReferences);

final scriptureCollectionsProvider =
    Provider<List<ScriptureCollection>>((ref) => scriptureCollections);

/// Lookup a collection by ID
final collectionByIdProvider =
    Provider.family<ScriptureCollection?, String>((ref, id) {
  final cols = ref.watch(scriptureCollectionsProvider);
  for (final c in cols) {
    if (c.id == id) return c;
  }
  return null;
});

// Map of verse ID -> DailyVerse for quick resolution
final verseByIdProvider = Provider<Map<String, DailyVerse>>((ref) {
  final verses = ref.watch(verseFeedProvider);
  return {for (final v in verses) v.id: v};
});

final resolveVerseProvider = Provider.family<DailyVerse?, String>((ref, id) {
  final map = ref.watch(verseByIdProvider);
  return map[id];
});

// Simple feature picks
final featuredCollectionsProvider = Provider<List<ScriptureCollection>>((ref) {
  final cols = ref.watch(scriptureCollectionsProvider);
  // Choose top 2 by size as featured
  final sorted = [...cols]
    ..sort((a, b) => b.referenceIds.length.compareTo(a.referenceIds.length));
  return sorted.take(2).toList();
});

// Browsing state (search + filters)
final librarySearchQueryProvider = StateProvider<String>((ref) => '');
final librarySelectedSourcesProvider =
    StateProvider<Set<ScriptureSource>>((ref) => <ScriptureSource>{});
final librarySelectedDifficultiesProvider =
    StateProvider<Set<DifficultyLevel>>((ref) => <DifficultyLevel>{});
final librarySelectedTagsProvider =
    StateProvider<Set<String>>((ref) => <String>{});

final filteredScripturesProvider = Provider<List<ScriptureReference>>((ref) {
  final all = ref.watch(scriptureReferencesProvider);
  final query = ref.watch(librarySearchQueryProvider);
  final sources = ref.watch(librarySelectedSourcesProvider);
  final diffs = ref.watch(librarySelectedDifficultiesProvider);
  final tags = ref.watch(librarySelectedTagsProvider);

  var items = all
      .filterBySource(sources)
      .filterByDifficulty(diffs)
      .filterByTags(tags)
      .search(query)
      .sortByTitle();
  return items;
});

// Group by source and difficulty for quick UI sections
final scripturesBySourceProvider =
    Provider<Map<ScriptureSource, List<ScriptureReference>>>((ref) {
  final all = ref.watch(scriptureReferencesProvider);
  final map = <ScriptureSource, List<ScriptureReference>>{};
  for (final r in all) {
    map.putIfAbsent(r.source, () => []).add(r);
  }
  for (final e in map.entries) {
    e.value.sort((a, b) => a.title.compareTo(b.title));
  }
  return map;
});

class RecentScripturesNotifier extends StateNotifier<List<String>> {
  RecentScripturesNotifier() : super(const []);

  void add(String verseId) {
    final list = [...state];
    list.remove(verseId);
    list.insert(0, verseId);
    if (list.length > 10) list.removeLast();
    state = list;
  }
}

final recentScripturesProvider =
    StateNotifierProvider<RecentScripturesNotifier, List<String>>(
        (ref) => RecentScripturesNotifier());
