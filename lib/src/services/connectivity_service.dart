import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ConnectivityService {
  static const _keyLastOnline = 'connectivity_last_online';

  final _controller = StreamController<bool>.broadcast();
  StreamSubscription<List<ConnectivityResult>>? _sub;

  bool _isOnline = true;
  bool get isOnline => _isOnline;

  Stream<bool> get onStatusChanged => _controller.stream;

  Future<void> start() async {
    _isOnline = await _checkNow();
    _controller.add(_isOnline);
    _sub = Connectivity().onConnectivityChanged.listen((results) async {
      final online = results.any((r) => r == ConnectivityResult.wifi || r == ConnectivityResult.mobile || r == ConnectivityResult.ethernet);
      if (online != _isOnline) {
        _isOnline = online;
        _controller.add(online);
        if (online) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString(_keyLastOnline, DateTime.now().toIso8601String());
        }
      }
    });
  }

  Future<void> stop() async {
    await _sub?.cancel();
    await _controller.close();
  }

  Future<bool> _checkNow() async {
    final results = await Connectivity().checkConnectivity();
    return results.any((r) => r == ConnectivityResult.wifi || r == ConnectivityResult.mobile || r == ConnectivityResult.ethernet);
  }

  Future<DateTime?> lastOnlineAt() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyLastOnline);
    if (raw == null || raw.isEmpty) return null;
    return DateTime.tryParse(raw);
  }
}

final connectivityServiceProvider = Provider<ConnectivityService>((ref) {
  final svc = ConnectivityService();
  // Fire and forget start; in real app, manage lifecycle more deliberately
  // ignore: discarded_futures
  svc.start();
  ref.onDispose(() => svc.stop());
  return svc;
});

