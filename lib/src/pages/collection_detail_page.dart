import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/scripture_library_provider.dart';
import '../models/scripture_collection.dart';
import '../models/scripture_reference.dart';

class CollectionDetailPage extends ConsumerWidget {
  const CollectionDetailPage({super.key, required this.collectionId});

  final String collectionId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final collection = ref.watch(collectionByIdProvider(collectionId));
    if (collection == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Collection')),
        body: const Center(child: Text('Collection not found')),
      );
    }

    final references = ref.watch(scriptureReferencesProvider);
    final byId = {for (final r in references) r.id: r};
    final refs = <ScriptureReference>[
      for (final id in collection.referenceIds)
        if (byId[id] != null) byId[id]!,
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(collection.title),
        actions: const [],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(collection.description, style: Theme.of(context).textTheme.bodyLarge),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [
                Chip(label: Text('${collection.referenceIds.length} scriptures')),
                Chip(label: Text('${collection.estimatedMinutesTotal} min total')),
                Chip(label: Text(_collectionTypeLabel(collection.type))),
              ],
            ),
            const SizedBox(height: 24),
            Text('Scriptures', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ListView.separated(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: refs.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final item = refs[index];
                return Card(
                  child: ListTile(
                    title: Text(item.title),
                    subtitle: Text(_sourceLabel(item.source)),
                    trailing: Text('${item.estimatedMinutes}m'),
                    onTap: () =>
                        Navigator.of(context).pushNamed('/scripture/${item.verseId}'),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  static String _collectionTypeLabel(CollectionType t) {
    switch (t) {
      case CollectionType.topical:
        return 'Topical';
      case CollectionType.sourceBased:
        return 'Source-based';
      case CollectionType.difficultyBased:
        return 'Difficulty';
    }
  }

  static String _sourceLabel(ScriptureSource s) {
    switch (s) {
      case ScriptureSource.bhagavadGita:
        return 'Bhagavad Gita';
      case ScriptureSource.upanishads:
        return 'Upanishads';
      case ScriptureSource.vedas:
        return 'Vedas';
      case ScriptureSource.puranas:
        return 'Puranas';
      case ScriptureSource.mantra:
        return 'Mantra';
      case ScriptureSource.other:
        return 'Scripture';
    }
  }
}
