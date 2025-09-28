import 'package:flutter/material.dart';

// Uses app-wide Material 3 theme configured in AppTheme via MaterialApp
import 'home_page.dart';
import 'explore_page.dart';
import 'journal_page.dart';
import 'profile_page.dart';

/// Root container for bottom tab navigation across the app.
class MainNavigationPage extends StatefulWidget {
  const MainNavigationPage({
    super.key,
    this.initialIndex = 0,
  }) : assert(initialIndex >= 0 && initialIndex <= 3);

  // Acts as the new root route for the app
  static const routeName = '/';

  // Optional tab-specific routes (for future deep links)
  static const homeRoute = '/home';
  static const exploreRoute = '/explore';
  static const journalRoute = '/journal';
  static const profileRoute = '/profile';

  final int initialIndex;

  @override
  State<MainNavigationPage> createState() => _MainNavigationPageState();
}

class _MainNavigationPageState extends State<MainNavigationPage> {
  int _currentIndex = 0;

  // Keep pages alive to preserve state across tabs
  final List<Widget> _pages = const <Widget>[
    HomePage(),
    ExplorePage(),
    JournalPage(),
    ProfilePage(),
  ];

  void _onTap(int index) {
    if (index == _currentIndex) return;
    setState(() => _currentIndex = index);
    // To keep browser URL (Flutter web) or route state in sync with the
    // selected tab, you can replace the current named route here.
    // This is intentionally disabled for mobile-first simplicity.
    // final route = _routeForIndex(index);
    // Navigator.of(context).pushReplacementNamed(route);
  }

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      // Intentionally no AppBar here; individual pages manage their own
      body: SafeArea(
        // IndexedStack maintains each tab's widget state
        child: IndexedStack(
          index: _currentIndex,
          children: _pages,
        ),
      ),
      bottomNavigationBar: Semantics(
        label: 'Bottom navigation',
        container: true,
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onTap,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: cs.primary,
          unselectedItemColor: cs.onSurfaceVariant,
          showUnselectedLabels: true,
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
              tooltip: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.explore_outlined),
              activeIcon: Icon(Icons.explore),
              label: 'Explore',
              tooltip: 'Explore',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.book_outlined),
              activeIcon: Icon(Icons.book),
              label: 'Journal',
              tooltip: 'Journal',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profile',
              tooltip: 'Profile',
            ),
          ],
        ),
      ),
    );
  }

  // Maps a tab index to a future named route. These are defined as
  // static constants on MainNavigationPage and can be enabled in AppRouter
  // when you want tab-level deep links or URL sync on web.
  // ignore: unused_element
  String _routeForIndex(int index) {
    switch (index) {
      case 0:
        return MainNavigationPage.homeRoute;
      case 1:
        return MainNavigationPage.exploreRoute;
      case 2:
        return MainNavigationPage.journalRoute;
      case 3:
        return MainNavigationPage.profileRoute;
      default:
        return MainNavigationPage.homeRoute;
    }
  }
}
