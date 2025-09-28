import '../models/scripture_reference.dart';
import '../models/scripture_collection.dart';
import '../models/reading_plan.dart';
import '../models/reading_plan_entry.dart';

/// Scripture references categorize existing DailyVerse content by metadata.
/// IDs must match verse IDs from sample_data.dart.
final List<ScriptureReference> scriptureReferences = [
  // Bhagavad Gita selections
  ScriptureReference(
    id: 'bg-2-47',
    verseId: 'bg-2-47',
    title: 'Focus on Duty',
    source: ScriptureSource.bhagavadGita,
    tags: ['karma-yoga', 'detachment', 'duty'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 8,
  ),
  ScriptureReference(
    id: 'bg-4-7-8',
    verseId: 'bg-4-7-8',
    title: 'Divine Descent',
    source: ScriptureSource.bhagavadGita,
    tags: ['avatar', 'dharma', 'restoration'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 10,
  ),
  ScriptureReference(
    id: 'bg-6-26',
    verseId: 'bg-6-26',
    title: 'Gently Return the Mind',
    source: ScriptureSource.bhagavadGita,
    tags: ['meditation', 'mindfulness', 'discipline'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 12,
  ),
  ScriptureReference(
    id: 'bg-9-22',
    verseId: 'bg-9-22',
    title: 'Surrender and Support',
    source: ScriptureSource.bhagavadGita,
    tags: ['bhakti', 'surrender', 'grace'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 8,
  ),
  ScriptureReference(
    id: 'bg-12-13-14',
    verseId: 'bg-12-13-14',
    title: 'Marks of a Devotee',
    source: ScriptureSource.bhagavadGita,
    tags: ['bhakti', 'virtues'],
    difficulty: DifficultyLevel.intermediate,
    estimatedMinutes: 12,
  ),
  ScriptureReference(
    id: 'bg-12-15',
    verseId: 'bg-12-15',
    title: 'Unshakable Devotee',
    source: ScriptureSource.bhagavadGita,
    tags: ['equanimity', 'bhakti'],
    difficulty: DifficultyLevel.intermediate,
    estimatedMinutes: 10,
  ),
  ScriptureReference(
    id: 'bg-18-66',
    verseId: 'bg-18-66',
    title: 'Supreme Surrender',
    source: ScriptureSource.bhagavadGita,
    tags: ['surrender', 'moksha'],
    difficulty: DifficultyLevel.intermediate,
    estimatedMinutes: 10,
  ),
  ScriptureReference(
    id: 'bg-3-19',
    verseId: 'bg-3-19',
    title: 'Selfless Action',
    source: ScriptureSource.bhagavadGita,
    tags: ['karma-yoga', 'selfless'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 8,
  ),
  ScriptureReference(
    id: 'bg-4-39',
    verseId: 'bg-4-39',
    title: 'Faith and Knowledge',
    source: ScriptureSource.bhagavadGita,
    tags: ['jnana', 'faith'],
    difficulty: DifficultyLevel.intermediate,
    estimatedMinutes: 10,
  ),
  ScriptureReference(
    id: 'bg-6-47',
    verseId: 'bg-6-47',
    title: 'The Supreme Yogi',
    source: ScriptureSource.bhagavadGita,
    tags: ['bhakti', 'yoga'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 8,
  ),

  // Upanishads
  ScriptureReference(
    id: 'isha-1',
    verseId: 'isha-1',
    title: 'Isha Upanishad 1',
    source: ScriptureSource.upanishads,
    tags: ['nonduality', 'renunciation'],
    difficulty: DifficultyLevel.advanced,
    estimatedMinutes: 12,
  ),
  ScriptureReference(
    id: 'brhad-1-3-28',
    verseId: 'brhad-1-3-28',
    title: 'Asato Ma',
    source: ScriptureSource.upanishads,
    tags: ['prayer', 'truth'],
    difficulty: DifficultyLevel.intermediate,
    estimatedMinutes: 8,
  ),
  ScriptureReference(
    id: 'mundaka-3-1-6',
    verseId: 'mundaka-3-1-6',
    title: 'Mundaka 3.1.6',
    source: ScriptureSource.upanishads,
    tags: ['realization', 'brahman'],
    difficulty: DifficultyLevel.advanced,
    estimatedMinutes: 12,
  ),
  ScriptureReference(
    id: 'kena-1-1',
    verseId: 'kena-1-1',
    title: 'Kena 1.1',
    source: ScriptureSource.upanishads,
    tags: ['inquiry', 'mind'],
    difficulty: DifficultyLevel.advanced,
    estimatedMinutes: 10,
  ),
  ScriptureReference(
    id: 'katha-1-2-23',
    verseId: 'katha-1-2-23',
    title: 'Katha 1.2.23',
    source: ScriptureSource.upanishads,
    tags: ['grace', 'Self'],
    difficulty: DifficultyLevel.advanced,
    estimatedMinutes: 10,
  ),
  ScriptureReference(
    id: 'taittiriya-1-11-1',
    verseId: 'taittiriya-1-11-1',
    title: 'Taittiriya 1.11.1',
    source: ScriptureSource.upanishads,
    tags: ['ethics', 'truth'],
    difficulty: DifficultyLevel.intermediate,
    estimatedMinutes: 10,
  ),
  ScriptureReference(
    id: 'mandukya-1',
    verseId: 'mandukya-1',
    title: 'Mandukya 1',
    source: ScriptureSource.upanishads,
    tags: ['aum', 'states of consciousness'],
    difficulty: DifficultyLevel.advanced,
    estimatedMinutes: 12,
  ),
  ScriptureReference(
    id: 'chandogya-6-8-7',
    verseId: 'chandogya-6-8-7',
    title: 'Tat Tvam Asi',
    source: ScriptureSource.upanishads,
    tags: ['mahavakya', 'identity'],
    difficulty: DifficultyLevel.advanced,
    estimatedMinutes: 12,
  ),
  ScriptureReference(
    id: 'isha-shanti',
    verseId: 'isha-shanti',
    title: 'Shanti Mantra (Isha)',
    source: ScriptureSource.upanishads,
    tags: ['peace', 'prayer'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 6,
  ),
  ScriptureReference(
    id: 'svetasvatara-6-23',
    verseId: 'svetasvatara-6-23',
    title: 'Sveta?vatara 6.23',
    source: ScriptureSource.upanishads,
    tags: ['devotion', 'guru'],
    difficulty: DifficultyLevel.intermediate,
    estimatedMinutes: 8,
  ),

  // Mantras / devotional prayers
  ScriptureReference(
    id: 'gayatri-mantra',
    verseId: 'gayatri-mantra',
    title: 'Gayatri Mantra',
    source: ScriptureSource.mantra,
    tags: ['mantra', 'meditation'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 5,
  ),
  ScriptureReference(
    id: 'mahamrityunjaya',
    verseId: 'mahamrityunjaya',
    title: 'Mahamrityunjaya Mantra',
    source: ScriptureSource.mantra,
    tags: ['healing', 'protection'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 6,
  ),
  ScriptureReference(
    id: 'ganesha-vakratunda',
    verseId: 'ganesha-vakratunda',
    title: 'Vakratunda Mahakaya',
    source: ScriptureSource.mantra,
    tags: ['ganesha', 'auspicious'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 4,
  ),
  ScriptureReference(
    id: 'vishnu-shantakaram',
    verseId: 'vishnu-shantakaram',
    title: 'Shantakaram Bhujagashayanam',
    source: ScriptureSource.mantra,
    tags: ['vishnu', 'peace'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 6,
  ),
  ScriptureReference(
    id: 'shiva-panchakshari',
    verseId: 'shiva-panchakshari',
    title: 'Panchakshari Mantra',
    source: ScriptureSource.mantra,
    tags: ['shiva', 'mantra'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 4,
  ),
  ScriptureReference(
    id: 'devi-sarva-mangala',
    verseId: 'devi-sarva-mangala',
    title: 'Sarva Mangala Maangalye',
    source: ScriptureSource.mantra,
    tags: ['devi', 'auspicious'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 5,
  ),
  ScriptureReference(
    id: 'hanuman-buddhir-balam',
    verseId: 'hanuman-buddhir-balam',
    title: 'Buddhir Balam',
    source: ScriptureSource.mantra,
    tags: ['hanuman', 'strength'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 4,
  ),
  ScriptureReference(
    id: 'navarna-mantra',
    verseId: 'navarna-mantra',
    title: 'Navarna Mantra',
    source: ScriptureSource.mantra,
    tags: ['devi', 'protection'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 4,
  ),
  ScriptureReference(
    id: 'saraswati-vandana',
    verseId: 'saraswati-vandana',
    title: 'Saraswati Vandana',
    source: ScriptureSource.mantra,
    tags: ['saraswati', 'wisdom'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 5,
  ),
  ScriptureReference(
    id: 'hare-krishna-mahamantra',
    verseId: 'hare-krishna-mahamantra',
    title: 'Hare Krishna Mahamantra',
    source: ScriptureSource.mantra,
    tags: ['mahamantra', 'devotion'],
    difficulty: DifficultyLevel.beginner,
    estimatedMinutes: 6,
  ),
];

List<ScriptureCollection> get scriptureCollections {
  // Helpers to compute estimated totals by summing reference minutes.
  int sumMinutes(Iterable<String> ids) {
    final byId = {for (final r in scriptureReferences) r.id: r};
    return ids.map((id) => byId[id]?.estimatedMinutes ?? 0).fold(0, (a, b) => a + b);
  }

  final gitaRefs = scriptureReferences
      .where((r) => r.source == ScriptureSource.bhagavadGita)
      .map((e) => e.id)
      .toList();

  final meditationRefs = [
    'bg-6-26',
    'mandukya-1',
    'chandogya-6-8-7',
    'shiva-panchakshari',
    'gayatri-mantra',
  ];

  final devotionalRefs = [
    'hare-krishna-mahamantra',
    'devi-sarva-mangala',
    'vishnu-shantakaram',
    'ganesha-vakratunda',
    'mahamrityunjaya',
    'gayatri-mantra',
    'navarna-mantra',
    'hanuman-buddhir-balam',
    'saraswati-vandana',
  ];

  final philosophicalRefs = [
    'isha-1',
    'brhad-1-3-28',
    'kena-1-1',
    'katha-1-2-23',
    'mandukya-1',
    'chandogya-6-8-7',
    'taittiriya-1-11-1',
    'svetasvatara-6-23',
  ];

  return [
    ScriptureCollection(
      id: 'col-gita-essentials',
      title: 'Bhagavad Gita Essentials',
      description: 'Core teachings from the Gita for daily life.',
      type: CollectionType.sourceBased,
      referenceIds: gitaRefs,
      estimatedMinutesTotal: sumMinutes(gitaRefs),
    ),
    ScriptureCollection(
      id: 'col-meditation',
      title: 'Meditation & Mindfulness',
      description: 'Verses and mantras to center the mind.',
      type: CollectionType.topical,
      referenceIds: meditationRefs,
      estimatedMinutesTotal: sumMinutes(meditationRefs),
    ),
    ScriptureCollection(
      id: 'col-devotional',
      title: 'Devotional Practices',
      description: 'Bhakti-focused prayers and mantras.',
      type: CollectionType.topical,
      referenceIds: devotionalRefs,
      estimatedMinutesTotal: sumMinutes(devotionalRefs),
    ),
    ScriptureCollection(
      id: 'col-philosophy',
      title: 'Philosophical Foundations',
      description: 'Upanishadic insights and core principles.',
      type: CollectionType.topical,
      referenceIds: philosophicalRefs,
      estimatedMinutesTotal: sumMinutes(philosophicalRefs),
    ),
  ];
}

List<ReadingPlan> get readingPlans {
  // Helper to build a sequence cycling through a list to match duration.
  List<ReadingPlanEntry> _cycle(List<String> ids, int duration,
      {int minutes = 10, String? guidancePrefix}) {
    final entries = <ReadingPlanEntry>[];
    for (var i = 0; i < duration; i++) {
      final verseId = ids[i % ids.length];
      entries.add(ReadingPlanEntry(
        dayNumber: i + 1,
        verseId: verseId,
        estimatedMinutes: minutes,
        guidance: guidancePrefix == null
            ? null
            : '$guidancePrefix Day ${i + 1}',
      ));
    }
    return entries;
  }

  final gitaIds = scriptureReferences
      .where((r) => r.source == ScriptureSource.bhagavadGita)
      .map((e) => e.verseId)
      .toList();

  final foundationIds = <String>[
    'gayatri-mantra',
    'isha-1',
    'bg-2-47',
    'bg-9-22',
    'brhad-1-3-28',
    'bg-6-26',
    'chandogya-6-8-7',
  ];

  final beginnerIds = <String>[
    'bg-3-19',
    'bg-4-39',
    'bg-12-15',
    'hare-krishna-mahamantra',
    'vishnu-shantakaram',
    'devi-sarva-mangala',
    'mahamrityunjaya',
    'ganesha-vakratunda',
    'saraswati-vandana',
    'navarna-mantra',
    'bg-6-47',
    'isha-shanti',
    'svetasvatara-6-23',
    'katha-1-2-23',
  ];

  return [
    ReadingPlan(
      id: 'plan-7-foundation',
      title: '7-Day Spiritual Foundation',
      description:
          'A week-long journey blending mantra, Gita wisdom, and Upanishadic insight.',
      durationDays: 7,
      difficulty: DifficultyLevel.beginner,
      estimatedDailyMinutes: 10,
      type: PlanType.beginner,
      entries: _cycle(foundationIds, 7, minutes: 10, guidancePrefix: 'Reflect on'),
    ),
    ReadingPlan(
      id: 'plan-21-gita',
      title: '21-Day Gita Journey',
      description:
          'Daily selections from the Bhagavad Gita to deepen understanding and practice.',
      durationDays: 21,
      difficulty: DifficultyLevel.intermediate,
      estimatedDailyMinutes: 12,
      type: PlanType.intermediate,
      entries: _cycle(gitaIds, 21, minutes: 12, guidancePrefix: 'Study'),
    ),
    ReadingPlan(
      id: 'plan-beginner-dharma',
      title: "Beginner's Path to Dharma",
      description:
          'Two-week introduction to karma, bhakti, and daily devotion.',
      durationDays: 14,
      difficulty: DifficultyLevel.beginner,
      estimatedDailyMinutes: 8,
      type: PlanType.beginner,
      entries: _cycle(beginnerIds, 14, minutes: 8, guidancePrefix: 'Practice'),
    ),
  ];
}

