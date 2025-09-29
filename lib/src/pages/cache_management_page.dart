import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/cached_content.dart';
import '../providers/content_cache_provider.dart';
import '../services/content_cache_service.dart';

class CacheManagementPage extends ConsumerWidget {
  const CacheManagementPage({super.key});

  static const routeName = '/cache-management';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final meta = ref.watch(cachedIndexProvider);
    final svc = ref.read(contentCacheServiceProvider);

    Future<void> clearExpired() async {
      await ref.read(cachedIndexProvider.notifier).clearExpired();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Expired cache cleared')),
        );
      }
    }

    Future<void> clearAll() async {
      for (final m in meta) {
        await svc.removeVerse(m.verseId);
      }
      await ref.read(cachedIndexProvider.notifier).clearExpired();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('All cached content removed')),
        );
      }
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Offline & Storage')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Cached items: ${meta.length}', style: Theme.of(context).textTheme.titleSmall),
                  Row(children: [
                    OutlinedButton(onPressed: clearExpired, child: const Text('Clear expired')),
                    const SizedBox(width: 8),
                    OutlinedButton(onPressed: clearAll, child: const Text('Clear all')),
                  ]),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          for (final m in meta) _CacheTile(meta: m),
        ],
      ),
    );
  }
}

class _CacheTile extends ConsumerWidget {
  const _CacheTile({required this.meta});
  final CachedContent meta;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final svc = ref.read(contentCacheServiceProvider);
    return Card(
      child: ListTile(
        title: Text(meta.verseId),
        subtitle: Text('Cached at: ${meta.cachedAt.toLocal()} • Size: ${meta.fileSize} B'),
        trailing: IconButton(
          icon: const Icon(Icons.delete_outline),
          onPressed: () async {
            await svc.removeVerse(meta.verseId);
            await ref.read(cachedIndexProvider.notifier).clearExpired();
          },
        ),
      ),
    );
  }
}

