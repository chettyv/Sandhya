import 'package:flutter/material.dart';

/// Displays the current streak count in a compact circular badge.
class CurrentStreakBubble extends StatelessWidget {
  const CurrentStreakBubble({
    super.key,
    required this.streakCount,
    this.onTap,
  });

  final int streakCount;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    final bubble = Container(
      width: 72,
      height: 72,
      decoration: BoxDecoration(
        color: colors.secondaryContainer,
        borderRadius: BorderRadius.circular(36),
        boxShadow: [
          BoxShadow(
            color: colors.shadow.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$streakCount',
            style: theme.textTheme.titleMedium?.copyWith(
              color: colors.onSecondaryContainer,
              fontWeight: FontWeight.bold,
              height: 1.0,
            ),
          ),
          Text(
            'streak',
            style: theme.textTheme.labelSmall?.copyWith(
              color: colors.onSecondaryContainer.withOpacity(0.8),
              letterSpacing: 0.6,
              height: 1.0,
            ),
          ),
        ],
      ),
    );

    return Semantics(
      label: 'Current streak $streakCount days',
      button: onTap != null,
      child: onTap != null
          ? InkWell(
              borderRadius: BorderRadius.circular(36),
              onTap: onTap,
              child: bubble,
            )
          : bubble,
    );
  }
}
