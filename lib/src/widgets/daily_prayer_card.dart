import 'package:flutter/material.dart';

import '../models/daily_verse.dart';

class DailyPrayerCard extends StatefulWidget {
  const DailyPrayerCard({
    super.key,
    required this.verse,
    this.onCompleted,
    this.completed,
    this.showActionButton = true,
  });

  final DailyVerse verse;
  final ValueChanged<bool>? onCompleted;
  final bool? completed;
  final bool showActionButton;

  @override
  State<DailyPrayerCard> createState() => _DailyPrayerCardState();
}

class _DailyPrayerCardState extends State<DailyPrayerCard> {
  bool _completed = false;

  void _toggleCompletion() {
    setState(() => _completed = !_completed);
    widget.onCompleted?.call(_completed);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;
    final effectiveCompleted = widget.completed ?? _completed;
    final title = widget.verse.prayerTitle ?? 'Daily Prayer';
    final text = widget.verse.prayerText;

    if (text == null || text.trim().isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: effectiveCompleted
                        ? colors.primaryContainer
                        : colors.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        effectiveCompleted
                            ? Icons.check_circle
                            : Icons.radio_button_unchecked,
                        color: colors.primary,
                        size: 16,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        effectiveCompleted ? 'Done' : 'Pending',
                        style: theme.textTheme.labelSmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              text,
              style: theme.textTheme.bodyLarge?.copyWith(height: 1.5),
            ),
            if (widget.showActionButton) ...[
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: _toggleCompletion,
                icon: Icon(
                    effectiveCompleted ? Icons.refresh : Icons.self_improvement),
                label: Text(
                    effectiveCompleted ? 'Mark as not done' : 'Mark as done'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
