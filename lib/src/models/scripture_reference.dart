import 'package:freezed_annotation/freezed_annotation.dart';

part 'scripture_reference.freezed.dart';
part 'scripture_reference.g.dart';

/// Sources of scriptures within the library.
enum ScriptureSource {
  bhagavadGita,
  upanishads,
  vedas,
  puranas,
  mantra,
  other,
}

/// Difficulty levels for reading/understanding.
enum DifficultyLevel {
  beginner,
  intermediate,
  advanced,
}

@freezed
class ScriptureReference with _$ScriptureReference {
  const factory ScriptureReference({
    /// Unique ID of this reference entry. By default we use the verseId.
    required String id,

    /// ID of the corresponding DailyVerse content.
    required String verseId,

    /// Short title for display in library cards.
    required String title,

    /// Canonical source grouping (e.g., Bhagavad Gita, Upanishads).
    required ScriptureSource source,

    /// Topic tags for browsing and search.
    @Default(<String>[]) List<String> tags,

    /// Suggested difficulty level for readers.
    @Default(DifficultyLevel.beginner) DifficultyLevel difficulty,

    /// Estimated time to read/reflect, in minutes.
    @Default(10) int estimatedMinutes,
  }) = _ScriptureReference;

  factory ScriptureReference.fromJson(Map<String, dynamic> json) =>
      _$ScriptureReferenceFromJson(json);
}

extension ScriptureReferenceListX on List<ScriptureReference> {
  List<ScriptureReference> filterBySource(Set<ScriptureSource> sources) {
    if (sources.isEmpty) return this;
    return where((e) => sources.contains(e.source)).toList();
  }

  List<ScriptureReference> filterByTags(Set<String> tags) {
    if (tags.isEmpty) return this;
    return where((e) => e.tags.any(tags.contains)).toList();
  }

  List<ScriptureReference> filterByDifficulty(
      Set<DifficultyLevel> levels) {
    if (levels.isEmpty) return this;
    return where((e) => levels.contains(e.difficulty)).toList();
  }

  List<ScriptureReference> sortByTitle() {
    final list = [...this];
    list.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
    return list;
  }

  List<ScriptureReference> sortByEstimatedMinutes({bool ascending = true}) {
    final list = [...this];
    list.sort((a, b) => ascending
        ? a.estimatedMinutes.compareTo(b.estimatedMinutes)
        : b.estimatedMinutes.compareTo(a.estimatedMinutes));
    return list;
  }

  List<ScriptureReference> search(String query) {
    if (query.trim().isEmpty) return this;
    final q = query.toLowerCase();
    return where((e) =>
        e.title.toLowerCase().contains(q) ||
        e.tags.any((t) => t.toLowerCase().contains(q)) ||
        e.verseId.toLowerCase().contains(q)).toList();
  }
}

