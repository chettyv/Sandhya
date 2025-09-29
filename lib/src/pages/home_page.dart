import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/app_constants.dart';
import '../providers/daily_content_provider.dart';
import '../providers/content_cache_provider.dart';
import '../providers/user_profile_provider.dart';
import '../providers/daily_practice_provider.dart';
import '../providers/progress_provider.dart';
import '../providers/streak_provider.dart';
import '../models/daily_verse.dart';
import '../widgets/current_streak_bubble.dart';
import '../widgets/daily_progress_bar.dart';
import '../widgets/daily_prayer_card.dart';
import '../widgets/daily_shloka_card.dart';
import '../widgets/devotional_reflection_card.dart';
import '../widgets/spiritual_journal_card.dart';
import '../widgets/streak_bubbles.dart';
import '../widgets/tts_player.dart';
import '../core/locale_utils.dart';
import '../widgets/offline_indicator.dart';
import '../providers/daily_content_provider.dart' show verseFeedProvider; // ensure visibility
import '../providers/app_lifecycle_provider.dart';
import '../providers/day_provider.dart';

final _fallbackFeaturedProvider = Provider<DailyVerse>((ref) {
  final verses = ref.watch(verseFeedProvider);
  if (verses.isEmpty) {
    throw StateError('No verses configured.');
  }
  final now = DateTime.now().toUtc();
  final dayOfYear = now.difference(DateTime.utc(now.year)).inDays;
  final index = dayOfYear % verses.length;
  return verses[index];
});

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  static const routeName = '/';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final featuredAsync = ref.watch(featuredVerseProvider);
    final featured = featuredAsync.maybeWhen(data: (v) => v, orElse: () => ref.read(_fallbackFeaturedProvider));
    final personalized = ref.watch(shouldUsePersonalizationProvider);
    final todayIndex = DateTime.now().weekday % 7;

    final streak = ref.watch(streakProvider);
    final currentStreakCount = streak.currentStreak;
    final weeklyStreak = streak.weeklyStatus;

    final progressData = ref.watch(progressProvider);
    final progress = progressData.progress;
    // Only show overall progress, no per-segment chips
    const segments = <DailyProgressSegment>[];

    final offline = ref.watch(offlineStatusProvider).maybeWhen(
          data: (s) => !s.isOnline,
          orElse: () => false,
        );

    // Invalidate day tick on app resume (covers sleep past midnight)
    ref.listen(appLifecycleStreamProvider, (_, next) {
      next.whenData((state) {
        if (state == AppLifecycleState.resumed) {
          ref.invalidate(currentDayProvider);
        }
      });
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text(AppConstants.appTitle),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 12),
            child: Center(child: OfflineIndicator(compact: true)),
          ),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await ref.read(cachedIndexProvider.notifier).clearExpired();
            ref.invalidate(currentDayProvider);
            ref.invalidate(featuredVerseProvider);
          },
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
              if (offline)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.errorContainer,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'You are offline — please connect',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Weekly Streak',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 12),
                        StreakBubbles(
                          completionStatus: weeklyStreak,
                          currentDayIndex: todayIndex,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  CurrentStreakBubble(
                    streakCount: currentStreakCount,
                    onTap: () {
                      final messenger = ScaffoldMessenger.of(context);
                      messenger.showSnackBar(
                        const SnackBar(
                          content:
                              Text('Detailed streak insights coming soon.'),
                        ),
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 24),
              if (!ref.watch(isProfileCompleteProvider))
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.tips_and_updates_outlined),
                    title: const Text('Get tailored daily content'),
                    subtitle: const Text('Complete your profile to personalize verses and practices.'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => Navigator.of(context).pushNamed('/profile-setup'),
                  ),
                ),
              if (!ref.watch(isProfileCompleteProvider)) const SizedBox(height: 16),
              DailyProgressBar(
                progress: progress,
                segments: segments,
              ),
              const SizedBox(height: 24),
              if (personalized)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Icon(Icons.auto_awesome, size: 16, color: Theme.of(context).colorScheme.primary),
                      const SizedBox(width: 6),
                      Text('Personalized for you', style: Theme.of(context).textTheme.labelMedium),
                    ],
                  ),
                ),
              GestureDetector(
                onTap: () => _openShlokaModal(context, ref, featured),
                child: DailyShlokaCard(
                  verse: featured,
                ),
              ),
              const SizedBox(height: 20),
              DevotionalReflectionCard(verse: featured),
              const SizedBox(height: 20),
              GestureDetector(
                onTap: () => _openPrayerModal(context, ref, featured),
                child: DailyPrayerCard(
                  verse: featured,
                  showActionButton: false,
                  completed: ref.watch(dailyPracticeProvider).prayerCompleted,
                ),
              ),
              const SizedBox(height: 20),
              GestureDetector(
                onTap: () => _openReflectionModal(context, ref, featured),
                child: SpiritualJournalCard(
                  verse: featured,
                  compact: true,
                  saved: ref.watch(dailyPracticeProvider).journalCompleted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _openShlokaModal(BuildContext context, WidgetRef ref, DailyVerse verse) async {
    // Mark completion as soon as the modal opens
    ref.read(dailyPracticeProvider.notifier).setReadingCompleted(true);
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) {
        String mode = '';
        return StatefulBuilder(
          builder: (context, setState) {
            void select(String m) => setState(() => mode = m);

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: SafeArea(
                child: Container(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Today\'s Shloka', style: Theme.of(context).textTheme.titleLarge),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          FilledButton(
                            onPressed: () => select('read'),
                            child: const Text('Read'),
                          ),
                          const SizedBox(width: 8),
                          OutlinedButton.icon(
                            onPressed: () => select('listen'),
                            icon: const Icon(Icons.volume_up),
                            label: const Text('Listen'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (mode == 'listen') ...[
                        TtsPlayer(text: verse.scripture, autoplay: true),
                        const SizedBox(height: 12),
                      ],
                      Text(
                        verse.scripture,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      // Transliteration (locale-aware)
                      ...(() {
                        final locale =
                            Localizations.maybeLocaleOf(context) ??
                                const Locale('en');
                        final showTransliteration = verse.transliteration != null &&
                            !isDevanagariLanguage(locale);
                        if (!showTransliteration) return const <Widget>[];
                        return [
                          const SizedBox(height: 8),
                          Text(
                            'Transliteration',
                            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                  letterSpacing: 0.6,
                                ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            verse.transliteration!,
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(fontStyle: FontStyle.italic),
                          ),
                        ];
                      }()),
                      const SizedBox(height: 8),
                      if (verseTranslationForLocale(
                              verse,
                              Localizations.maybeLocaleOf(context) ??
                                  const Locale('en'),
                            )
                          case final tr?)
                        Text(
                          tr,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _openPrayerModal(
    BuildContext context,
    WidgetRef ref,
    DailyVerse verse,
  ) async {
    // Mark completion as soon as the modal opens
    ref.read(dailyPracticeProvider.notifier).setPrayerCompleted(true);
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) {
        String mode = '';
        return StatefulBuilder(
          builder: (context, setState) {
            void select(String m) => setState(() => mode = m);

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: SafeArea(
                child: Container(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            verse.prayerTitle ?? 'Daily Prayer',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          FilledButton(
                            onPressed: () => select('read'),
                            child: const Text('Read'),
                          ),
                          const SizedBox(width: 8),
                          OutlinedButton.icon(
                            onPressed: () => select('listen'),
                            icon: const Icon(Icons.volume_up),
                            label: const Text('Listen'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (mode == 'listen' && (verse.prayerText != null)) ...[
                        TtsPlayer(text: verse.prayerText!, autoplay: true),
                        const SizedBox(height: 12),
                      ],
                      if (verse.prayerText != null)
                        Text(
                          verse.prayerText!,
                          style: Theme.of(context).textTheme.bodyLarge,
                        ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _openReflectionModal(
    BuildContext context,
    WidgetRef ref,
    DailyVerse verse,
  ) async {
    final controller = TextEditingController();
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: SafeArea(
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Spiritual Journal', style: Theme.of(context).textTheme.titleLarge),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  if (verse.journalPrompt != null)
                    Text(
                      verse.journalPrompt!,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: controller,
                    maxLines: 4,
                    decoration: const InputDecoration(
                      labelText: 'Your reflection',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Align(
                    alignment: Alignment.centerRight,
                    child: FilledButton(
                      onPressed: () {
                        final text = controller.text.trim();
                        if (text.isNotEmpty) {
                          ref.read(dailyPracticeProvider.notifier).saveJournal(text);
                          Navigator.of(context).pop();
                        }
                      },
                      child: const Text('Save'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

// Removed temporary audio preview stub; using TTS player instead.
