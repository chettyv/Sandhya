import 'package:flutter/material.dart';

// Uses app-wide Material 3 theme configured in AppTheme via MaterialApp

class JournalPage extends StatelessWidget {
  const JournalPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Journal'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('New entry composer coming soon.')),
          );
        },
        icon: const Icon(Icons.edit),
        label: const Text('New Entry'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Reflect and Grow',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'Daily prompts and a rich editor will help guide your spiritual journaling. Full features are on the way.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),

              Text('Recent Entries', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              const _EntryCard(title: 'Gratitude Reflection', snippet: 'Felt deep gratitude for guidance today...'),
              const SizedBox(height: 12),
              const _EntryCard(title: 'Morning Contemplation', snippet: 'The verse reminded me to stay present...'),

              const SizedBox(height: 24),
              Text('Daily Prompts', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              const _PromptTile(
                icon: Icons.lightbulb_outline,
                title: 'What did today\'s shloka evoke?',
              ),
              const _PromptTile(
                icon: Icons.self_improvement_outlined,
                title: 'How can I live the teaching?',
              ),

              const SizedBox(height: 24),
              Text('Reflection History', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              const _HistoryTile(date: 'Sep 26', title: 'Cultivating steadiness'),
              const _HistoryTile(date: 'Sep 25', title: 'Acts of kindness'),

              const SizedBox(height: 28),
              Center(
                child: Text(
                  'Journaling features coming soon',
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

class _EntryCard extends StatelessWidget {
  const _EntryCard({required this.title, required this.snippet});

  final String title;
  final String snippet;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 6),
            Text(snippet, style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }
}

class _PromptTile extends StatelessWidget {
  const _PromptTile({required this.icon, required this.title});

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Prompt flow coming soon.')),
        );
      },
    );
  }
}

class _HistoryTile extends StatelessWidget {
  const _HistoryTile({required this.date, required this.title});

  final String date;
  final String title;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        child: Text(
          date,
          style: const TextStyle(fontSize: 11),
        ),
      ),
      title: Text(title),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Reading past entry soon available.')),
        );
      },
    );
  }
}
