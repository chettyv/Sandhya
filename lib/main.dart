import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'src/config/app_router.dart';
import 'src/config/app_theme.dart';
import 'src/pages/home_page.dart';

void main() {
  runApp(const ProviderScope(child: DharmaDailyApp()));
}

class DharmaDailyApp extends StatelessWidget {
  const DharmaDailyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DharmaDaily',
      theme: AppTheme.light,
      onGenerateRoute: AppRouter.onGenerateRoute,
      initialRoute: HomePage.routeName,
      debugShowCheckedModeBanner: false,
    );
  }
}
