import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/reading_plan.dart';
import '../models/reading_plan_entry.dart';
import '../providers/reading_plan_provider.dart';
import '../providers/scripture_library_provider.dart';
import '../services/content_cache_service.dart';

class ReadingPlanDetailPage extends ConsumerWidget {
  const ReadingPlanDetailPage({super.key, required this.planId});

  final String planId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final plan = ref.watch(planByIdProvider(planId));
    final progress = ref.watch(planProgressForProvider(planId));
    final notifier = ref.read(planProgressProvider.notifier);

    if (plan == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Reading Plan')),
        body: const Center(child: Text('Plan not found')),
      );
    }

    final completedDays = progress?.completedDays.keys.toSet() ?? <int>{};
    final pct = plan.progressPercent(completedDays);
    final started = progress != null;
    final complete = plan.isComplete(completedDays);

    DateTime? estimatedCompletionDate() {
      if (!started) return null;
      final startedAt = progress!.startedAt;
      final remaining = plan.durationDays - completedDays.length;
      return startedAt.add(Duration(days: remaining));
    }

    return Scaffold(
      appBar: AppBar(title: Text(plan.title), actions: [
        IconButton(
          tooltip: 'Download plan',
          icon: const Icon(Icons.download_for_offline_outlined),
          onPressed: () async {
            final verses = [
              for (final e in plan.entries)
                if (ref.read(resolveVerseProvider(e.verseId)) case final v?) v,
            ];
            if (verses.isNotEmpty) {
              await ref.read(contentCacheServiceProvider).preloadEssentialContent(verses);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Plan cached for offline use')),
              );
            }
          },
        )
      ]),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(plan.description, style: Theme.of(context).textTheme.bodyLarge),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [
                Chip(label: Text('${plan.durationDays} days')),
                Chip(label: Text('${plan.estimatedDailyMinutes} min/day')),
                Chip(label: Text(plan.difficulty.name)),
              ],
            ),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: pct.clamp(0, 1),
              minHeight: 8,
              borderRadius: BorderRadius.circular(8),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${(pct * 100).round()}% complete',
                    style: Theme.of(context).textTheme.labelMedium),
                if (estimatedCompletionDate() case final d?)
                  Text('Est. completion: ${d.year}-${d.month}-${d.day}',
                      style: Theme.of(context).textTheme.labelMedium),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                if (!started)
                  FilledButton(
                    onPressed: () => notifier.startPlan(plan),
                    child: const Text('Start Plan'),
                  ),
                if (started && !complete) ...[
                  FilledButton(
                    onPressed: () {
                      final entry = ref.read(currentDayEntryProvider(planId));
                      if (entry != null) {
                        Navigator.of(context)
                            .pushNamed('/scripture/${entry.verseId}');
                      }
                    },
                    child: const Text('Continue'),
                  ),
                  const SizedBox(width: 8),
                ],
                if (complete)
                  OutlinedButton(
                    onPressed: () => notifier.resetPlan(plan.id),
                    child: const Text('Restart'),
                  ),
              ],
            ),
            const SizedBox(height: 24),
            Text('Daily Entries', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            _EntriesList(
              entries: plan.entries,
              completedDays: completedDays,
              onToggleComplete: (e) => notifier.markEntryCompleted(plan.id, e.dayNumber),
            ),
          ],
        ),
      ),
    );
  }
}

class _EntriesList extends StatelessWidget {
  const _EntriesList({
    required this.entries,
    required this.completedDays,
    required this.onToggleComplete,
  });

  final List<ReadingPlanEntry> entries;
  final Set<int> completedDays;
  final void Function(ReadingPlanEntry) onToggleComplete;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: entries.length,
      itemBuilder: (context, index) {
        final e = entries[index];
        final done = completedDays.contains(e.dayNumber);
        return Card(
          child: ListTile(
            title: Text('Day ${e.dayNumber}'),
            subtitle: Text(e.guidance ?? 'Daily study and reflection'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('${e.estimatedMinutes}m'),
                const SizedBox(width: 8),
                Icon(
                  done ? Icons.check_circle : Icons.radio_button_unchecked,
                  color: done ? Theme.of(context).colorScheme.primary : null,
                ),
              ],
            ),
            onTap: () {
              Navigator.of(context).pushNamed('/scripture/${e.verseId}');
            },
            onLongPress: () => onToggleComplete(e),
          ),
        );
      },
    );
  }
}
