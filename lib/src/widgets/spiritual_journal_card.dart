import 'package:flutter/material.dart';

import '../models/daily_verse.dart';

class SpiritualJournalCard extends StatefulWidget {
  const SpiritualJournalCard({
    super.key,
    required this.verse,
    this.onSubmit,
    this.saved,
    this.compact = false,
  });

  final DailyVerse verse;
  final ValueChanged<String>? onSubmit;
  final bool? saved;
  final bool compact;

  @override
  State<SpiritualJournalCard> createState() => _SpiritualJournalCardState();
}

class _SpiritualJournalCardState extends State<SpiritualJournalCard> {
  late final TextEditingController _controller;
  late final FocusNode _focusNode;
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _focusNode = FocusNode();
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    final text = _controller.text.trim();
    if (text.isEmpty) {
      _focusNode.requestFocus();
      return;
    }
    widget.onSubmit?.call(text);
    setState(() {
      _saved = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;
    final effectiveSaved = widget.saved ?? _saved;

    final prompt = widget.verse.journalPrompt;

    if (prompt == null || prompt.trim().isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      color: colors.tertiaryContainer.withOpacity(0.3),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Spiritual Journal',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
                color: colors.primary,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              prompt,
              style: theme.textTheme.bodyLarge?.copyWith(height: 1.5),
            ),
            const SizedBox(height: 16),
            if (!widget.compact) ...[
              TextField(
                controller: _controller,
                focusNode: _focusNode,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Your reflection',
                  filled: true,
                  fillColor: colors.surface,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  FilledButton(
                    onPressed: _handleSubmit,
                    child: const Text('Save reflection'),
                  ),
                  const SizedBox(width: 12),
                  if (effectiveSaved)
                    Icon(
                      Icons.check_circle,
                      color: colors.primary,
                    ),
                ],
              ),
            ] else ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(
                    effectiveSaved ? Icons.check_circle : Icons.edit,
                    color: effectiveSaved ? colors.primary : colors.onSurface,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    effectiveSaved
                        ? 'Reflection saved'
                        : 'Tap to write your reflection',
                    style: theme.textTheme.bodyMedium,
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
