import 'package:freezed_annotation/freezed_annotation.dart';

part 'scripture_collection.freezed.dart';
part 'scripture_collection.g.dart';

enum CollectionType {
  topical,
  sourceBased,
  difficultyBased,
}

@freezed
class ScriptureCollection with _$ScriptureCollection {
  const factory ScriptureCollection({
    required String id,
    required String title,
    required String description,
    required CollectionType type,
    @Default(<String>[]) List<String> referenceIds,
    /// Estimated minutes to complete the collection (sum of entries).
    @Default(0) int estimatedMinutesTotal,
  }) = _ScriptureCollection;

  factory ScriptureCollection.fromJson(Map<String, dynamic> json) =>
      _$ScriptureCollectionFromJson(json);
}

extension ScriptureCollectionX on ScriptureCollection {
  int completedCount(Set<String> completedReferenceIds) {
    return referenceIds.where(completedReferenceIds.contains).length;
  }

  bool isCompleted(Set<String> completedReferenceIds) {
    return completedCount(completedReferenceIds) >= referenceIds.length &&
        referenceIds.isNotEmpty;
  }

  double progressPercent(Set<String> completedReferenceIds) {
    if (referenceIds.isEmpty) return 0;
    return completedCount(completedReferenceIds) / referenceIds.length;
  }
}

