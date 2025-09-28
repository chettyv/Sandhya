import 'package:flutter/material.dart';

import '../pages/main_navigation_page.dart';
import '../pages/scripture_detail_page.dart';
import '../pages/reading_plan_detail_page.dart';
import '../pages/collection_detail_page.dart';
import '../pages/profile_setup_page.dart';

/// Handles page resolution in a single place for scalability.
class AppRouter {
  const AppRouter._();

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case MainNavigationPage.routeName:
      case null:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const MainNavigationPage(),
        );
      case ProfileSetupPage.routeName:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const ProfileSetupPage(),
        );
      default:
        final name = settings.name ?? '';
        if (name.startsWith('/scripture/')) {
          final id = name.substring('/scripture/'.length);
          return MaterialPageRoute<void>(
            settings: settings,
            builder: (_) => ScriptureDetailPage(verseId: id),
          );
        }
        if (name.startsWith('/reading-plan/')) {
          final id = name.substring('/reading-plan/'.length);
          return MaterialPageRoute<void>(
            settings: settings,
            builder: (_) => ReadingPlanDetailPage(planId: id),
          );
        }
        if (name.startsWith('/collection/')) {
          final id = name.substring('/collection/'.length);
          return MaterialPageRoute<void>(
            settings: settings,
            builder: (_) => CollectionDetailPage(collectionId: id),
          );
        }
        // Future: Uncomment these to enable tab-level deep links
      // case MainNavigationPage.homeRoute:
      //   return MaterialPageRoute<void>(
      //     settings: settings,
      //     builder: (_) => const MainNavigationPage(initialIndex: 0),
      //   );
      // case MainNavigationPage.exploreRoute:
      //   return MaterialPageRoute<void>(
      //     settings: settings,
      //     builder: (_) => const MainNavigationPage(initialIndex: 1),
      //   );
      // case MainNavigationPage.journalRoute:
      //   return MaterialPageRoute<void>(
      //     settings: settings,
      //     builder: (_) => const MainNavigationPage(initialIndex: 2),
      //   );
      // case MainNavigationPage.profileRoute:
      //   return MaterialPageRoute<void>(
      //     settings: settings,
      //     builder: (_) => const MainNavigationPage(initialIndex: 3),
      //   );
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const UnknownRoutePage(),
        );
    }
  }
}

class UnknownRoutePage extends StatelessWidget {
  const UnknownRoutePage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Page not found')),
        body: const Center(
          child: Text('This route is not configured yet.'),
        ),
      );
}
