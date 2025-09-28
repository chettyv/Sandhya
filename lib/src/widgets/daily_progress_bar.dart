import 'dart:math' as math;

import 'package:flutter/material.dart';

class DailyProgressSegment {
  const DailyProgressSegment({
    required this.value,
    required this.label,
    this.color,
  }) : assert(value >= 0 && value <= 1, 'Segment values must be 0-1.');

  final double value;
  final String label;
  final Color? color;
}

/// Horizontal progress indicator highlighting multiple daily practices.
class DailyProgressBar extends StatelessWidget {
  const DailyProgressBar({
    super.key,
    required this.progress,
    this.segments = const <DailyProgressSegment>[],
  }) : assert(progress >= 0 && progress <= 1,
            'Progress must be between 0 and 1.');

  final double progress;
  final List<DailyProgressSegment> segments;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    return Semantics(
      label: 'Daily practice progress ${(progress * 100).round()} percent',
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: [
              colors.primaryContainer.withOpacity(0.9),
              colors.primary.withOpacity(0.9),
            ],
          ),
          boxShadow: [
            BoxShadow(
              color: colors.shadow.withOpacity(0.06),
              blurRadius: 16,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Daily Progress',
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: colors.onPrimaryContainer,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  '${(progress * 100).clamp(0, 100).round()}%',
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: colors.onPrimaryContainer,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final width = constraints.maxWidth;
                  final effectiveProgress = width * progress;

                  return Stack(
                    children: [
                      Container(
                        height: 16,
                        width: width,
                        color: colors.onPrimary.withOpacity(0.15),
                      ),
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 400),
                        curve: Curves.easeOut,
                        height: 16,
                        width: math.max(6, effectiveProgress),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              colors.primary,
                              colors.secondary,
                            ],
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
            if (segments.isNotEmpty) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: segments.map((segment) {
                  final color = segment.color ?? colors.secondaryContainer;
                  return _ProgressChip(
                    label: segment.label,
                    value: segment.value,
                    color: color,
                    onColor: _onColorFor(color, colors),
                  );
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _onColorFor(Color base, ColorScheme scheme) {
    final luminance = base.computeLuminance();
    return luminance > 0.5 ? scheme.onPrimaryContainer : scheme.onPrimary;
  }
}

class _ProgressChip extends StatelessWidget {
  const _ProgressChip({
    required this.label,
    required this.value,
    required this.color,
    required this.onColor,
  });

  final String label;
  final double value;
  final Color color;
  final Color onColor;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Chip(
      backgroundColor: color,
      label: Text(
        '${(value * 100).round()}% $label',
        style: theme.textTheme.labelSmall?.copyWith(
          color: onColor,
          fontWeight: FontWeight.w600,
        ),
      ),
      visualDensity: VisualDensity.compact,
    );
  }
}
