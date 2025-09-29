import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Emits the current local day (truncated to midnight) and ticks again
/// at the next local midnight.
final currentDayProvider = StreamProvider<DateTime>((ref) async* {
  DateTime today() {
    final now = DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  yield today();

  while (true) {
    final now = DateTime.now();
    final nextMidnight = DateTime(now.year, now.month, now.day).add(const Duration(days: 1));
    final wait = nextMidnight.difference(now);
    // If the calculated wait is negative due to clock changes, tick soon.
    final duration = wait.isNegative ? const Duration(seconds: 1) : wait;
    await Future.delayed(duration);
    yield today();
  }
});

