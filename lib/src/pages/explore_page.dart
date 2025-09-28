import 'package:flutter/material.dart';

// Uses app-wide Material 3 theme configured in AppTheme via MaterialApp

class ExplorePage extends StatelessWidget {
  const ExplorePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Discover Scriptures and Plans',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'Scripture library, curated reading plans, and themed collections are coming soon.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),

              // Scripture Library Section
              Text('Scripture Library', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              const _PlaceholderCard(
                icon: Icons.menu_book_outlined,
                title: 'Browse All Texts',
                subtitle: 'Bhagavad Gita, Upanishads, and more.',
              ),
              const SizedBox(height: 12),
              const _PlaceholderCard(
                icon: Icons.collections_bookmark_outlined,
                title: 'Collections',
                subtitle: 'Topic-based scripture collections to explore.',
              ),

              const SizedBox(height: 24),
              Text('Reading Plans', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              const _PlaceholderCard(
                icon: Icons.auto_stories_outlined,
                title: 'Beginner Plan',
                subtitle: 'Start your journey with daily guidance.',
              ),
              const SizedBox(height: 12),
              const _PlaceholderCard(
                icon: Icons.schedule_outlined,
                title: '7-Day Wisdom',
                subtitle: 'A week of curated verses and reflections.',
              ),

              const SizedBox(height: 24),
              Text('Discover', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              const _PlaceholderListTile(
                leading: Icons.local_fire_department_outlined,
                title: 'Trending Passages',
                subtitle: 'What seekers are reading today.',
              ),
              const _PlaceholderListTile(
                leading: Icons.new_releases_outlined,
                title: 'New & Noteworthy',
                subtitle: 'Fresh additions to the library.',
              ),

              const SizedBox(height: 28),
              Center(
                child: Text(
                  'Coming Soon',
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        letterSpacing: 0.6,
                      ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PlaceholderCard extends StatelessWidget {
  const _PlaceholderCard({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(icon, size: 28),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text(subtitle, style: Theme.of(context).textTheme.bodyMedium),
                ],
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    );
  }
}

class _PlaceholderListTile extends StatelessWidget {
  const _PlaceholderListTile({
    required this.leading,
    required this.title,
    required this.subtitle,
  });

  final IconData leading;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 8),
      leading: Icon(leading),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Explore features coming soon.')),
        );
      },
    );
  }
}
