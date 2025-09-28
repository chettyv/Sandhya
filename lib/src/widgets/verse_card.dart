import 'package:flutter/material.dart';

import '../models/daily_verse.dart';
import '../core/locale_utils.dart';

class VerseCard extends StatelessWidget {
  const VerseCard({super.key, required this.verse, this.highlight = false});

  final DailyVerse verse;
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final locale = Localizations.maybeLocaleOf(context) ?? const Locale('en');

    final cardColor =
        highlight ? colorScheme.primaryContainer : theme.cardColor;

    return Card(
      color: cardColor,
      elevation: highlight ? 2 : 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (highlight)
              Text(
                'Daily Focus',
                style: theme.textTheme.labelSmall
                    ?.copyWith(color: colorScheme.onPrimaryContainer),
              ),
            Text(
              verse.title,
              style: theme.textTheme.titleLarge
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              verse.scripture,
              style: theme.textTheme.bodyLarge,
            ),
            const SizedBox(height: 12),
            Text(
              verse.reference,
              style: theme.textTheme.labelLarge?.copyWith(
                color: colorScheme.primary,
                letterSpacing: 0.6,
              ),
            ),
            if (verseTranslationForLocale(verse, locale) case final commentary?) ...[
              const SizedBox(height: 12),
              Text(
                commentary,
                style: theme.textTheme.bodyMedium,
              ),
            ],
            const SizedBox(height: 8),
            Text(
              'Recommended meditation: ${verse.recommendedMeditationMinutes} minutes',
              style: theme.textTheme.labelMedium?.copyWith(
                color: colorScheme.secondary,
              ),
            ),
            if (highlight) ...[
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: () {
                  final scaffoldMessenger = ScaffoldMessenger.of(context);
                  scaffoldMessenger.showSnackBar(
                    const SnackBar(
                        content: Text('Streak tracking coming soon!')),
                  );
                },
                icon: const Icon(Icons.auto_awesome),
                label: const Text('Begin today\'s practice'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
