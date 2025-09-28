import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../widgets/daily_progress_bar.dart';
import 'daily_practice_provider.dart';

class DailyProgressData {
  const DailyProgressData({required this.progress, required this.segments});

  final double progress;
  final List<DailyProgressSegment> segments;
}

final progressProvider = Provider<DailyProgressData>((ref) {
  final practice = ref.watch(dailyPracticeProvider);

  final segments = <DailyProgressSegment>[
    DailyProgressSegment(value: practice.readingCompleted ? 1 : 0, label: 'Reading'),
    DailyProgressSegment(value: practice.prayerCompleted ? 1 : 0, label: 'Prayer'),
    DailyProgressSegment(value: practice.journalCompleted ? 1 : 0, label: 'Reflection'),
  ];

  final total = segments.fold<double>(0.0, (sum, s) => sum + s.value);
  final progress = ((total / segments.length).clamp(0.0, 1.0) as num).toDouble();

  return DailyProgressData(progress: progress, segments: segments);
});
