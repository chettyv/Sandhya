import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class _LifecycleObserver with WidgetsBindingObserver {
  final _controller = StreamController<AppLifecycleState>.broadcast();
  Stream<AppLifecycleState> get stream => _controller.stream;

  void dispose() {
    _controller.close();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    _controller.add(state);
  }
}

final appLifecycleStreamProvider = StreamProvider<AppLifecycleState>((ref) async* {
  final observer = _LifecycleObserver();
  WidgetsBinding.instance.addObserver(observer);
  ref.onDispose(() {
    WidgetsBinding.instance.removeObserver(observer);
    observer.dispose();
  });
  yield* observer.stream;
});

