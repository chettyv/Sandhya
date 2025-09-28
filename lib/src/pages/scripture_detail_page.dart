import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/scripture_reference.dart';
import '../providers/scripture_library_provider.dart';
import '../widgets/verse_card.dart';

class ScriptureDetailPage extends ConsumerWidget {
  const ScriptureDetailPage({super.key, required this.verseId});

  final String verseId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final verse = ref.watch(resolveVerseProvider(verseId));
    final references = ref.watch(scriptureReferencesProvider);
    final reference = references.firstWhere(
      (r) => r.verseId == verseId,
      orElse: () => references.first,
    );
    final related = references
        .where((r) => r.source == reference.source && r.verseId != verseId)
        .take(4)
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(reference.title),
        actions: [
          IconButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Bookmark coming soon')),
              );
            },
            icon: const Icon(Icons.bookmark_add_outlined),
            tooltip: 'Bookmark',
          ),
          IconButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Share coming soon')),
              );
            },
            icon: const Icon(Icons.ios_share),
            tooltip: 'Share',
          ),
        ],
      ),
      body: verse == null
          ? const Center(child: Text('Verse not found'))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  VerseCard(verse: verse),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    runSpacing: -8,
                    children: [
                      _InfoChip(
                          icon: Icons.menu_book,
                          label: _sourceLabel(reference.source)),
                      _InfoChip(
                          icon: Icons.timer,
                          label: '${reference.estimatedMinutes} min'),
                      _InfoChip(
                          icon: Icons.bolt,
                          label: reference.difficulty.name),
                      for (final t in reference.tags) _InfoChip(label: t),
                    ],
                  ),
                  const SizedBox(height: 24),
                  if (related.isNotEmpty) ...[
                    Text('Related', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 8),
                    Column(
                      children: [
                        for (final r in related)
                          ListTile(
                            contentPadding:
                                const EdgeInsets.symmetric(horizontal: 4),
                            leading: const Icon(Icons.chevron_right),
                            title: Text(r.title),
                            subtitle: Text(_sourceLabel(r.source)),
                            onTap: () {
                              Navigator.of(context)
                                  .pushReplacementNamed('/scripture/${r.verseId}');
                            },
                          ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
    );
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

class _InfoChip extends StatelessWidget {
  const _InfoChip({this.icon, required this.label});
  final IconData? icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 14),
            const SizedBox(width: 4),
          ],
          Text(label),
        ],
      ),
      visualDensity: VisualDensity.compact,
    );
  }
}

