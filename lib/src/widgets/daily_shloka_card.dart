import 'package:flutter/material.dart';

import '../models/daily_verse.dart';
import '../core/locale_utils.dart';

class DailyShlokaCard extends StatefulWidget {
  const DailyShlokaCard({
    super.key,
    required this.verse,
    this.onBookmarkToggle,
  });

  final DailyVerse verse;
  final ValueChanged<bool>? onBookmarkToggle;

  @override
  State<DailyShlokaCard> createState() => _DailyShlokaCardState();
}

class _DailyShlokaCardState extends State<DailyShlokaCard> {
  bool _bookmarked = false;

  void _toggleBookmark() {
    setState(() => _bookmarked = !_bookmarked);
    widget.onBookmarkToggle?.call(_bookmarked);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;
    final locale = Localizations.maybeLocaleOf(context) ?? const Locale('en');
    final translation = verseTranslationForLocale(widget.verse, locale);
    final showTransliteration =
        widget.verse.transliteration != null && !isDevanagariLanguage(locale);

    return Card(
      color: colors.primaryContainer,
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Today\'s Shloka',
                        style: theme.textTheme.labelMedium?.copyWith(
                          color: colors.onPrimaryContainer.withOpacity(0.7),
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        widget.verse.title,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          color: colors.onPrimaryContainer,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  tooltip: _bookmarked ? 'Remove bookmark' : 'Bookmark shloka',
                  onPressed: _toggleBookmark,
                  icon: Icon(
                    _bookmarked ? Icons.bookmark : Icons.bookmark_border,
                    color: colors.onPrimaryContainer,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              widget.verse.scripture,
              style: theme.textTheme.titleMedium?.copyWith(
                color: colors.onPrimaryContainer,
                height: 1.4,
              ),
            ),
            if (showTransliteration) ...[
              const SizedBox(height: 12),
              Text(
                'Transliteration',
                style: theme.textTheme.labelSmall?.copyWith(
                  color: colors.onPrimaryContainer.withOpacity(0.7),
                  letterSpacing: 0.6,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                widget.verse.transliteration!,
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: colors.onPrimaryContainer.withOpacity(0.85),
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
            if (translation != null) ...[
              const SizedBox(height: 12),
              Text(
                translation,
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: colors.onPrimaryContainer.withOpacity(0.86),
                ),
              ),
            ],
            const SizedBox(height: 16),
            Text(
              widget.verse.reference,
              style: theme.textTheme.labelLarge?.copyWith(
                color: colors.primary,
                letterSpacing: 0.8,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
