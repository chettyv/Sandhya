import 'package:flutter/material.dart';

import '../models/scripture_collection.dart';

class CollectionCard extends StatelessWidget {
  const CollectionCard({
    super.key,
    required this.collection,
    this.progress,
    this.onTap,
  });

  final ScriptureCollection collection;
  final double? progress; // optional 0..1
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(collection.title,
                            style: theme.textTheme.titleMedium),
                        const SizedBox(height: 6),
                        Text(
                          collection.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Icon(Icons.collections_bookmark, color: cs.primary),
                ],
              ),
              const SizedBox(height: 12),
              if (progress != null) ...[
                LinearProgressIndicator(
                  value: progress!.clamp(0, 1),
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(8),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${collection.referenceIds.length} scriptures',
                      style: theme.textTheme.labelMedium,
                    ),
                    Text(
                      '${collection.estimatedMinutesTotal} min total',
                      style: theme.textTheme.labelMedium,
                    ),
                  ],
                ),
              ] else ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${collection.referenceIds.length} scriptures',
                      style: theme.textTheme.labelMedium,
                    ),
                    Text(
                      '${collection.estimatedMinutesTotal} min total',
                      style: theme.textTheme.labelMedium,
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
