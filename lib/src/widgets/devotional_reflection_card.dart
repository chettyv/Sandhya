import 'package:flutter/material.dart';

import '../models/daily_verse.dart';

/// Presents devotional reflections that pair with the day's shloka.
class DevotionalReflectionCard extends StatelessWidget {
  const DevotionalReflectionCard({
    super.key,
    required this.verse,
  });

  final DailyVerse verse;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    final title = verse.devotionalTitle;
    final reflection = verse.devotionalReflection;

    if (title == null && reflection == null) {
      return const SizedBox.shrink();
    }

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      color: colors.surface,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title ?? 'Devotional Reflection',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
                color: colors.primary,
              ),
            ),
            if (reflection != null) ...[
              const SizedBox(height: 12),
              Text(
                reflection,
                style: theme.textTheme.bodyLarge?.copyWith(height: 1.5),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
