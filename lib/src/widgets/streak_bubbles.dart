import 'package:flutter/material.dart';

/// Visualizes a 7-day streak with labelled bubbles.
class StreakBubbles extends StatelessWidget {
  const StreakBubbles({
    super.key,
    required this.completionStatus,
    this.currentDayIndex,
  }) : assert(completionStatus.length == 7, 'Requires exactly 7 entries.');

  /// Completion status from Sunday (index 0) through Saturday (index 6).
  final List<bool> completionStatus;

  /// Index of the current day; defaults to DateTime.now().weekday handling.
  final int? currentDayIndex;

  int get _resolvedCurrentDayIndex {
    final provided = currentDayIndex;
    if (provided != null && provided >= 0 && provided < 7) {
      return provided;
    }
    final weekday = DateTime.now().weekday % 7; // Flutter weekday uses 1-7.
    return weekday;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final resolvedIndex = _resolvedCurrentDayIndex;

    return LayoutBuilder(
      builder: (context, constraints) {
        final maxWidth = constraints.maxWidth;
        const spacing = 12.0;
        final bubbleDiameter = (maxWidth - spacing * 6) / 7;
        final bubbleSize = bubbleDiameter.clamp(40.0, 56.0);

        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(7, (index) {
            final isComplete = completionStatus[index];
            final isCurrentDay = index == resolvedIndex;
            final background = isComplete
                ? colorScheme.primary
                : colorScheme.surfaceContainerHighest;
            final foreground = isComplete
                ? colorScheme.onPrimary
                : colorScheme.onSurfaceVariant;
            final borderColor =
                isCurrentDay ? colorScheme.primary : colorScheme.outlineVariant;
            final label = _weekdayLabel(index);

            return AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeInOut,
              width: bubbleSize,
              height: bubbleSize,
              decoration: BoxDecoration(
                color: isCurrentDay && !isComplete
                    ? colorScheme.primaryContainer
                    : background,
                borderRadius: BorderRadius.circular(bubbleSize / 2),
                border: Border.all(
                  color: borderColor,
                  width: isCurrentDay ? 3 : 1,
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                label,
                style: theme.textTheme.labelLarge?.copyWith(
                  color: isCurrentDay && !isComplete
                      ? colorScheme.onPrimaryContainer
                      : foreground,
                  fontWeight: isCurrentDay ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
            );
          }),
        );
      },
    );
  }

  String _weekdayLabel(int index) {
    switch (index) {
      case 0:
        return 'S';
      case 1:
        return 'M';
      case 2:
        return 'T';
      case 3:
        return 'W';
      case 4:
        return 'T';
      case 5:
        return 'F';
      case 6:
        return 'S';
      default:
        return '';
    }
  }
}
