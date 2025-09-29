import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/daily_verse.dart';
import '../providers/content_cache_provider.dart';
import '../services/content_cache_service.dart';
import '../models/cached_content.dart';

class DownloadButton extends ConsumerStatefulWidget {
  const DownloadButton({super.key, required this.verse});
  final DailyVerse verse;

  @override
  ConsumerState<DownloadButton> createState() => _DownloadButtonState();
}

class _DownloadButtonState extends ConsumerState<DownloadButton> {
  bool _loading = false;
  bool _done = false;
  String? _error;

  Future<void> _download() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final svc = ref.read(contentCacheServiceProvider);
      await svc.cacheVerse(widget.verse, source: CacheSource.downloaded);
      await ref.read(cachedIndexProvider.notifier).cacheAll([widget.verse]);
      setState(() => _done = true);
    } catch (e) {
      setState(() => _error = 'Failed');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const SizedBox(width: 32, height: 32, child: CircularProgressIndicator(strokeWidth: 2));
    }
    if (_done) {
      return const Icon(Icons.check_circle, color: Colors.green);
    }
    if (_error != null) {
      return IconButton(
        icon: const Icon(Icons.refresh),
        tooltip: 'Retry download',
        onPressed: _download,
      );
    }
    return IconButton(
      icon: const Icon(Icons.download_for_offline_outlined),
      tooltip: 'Download for offline',
      onPressed: _download,
    );
  }
}
