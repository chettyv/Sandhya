import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/scripture_reference.dart';
import '../providers/scripture_library_provider.dart';
import '../providers/reading_plan_provider.dart';
// Collections are purely for browsing; no progress tracking needed.
import '../widgets/scripture_card.dart';
import '../widgets/collection_card.dart';
import '../widgets/reading_plan_card.dart';
import '../models/reading_plan.dart';

// Uses app-wide Material 3 theme configured in AppTheme via MaterialApp

class ExplorePage extends ConsumerWidget {
  const ExplorePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final query = ref.watch(librarySearchQueryProvider);
    final filtered = ref.watch(filteredScripturesProvider);
    final collections = ref.watch(scriptureCollectionsProvider);
    final plans = ref.watch(readingPlansProvider);
    final progressMap = ref.watch(planProgressProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _SearchBar(
                value: query,
                onChanged: (v) =>
                    ref.read(librarySearchQueryProvider.notifier).state = v,
              ),
              const SizedBox(height: 8),
              _Filters(),

              const SizedBox(height: 16),
              Text('Scripture Library',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              if (filtered.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Text('No scriptures match your filters.'),
                )
              else
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.2,
                  ),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final refItem = filtered[index];
                    return ScriptureCard(
                      reference: refItem,
                      onTap: () => Navigator.of(context)
                          .pushNamed('/scripture/${refItem.verseId}'),
                    );
                  },
                ),

              const SizedBox(height: 24),
              Text('Reading Plans',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: plans.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final plan = plans[index];
                  final completed =
                      progressMap[plan.id]?.completedDays.keys.toSet() ??
                          <int>{};
                  final pct = plan.progressPercent(completed);
                  final started = progressMap.containsKey(plan.id);
                  return ReadingPlanCard(
                    plan: plan,
                    progress: pct,
                    onPrimaryAction: () {
                      if (started) {
                        Navigator.of(context)
                            .pushNamed('/reading-plan/${plan.id}');
                      } else {
                        ref.read(planProgressProvider.notifier).startPlan(plan);
                      }
                    },
                    primaryActionLabel: started ? 'Continue' : 'Start',
                  );
                },
              ),

              const SizedBox(height: 24),
              Text('Collections', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: collections.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final col = collections[index];
                  return CollectionCard(
                    collection: col,
                    progress: null, // browsing-only; no progress meter
                    onTap: () {
                      Navigator.of(context)
                          .pushNamed('/collection/${col.id}');
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SearchBar extends StatelessWidget {
  const _SearchBar({required this.value, required this.onChanged});
  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: TextEditingController(text: value)
        ..selection = TextSelection.fromPosition(
            TextPosition(offset: value.length)),
      onChanged: onChanged,
      decoration: const InputDecoration(
        prefixIcon: Icon(Icons.search),
        hintText: 'Search scriptures, tags, references',
        border: OutlineInputBorder(),
      ),
    );
  }
}

class _Filters extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedSources = ref.watch(librarySelectedSourcesProvider);
    final selectedDiffs = ref.watch(librarySelectedDifficultiesProvider);

    FilterChip chip<T>({
      required String label,
      required bool selected,
      required VoidCallback onSelected,
    }) {
      return FilterChip(
        label: Text(label),
        selected: selected,
        onSelected: (_) => onSelected(),
      );
    }

    void toggleSource(ScriptureSource s) {
      final set = {...selectedSources};
      set.contains(s) ? set.remove(s) : set.add(s);
      ref.read(librarySelectedSourcesProvider.notifier).state = set;
    }

    void toggleDiff(DifficultyLevel d) {
      final set = {...selectedDiffs};
      set.contains(d) ? set.remove(d) : set.add(d);
      ref.read(librarySelectedDifficultiesProvider.notifier).state = set;
    }

    return Wrap(
      spacing: 8,
      runSpacing: -8,
      children: [
        chip(
          label: 'Bhagavad Gita',
          selected: selectedSources.contains(ScriptureSource.bhagavadGita),
          onSelected: () => toggleSource(ScriptureSource.bhagavadGita),
        ),
        chip(
          label: 'Upanishads',
          selected: selectedSources.contains(ScriptureSource.upanishads),
          onSelected: () => toggleSource(ScriptureSource.upanishads),
        ),
        chip(
          label: 'Mantras',
          selected: selectedSources.contains(ScriptureSource.mantra),
          onSelected: () => toggleSource(ScriptureSource.mantra),
        ),
        const SizedBox(width: 8),
        chip(
          label: 'Beginner',
          selected: selectedDiffs.contains(DifficultyLevel.beginner),
          onSelected: () => toggleDiff(DifficultyLevel.beginner),
        ),
        chip(
          label: 'Intermediate',
          selected: selectedDiffs.contains(DifficultyLevel.intermediate),
          onSelected: () => toggleDiff(DifficultyLevel.intermediate),
        ),
        chip(
          label: 'Advanced',
          selected: selectedDiffs.contains(DifficultyLevel.advanced),
          onSelected: () => toggleDiff(DifficultyLevel.advanced),
        ),
      ],
    );
  }
}
