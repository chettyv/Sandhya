import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Emits the current local day (truncated to midnight) and ticks again
/// at the next local midnight. Uses a cancellable timer so no pending
/// timers remain when disposed (important for tests and hot reload).
final currentDayProvider = StreamProvider<DateTime>((ref) {
  DateTime today() {
    final now = DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  final controller = StreamController<DateTime>();
  controller.add(today());

  Timer? timer;
  void scheduleNext() {
    final now = DateTime.now();
    final nextMidnight = DateTime(now.year, now.month, now.day)
        .add(const Duration(days: 1));
    final wait = nextMidnight.difference(now);
    timer = Timer(wait.isNegative ? const Duration(seconds: 1) : wait, () {
      if (controller.isClosed) return;
      controller.add(today());
      scheduleNext();
    });
  }

  scheduleNext();

  ref.onDispose(() {
    timer?.cancel();
    controller.close();
  });

  return controller.stream;
});
