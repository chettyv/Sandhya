import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/sample_data.dart';
import '../models/daily_verse.dart';
import 'personalized_content_provider.dart';
import 'user_profile_provider.dart';

final verseFeedProvider = Provider<List<DailyVerse>>((ref) => sampleVerses);

final shouldUsePersonalizationProvider = Provider<bool>((ref) {
  return ref.watch(isProfileCompleteProvider);
});

final _defaultFeaturedVerseProvider = Provider<DailyVerse>((ref) {
  final verses = ref.watch(verseFeedProvider);
  if (verses.isEmpty) {
    throw StateError('No verses configured.');
  }
  final now = DateTime.now().toUtc();
  final dayOfYear = now.difference(DateTime.utc(now.year)).inDays;
  final index = dayOfYear % verses.length;
  return verses[index];
});

final featuredVerseProvider = Provider<DailyVerse>((ref) {
  final usePersonalization = ref.watch(shouldUsePersonalizationProvider);
  if (usePersonalization) {
    return ref.watch(personalizedFeaturedVerseProvider);
  }
  return ref.watch(_defaultFeaturedVerseProvider);
});

final recommendationsProvider = Provider<List<DailyVerse>>((ref) {
  final usePersonalization = ref.watch(shouldUsePersonalizationProvider);
  if (usePersonalization) {
    return ref.watch(personalizedRecommendationsProvider);
  }
  // Fallback: return a rotating slice of the base feed
  final base = ref.watch(verseFeedProvider);
  if (base.isEmpty) return const <DailyVerse>[];
  final now = DateTime.now().toUtc();
  final index = now.difference(DateTime.utc(now.year)).inDays % base.length;
  final out = <DailyVerse>[];
  for (var i = 0; i < 10 && i < base.length; i++) {
    out.add(base[(index + i) % base.length]);
  }
  return out;
});
