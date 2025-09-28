import 'package:flutter/material.dart';

import '../models/reading_plan.dart';

class ReadingPlanCard extends StatelessWidget {
  const ReadingPlanCard({
    super.key,
    required this.plan,
    this.progress = 0,
    this.onPrimaryAction,
    this.primaryActionLabel,
  });

  final ReadingPlan plan;
  final double progress; // 0..1
  final VoidCallback? onPrimaryAction;
  final String? primaryActionLabel;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    String difficultyLabel() => plan.difficulty.name;

    return Card(
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
                      Text(plan.title, style: theme.textTheme.titleMedium),
                      const SizedBox(height: 6),
                      Text(
                        plan.description,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Icon(Icons.auto_stories, color: theme.colorScheme.primary),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [
                Chip(
                  label: Text('${plan.durationDays} days'),
                  visualDensity: VisualDensity.compact,
                ),
                Chip(
                  label: Text('${plan.estimatedDailyMinutes} min/day'),
                  visualDensity: VisualDensity.compact,
                ),
                Chip(
                  label: Text(difficultyLabel()),
                  visualDensity: VisualDensity.compact,
                ),
              ],
            ),
            const SizedBox(height: 10),
            LinearProgressIndicator(
              value: progress.clamp(0, 1),
              minHeight: 6,
              borderRadius: BorderRadius.circular(8),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${(progress * 100).round()}% complete',
                    style: theme.textTheme.labelMedium),
                if (onPrimaryAction != null)
                  FilledButton(
                    onPressed: onPrimaryAction,
                    child: Text(primaryActionLabel ?? 'Start'),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

