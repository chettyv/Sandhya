import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/sample_data.dart';
import '../models/daily_verse.dart';

final verseFeedProvider = Provider<List<DailyVerse>>((ref) => sampleVerses);

final featuredVerseProvider = Provider<DailyVerse>((ref) {
  final verses = ref.watch(verseFeedProvider);
  if (verses.isEmpty) {
    throw StateError('No verses configured.');
  }
  final now = DateTime.now().toUtc();
  final dayOfYear = now.difference(DateTime.utc(now.year)).inDays;
  final index = dayOfYear % verses.length;
  return verses[index];
});
