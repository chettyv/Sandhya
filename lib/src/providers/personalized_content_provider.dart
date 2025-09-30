import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/personalization_constants.dart';
import '../core/sample_data.dart';
import '../models/daily_verse.dart';
import 'day_provider.dart';
import 'user_profile_provider.dart';

/// Builds a personalized verse feed by ranking the base content list according
/// to the user's profile preferences. Uses a soft scoring system to preserve variety.
final personalizedVerseFeedProvider = Provider<List<DailyVerse>>((ref) {
  final profile = ref.watch(userProfileProvider);
  const base = sampleVerses; // Using sample data as the base feed.
  if (base.isEmpty) return const <DailyVerse>[];

  String aggregate(DailyVerse v) {
    final parts = <String?>[
      v.title,
      v.scripture,
      v.transliteration,
      v.reference,
      v.commentary,
      v.devotionalTitle,
      v.devotionalReflection,
      v.prayerTitle,
      v.prayerText,
      v.journalPrompt,
    ];
    return parts
        .where((e) => e != null && e.trim().isNotEmpty)
        .map((e) => e!.toLowerCase())
        .join(' \n ');
  }

  final tradition = profile.traditionEnum;

  List<DeityPreference> traditionDeities(SpiritualTradition? t) {
    switch (t) {
      case SpiritualTradition.shaivism:
        return const [DeityPreference.shiva];
      case SpiritualTradition.vaishnavism:
        return const [
          DeityPreference.vishnu,
          DeityPreference.krishna,
          DeityPreference.rama,
          DeityPreference.narayana
        ];
      case SpiritualTradition.shaktism:
        return const [
          DeityPreference.devi,
          DeityPreference.durga,
          DeityPreference.lakshmi,
          DeityPreference.saraswati
        ];
      case SpiritualTradition.smartism:
        return const [
          DeityPreference.ganesha,
          DeityPreference.shiva,
          DeityPreference.vishnu,
          DeityPreference.devi,
          DeityPreference.surya,
        ];
      case SpiritualTradition.advaita:
      case SpiritualTradition.bhakti:
      case SpiritualTradition.karmaYoga:
      case SpiritualTradition.jnanaYoga:
      case SpiritualTradition.rajaYoga:
      case null:
        return const [];
    }
  }

  int score(DailyVerse v) {
    final text = aggregate(v);
    int s = 0;

    // Deity preferences
    final deities = profile.deityEnums;
    for (final d in deities) {
      final keywords = deityKeywordsMap[d] ?? const <String>[];
      for (final k in keywords) {
        if (text.contains(k)) s += 3;
      }
    }

    // Tradition influence
    for (final d in traditionDeities(tradition)) {
      final keywords = deityKeywordsMap[d] ?? const <String>[];
      for (final k in keywords) {
        if (text.contains(k)) s += 2;
      }
    }

    // Goals alignment
    for (final g in profile.goalEnums) {
      final keywords = goalKeywordsMap[g] ?? const <String>[];
      for (final k in keywords) {
        if (text.contains(k)) s += 1;
      }
      // Small nudge for meditation-friendly verses
      if (g == SpiritualGoal.meditation) {
        s += ((v.recommendedMeditationMinutes / 5).floor());
      }
    }

    // Language hint (optional, very small weight)
    if (profile.languageEnum != null) {
      s += 1;
    }

    return s;
  }

  final ranked = base.map((v) => (verse: v, sc: score(v))).toList()
    ..sort((a, b) => b.sc.compareTo(a.sc));

  // Preserve variety by interleaving: top 1/3, mid 1/3, low 1/3
  final third = (ranked.length / 3).ceil();
  final top = ranked.take(third).map((e) => e.verse).toList();
  final mid = ranked.skip(third).take(third).map((e) => e.verse).toList();
  final low = ranked.skip(third * 2).map((e) => e.verse).toList();
  final output = <DailyVerse>[];
  final maxLen =
      [top.length, mid.length, low.length].reduce((a, b) => a > b ? a : b);
  for (var i = 0; i < maxLen; i++) {
    if (i < top.length) output.add(top[i]);
    if (i < mid.length) output.add(mid[i]);
    if (i < low.length) output.add(low[i]);
  }
  return output;
});

final personalizedFeaturedVerseProvider = Provider<DailyVerse>((ref) {
  // Recompute at local midnight
  ref.watch(currentDayProvider);
  final feed = ref.watch(personalizedVerseFeedProvider);
  if (feed.isEmpty) {
    throw StateError('No verses configured.');
  }
  final now = DateTime.now();
  final dayOfYear = now.difference(DateTime(now.year)).inDays;
  final index = dayOfYear % feed.length;
  return feed[index];
});

final personalizedRecommendationsProvider = Provider<List<DailyVerse>>((ref) {
  final feed = ref.watch(personalizedVerseFeedProvider);
  if (feed.isEmpty) return const <DailyVerse>[];
  return feed.take(10).toList();
});
