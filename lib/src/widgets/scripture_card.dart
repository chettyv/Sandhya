import 'package:flutter/material.dart';

import '../models/scripture_reference.dart';

class ScriptureCard extends StatelessWidget {
  const ScriptureCard({
    super.key,
    required this.reference,
    this.onTap,
    this.completed = false,
  });

  final ScriptureReference reference;
  final VoidCallback? onTap;
  final bool completed;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    Color badgeColor(DifficultyLevel d) {
      switch (d) {
        case DifficultyLevel.beginner:
          return cs.tertiaryContainer;
        case DifficultyLevel.intermediate:
          return cs.secondaryContainer;
        case DifficultyLevel.advanced:
          return cs.errorContainer;
      }
    }

    String sourceLabel(ScriptureSource s) {
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

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      reference.title,
                      style: theme.textTheme.titleMedium,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (completed)
                    Icon(Icons.check_circle, color: cs.primary, size: 20),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                sourceLabel(reference.source),
                style:
                    theme.textTheme.labelLarge?.copyWith(color: cs.primary),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: -8,
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: badgeColor(reference.difficulty),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      reference.difficulty.name,
                      style: theme.textTheme.labelSmall,
                    ),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: cs.secondaryContainer,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '${reference.estimatedMinutes} min',
                      style: theme.textTheme.labelSmall,
                    ),
                  ),
                  for (final t in reference.tags.take(3))
                    Chip(
                      label: Text(t),
                      visualDensity: VisualDensity.compact,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      labelStyle: theme.textTheme.labelSmall,
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

