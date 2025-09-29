import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/sample_data.dart';
import '../models/daily_verse.dart';
import 'personalized_content_provider.dart';
import 'user_profile_provider.dart';
import 'content_cache_provider.dart';
import 'day_provider.dart';

final verseFeedProvider = Provider<List<DailyVerse>>((ref) => sampleVerses);

final shouldUsePersonalizationProvider = Provider<bool>((ref) {
  return ref.watch(isProfileCompleteProvider);
});

final _defaultFeaturedVerseProvider = Provider<DailyVerse>((ref) {
  // Recompute at local midnight
  ref.watch(currentDayProvider);
  final verses = ref.watch(verseFeedProvider);
  if (verses.isEmpty) {
    throw StateError('No verses configured.');
  }
  final now = DateTime.now();
  final dayOfYear = now.difference(DateTime(now.year)).inDays;
  final index = dayOfYear % verses.length;
  return verses[index];
});

final featuredVerseProvider = FutureProvider<DailyVerse>((ref) async {
  // Recompute at local midnight
  ref.watch(currentDayProvider);
  final usePersonalization = ref.watch(shouldUsePersonalizationProvider);
  final candidate = usePersonalization
      ? ref.watch(personalizedFeaturedVerseProvider)
      : ref.watch(_defaultFeaturedVerseProvider);
  // Try cache first
  if (await ref.read(contentCacheServiceProvider).getCachedVerse(candidate.id)
      case final cached?) {
    return cached;
  }
  // Background-preload next 7 days based on the active feed
  final feed = usePersonalization
      ? ref.read(personalizedVerseFeedProvider)
      : ref.read(verseFeedProvider);
  if (feed.isNotEmpty) {
    final now = DateTime.now().toUtc();
    final dayOfYear = now.difference(DateTime.utc(now.year)).inDays;
    final startIndex = dayOfYear % feed.length;
    final next = <DailyVerse>[];
    for (var i = 1; i <= 7 && i < feed.length; i++) {
      next.add(feed[(startIndex + i) % feed.length]);
    }
    // fire-and-forget
    // ignore: discarded_futures
    ref.read(contentCacheServiceProvider).preloadEssentialContent(next);
  }
  return candidate;
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
