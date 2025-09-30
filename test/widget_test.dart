import 'package:dharma_daily/main.dart';
import 'package:dharma_daily/src/pages/home_page.dart';
import 'package:dharma_daily/src/pages/main_navigation_page.dart';
import 'package:dharma_daily/src/pages/explore_page.dart';
import 'package:dharma_daily/src/providers/daily_content_provider.dart';
import 'package:dharma_daily/src/widgets/daily_shloka_card.dart';
import 'package:dharma_daily/src/widgets/streak_bubbles.dart';
import 'package:dharma_daily/src/widgets/verse_card.dart';
import 'package:dharma_daily/src/widgets/current_streak_bubble.dart';
import 'package:dharma_daily/src/widgets/offline_indicator.dart';
import 'package:dharma_daily/src/widgets/devotional_reflection_card.dart';
import 'package:dharma_daily/src/widgets/daily_prayer_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'test_helpers.dart';

void main() {
  group('App smoke tests', () {
    testWidgets('App loads, shows Home with Weekly Streak and bottom nav',
        (tester) async {
      final overrides = buildBaseOverrides(
        featured: makeTestVerse(),
        practice: makePractice(),
        streak: makeStreakData(),
        profile: makeProfile(complete: true),
      );

      await tester.pumpWidget(ProviderScope(
        overrides: overrides,
        child: const DharmaDailyApp(),
      ));
      await tester.pumpAndSettle();

      expect(find.text('Weekly Streak'), findsOneWidget);
      expect(find.byType(BottomNavigationBar), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
    });
  });

  group('StreakBubbles', () {
    testWidgets('renders 7 bubbles with weekday labels', (tester) async {
      const status = <bool>[true, false, false, true, true, false, true];
      await tester.pumpWidget(wrapWithMaterial(
        StreakBubbles(completionStatus: status, currentDayIndex: 3),
      ));
      await tester.pumpAndSettle();

      // Check weekday labels
      expect(find.text('S'), findsNWidgets(2)); // Sunday & Saturday
      expect(find.text('M'), findsOneWidget);
      expect(find.text('T'), findsNWidgets(2)); // Tue & Thu
      expect(find.text('W'), findsOneWidget);
      expect(find.text('F'), findsOneWidget);
      // 7 animated containers, one per bubble
      expect(find.byType(AnimatedContainer), findsNWidgets(7));
    });

    testWidgets('completed vs incomplete color application', (tester) async {
      final theme = ThemeData(useMaterial3: true);
      const status = <bool>[true, false, false, false, false, false, false];
      await tester.pumpWidget(MaterialApp(
        theme: theme,
        home: Scaffold(
          body:
              Center(child: StreakBubbles(completionStatus: status, currentDayIndex: 0)),
        ),
      ));
      await tester.pumpAndSettle();

      final containers =
          tester.widgetList<AnimatedContainer>(find.byType(AnimatedContainer)).toList();
      expect(containers.length, 7);

      final cs = theme.colorScheme;
      // Day 0 is complete; its color should be primary
      final day0 = containers[0].decoration as BoxDecoration;
      expect(day0.color, cs.primary);
      // Day 1 is incomplete; its color should be surfaceContainerHighest
      final day1 = containers[1].decoration as BoxDecoration;
      expect(day1.color, cs.surfaceContainerHighest);
    });

    testWidgets('current day bubble is highlighted (thicker border)',
        (tester) async {
      const status = <bool>[false, false, false, false, false, false, false];
      const currentIndex = 4; // Thursday
      await tester.pumpWidget(wrapWithMaterial(
        StreakBubbles(completionStatus: status, currentDayIndex: currentIndex),
      ));
      await tester.pumpAndSettle();

      final containers =
          tester.widgetList<AnimatedContainer>(find.byType(AnimatedContainer)).toList();
      final current = containers[currentIndex].decoration as BoxDecoration;
      final border = current.border as Border;
      expect(border.top.width, 3);
    });
  });

  group('VerseCard', () {
    testWidgets('displays verse content and reference', (tester) async {
      final verse = makeTestVerse(
        title: 'Focus on Duty',
        scripture: 'karma?y evadhikaras te...',
        reference: 'Bhagavad Gita 2.47',
        translations: const {'en': 'You have a right to action alone...'},
      );

      await tester.pumpWidget(wrapWithMaterial(VerseCard(verse: verse)));
      await tester.pumpAndSettle();

      expect(find.text('Focus on Duty'), findsOneWidget);
      expect(find.text('karma?y evadhikaras te...'), findsOneWidget);
      expect(find.text('Bhagavad Gita 2.47'), findsOneWidget);
      expect(find.textContaining('Recommended meditation:'), findsOneWidget);
      expect(find.text('You have a right to action alone...'), findsOneWidget);
    });

    testWidgets('renders highlight mode with button', (tester) async {
      final verse = makeTestVerse(recommendedMinutes: 12);
      await tester.pumpWidget(MaterialApp(
        theme: ThemeData(useMaterial3: true),
        home: Scaffold(body: VerseCard(verse: verse, highlight: true)),
      ));
      await tester.pumpAndSettle();

      expect(find.text('Daily Focus'), findsOneWidget);
      expect(find.text("Begin today's practice"), findsOneWidget);
      expect(find.textContaining('Recommended meditation: 12 minutes'),
          findsOneWidget);

      await tester.tap(find.text("Begin today's practice"));
      await tester.pump();
    });
  });

  group('DailyShlokaCard', () {
    testWidgets('shows scripture, transliteration, translation and reference',
        (tester) async {
      final verse = makeTestVerse(
        title: 'Shloka of the Day',
        scripture: 'dharmo rak?ati rak?ita?',
        transliteration: 'dharmo rakshati rakshitah',
        reference: 'Manusmriti',
        translations: const {'en': 'Dharma protects those who protect it'},
      );

      await tester.pumpWidget(wrapWithMaterial(DailyShlokaCard(verse: verse)));
      await tester.pumpAndSettle();

      expect(find.text("Today's Shloka"), findsOneWidget);
      expect(find.text('dharmo rak?ati rak?ita?'), findsOneWidget);
      expect(find.text('dharmo rakshati rakshitah'), findsOneWidget);
      expect(find.text('Dharma protects those who protect it'), findsOneWidget);
      expect(find.text('Manusmriti'), findsOneWidget);
    });

    testWidgets('bookmark toggles icon and invokes callback', (tester) async {
      final verse = makeTestVerse();
      bool? lastState;
      await tester.pumpWidget(wrapWithMaterial(
        DailyShlokaCard(
          verse: verse,
          onBookmarkToggle: (v) => lastState = v,
        ),
      ));
      await tester.pumpAndSettle();

      // Initially unbookmarked
      expect(find.byIcon(Icons.bookmark_border), findsOneWidget);
      expect(find.byIcon(Icons.bookmark), findsNothing);

      await tester.tap(find.byIcon(Icons.bookmark_border));
      await tester.pumpAndSettle();
      expect(find.byIcon(Icons.bookmark), findsOneWidget);
      expect(lastState, isTrue);

      await tester.tap(find.byIcon(Icons.bookmark));
      await tester.pumpAndSettle();
      expect(find.byIcon(Icons.bookmark_border), findsOneWidget);
      expect(lastState, isFalse);
    });
  });

  group('MainNavigationPage', () {
    testWidgets('initial tab is Home and bottom nav has 4 items',
        (tester) async {
      final overrides = buildBaseOverrides(
        featured: makeTestVerse(),
        practice: makePractice(reading: true),
        streak: makeStreakData(),
        profile: makeProfile(complete: true),
      );

      await tester.pumpWidget(buildTestApp(
        home: const MainNavigationPage(),
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      // Home tab loaded (HomePage inside IndexedStack)
      expect(find.byType(HomePage), findsOneWidget);
      expect(find.byType(BottomNavigationBar), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Explore'), findsOneWidget);
      expect(find.text('Journal'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
    });

    testWidgets('switches tabs and preserves state via IndexedStack',
        (tester) async {
      final overrides = buildBaseOverrides(
        featured: makeTestVerse(),
        practice: makePractice(),
        streak: makeStreakData(),
        profile: makeProfile(),
      );

      await tester.pumpWidget(buildTestApp(
        home: const MainNavigationPage(),
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      // Switch to Explore
      await tester.tap(find.text('Explore'));
      await tester.pumpAndSettle();
      expect(find.text('Explore'), findsWidgets); // app bar + nav label
      expect(find.byType(ExplorePage), findsOneWidget);

      // IndexedStack remains (keeps children alive)
      expect(find.byType(IndexedStack), findsOneWidget);

      // Switch to Journal and then Profile
      await tester.tap(find.text('Journal'));
      await tester.pumpAndSettle();
      expect(find.text('Journal'), findsWidgets);

      await tester.tap(find.text('Profile'));
      await tester.pumpAndSettle();
      expect(find.text('Profile'), findsWidgets);
    });
  });

  group('HomePage integration', () {
    testWidgets('renders app bar, offline banner, streak, progress and content',
        (tester) async {
      final verse = makeTestVerse(
        title: 'Focus on Duty',
        scripture: 'karma?y evadhikaras te',
        reference: 'Bhagavad Gita 2.47',
        translations: const {'en': 'You have a right to action alone...'},
      );

      final overrides = <Override>[
        ...buildBaseOverrides(
          featured: verse,
          practice: makePractice(reading: true, prayer: false, journal: false),
          streak: makeStreakData(weekly: testWeeklyStatus, current: 3),
          profile: makeProfile(complete: false),
        ),
        overrideOfflineStatus(makeOfflineStatus(isOnline: false, totalCached: 0)),
      ];

      await tester.pumpWidget(buildTestApp(home: const HomePage(), overrides: overrides));
      await tester.pumpAndSettle();

      // App bar title
      expect(find.text('DharmaDaily'), findsOneWidget);

      // Offline indicator is present in app bar actions
      expect(find.bySemanticsLabel('Offline status'), findsNothing); // compact icon has no label
      // But the indicator widget exists
      expect(find.byType(OfflineIndicator), findsOneWidget);

      // Weekly streak section
      expect(find.text('Weekly Streak'), findsOneWidget);
      expect(find.byType(StreakBubbles), findsOneWidget);

      // Current streak bubble present
      expect(find.byType(CurrentStreakBubble), findsOneWidget);

      // Overall progress bar shows a percentage label
      expect(find.text('Daily Progress'), findsOneWidget);
      // 33% when only reading is completed
      expect(find.text('33%'), findsOneWidget);

      // Daily content cards
      expect(find.byType(DailyShlokaCard), findsOneWidget);
      expect(find.byType(DevotionalReflectionCard), findsOneWidget);
      expect(find.byType(DailyPrayerCard), findsOneWidget);
      expect(find.text('Spiritual Journal'), findsOneWidget);
    });

    testWidgets('shows personalization indicator when profile is complete',
        (tester) async {
      final verse = makeTestVerse();
      final overrides = <Override>[
        ...buildBaseOverrides(
          featured: verse,
          practice: makePractice(reading: false, prayer: false, journal: false),
          streak: makeStreakData(),
          profile: makeProfile(complete: true),
        ),
        // Force personalization flag to be true for this test
        shouldUsePersonalizationProvider.overrideWithValue(true),
        overrideOfflineStatus(makeOfflineStatus(isOnline: true, totalCached: 2)),
      ];

      await tester.pumpWidget(buildTestApp(home: const HomePage(), overrides: overrides));
      await tester.pumpAndSettle();

      expect(find.text('Personalized for you'), findsOneWidget);
    });
  });
}
