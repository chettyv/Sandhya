import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/offline_status.dart';
import '../providers/content_cache_provider.dart';

class OfflineIndicator extends ConsumerWidget {
  const OfflineIndicator({super.key, this.compact = true});
  final bool compact;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statusAsync = ref.watch(offlineStatusProvider);
    return statusAsync.when(
      data: (s) => compact ? _Chip(status: s) : _Card(status: s),
      loading: () => const SizedBox.shrink(),
      error: (_, __) => const SizedBox.shrink(),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.status});
  final OfflineStatus status;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    Color bg;
    if (!status.isOnline && !status.canOperateOffline) {
      bg = cs.errorContainer;
    } else if (status.cacheStatus == CacheHealth.fullyCached || status.essentialContentCached) {
      bg = cs.tertiaryContainer;
    } else if (status.cacheStatus == CacheHealth.partiallyCached) {
      bg = cs.secondaryContainer;
    } else {
      bg = cs.surfaceVariant;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(status.isOnline ? Icons.wifi : Icons.wifi_off, size: 16),
          const SizedBox(width: 6),
          Text(
            status.statusMessage,
            style: Theme.of(context).textTheme.labelSmall,
          ),
        ],
      ),
    );
  }
}

class _Card extends StatelessWidget {
  const _Card({required this.status});
  final OfflineStatus status;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(status.isOnline ? Icons.wifi : Icons.wifi_off),
                const SizedBox(width: 8),
                Text(status.statusMessage, style: Theme.of(context).textTheme.titleSmall),
              ],
            ),
            const SizedBox(height: 8),
            Text('Cached items: ${status.totalCachedItems}', style: Theme.of(context).textTheme.bodySmall),
            if (status.lastOnlineAt case final d?) ...[
              const SizedBox(height: 4),
              Text('Last online: ${d.toLocal()}', style: Theme.of(context).textTheme.bodySmall),
            ],
          ],
        ),
      ),
    );
  }
}

