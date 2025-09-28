import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/personalization_constants.dart';
import '../providers/user_profile_provider.dart';
import 'profile_setup_page.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(userProfileProvider);
    final isComplete = ref.watch(isProfileCompleteProvider);
    final completion = ref.watch(profileCompletionPercentProvider);
    final cs = Theme.of(context).colorScheme;

    String deitySummary() {
      final d = profile.deityPreferences;
      return d.isEmpty ? 'Select your focus' : d.join(', ');
    }

    String goalsSummary() {
      final g = profile.spiritualGoals;
      return g.isEmpty ? 'Choose your goals' : g.join(', ');
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            tooltip: 'Edit Profile',
            onPressed: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
          )
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: cs.secondaryContainer,
                    child: Icon(Icons.person, color: cs.onSecondaryContainer),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          profile.hasName ? profile.name : 'Guest User',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        Text(
                          isComplete
                              ? 'Personalized experience enabled'
                              : 'Complete your profile for personalization',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),
              if (!isComplete)
                Card(
                  color: cs.primaryContainer,
                  child: ListTile(
                    leading: Icon(Icons.tips_and_updates, color: cs.onPrimaryContainer),
                    title: Text('Unlock personalized recommendations',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(color: cs.onPrimaryContainer)),
                    subtitle: Text('Set your preferences to tailor daily verses and practices.',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(color: cs.onPrimaryContainer)),
                    trailing: FilledButton(
                      onPressed: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
                      child: const Text('Set up'),
                    ),
                  ),
                ),

              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Profile Completion', style: Theme.of(context).textTheme.labelLarge),
                        const SizedBox(height: 6),
                        LinearProgressIndicator(value: completion),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text('${(completion * 100).round()}%'),
                ],
              ),

              const SizedBox(height: 24),
              const _SectionHeader('Personal Information'),
              _EditableTile(
                icon: Icons.badge_outlined,
                title: 'Name',
                subtitle: profile.hasName ? profile.name : 'Add your name',
                onTap: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
              ),
              _EditableTile(
                icon: Icons.email_outlined,
                title: 'Email',
                subtitle: profile.hasEmail ? profile.email : 'Add your email',
                onTap: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
              ),
              _EditableTile(
                icon: Icons.cake_outlined,
                title: 'Age',
                subtitle: profile.age == null ? 'Set your age' : '${profile.age}',
                onTap: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
              ),

              const SizedBox(height: 16),
              const _SectionHeader('Spiritual Preferences'),
              _EditableTile(
                icon: Icons.self_improvement_outlined,
                title: 'Deity Focus',
                subtitle: deitySummary(),
                onTap: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
              ),
              _EditableTile(
                icon: Icons.temple_hindu_outlined,
                title: 'Tradition',
                subtitle: profile.spiritualTradition ?? 'Choose your tradition',
                onTap: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
              ),
              _EditableTile(
                icon: Icons.local_florist_outlined,
                title: 'Goals',
                subtitle: goalsSummary(),
                onTap: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
              ),

              const SizedBox(height: 16),
              const _SectionHeader('Language Settings'),
              _EditableTile(
                icon: Icons.language_outlined,
                title: 'App Language',
                subtitle: profile.languageEnum?.displayName ?? 'Choose your language',
                onTap: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
              ),

              const SizedBox(height: 16),
              const _SectionHeader('Notification Preferences'),
              _EditableTile(
                icon: Icons.notifications_outlined,
                title: 'Daily Reminder',
                subtitle: profile.notificationTime == null
                    ? 'Set reminder time'
                    : formatTimeOfDay(profile.notificationTime!),
                onTap: () => Navigator.of(context).pushNamed(ProfileSetupPage.routeName),
              ),
              _InlineSwitchTile(
                icon: Icons.record_voice_over_outlined,
                title: 'Audio Prompts',
                value: profile.audioEnabled,
                onChanged: (v) =>
                    ref.read(userProfileProvider.notifier).updateNotificationSettings(audioEnabled: v),
              ),

              const SizedBox(height: 16),
              const _SectionHeader('App Settings'),
              const _StaticTile(icon: Icons.color_lens_outlined, title: 'Theme', subtitle: 'System default'),
              const _StaticTile(icon: Icons.info_outline, title: 'About', subtitle: 'Version and acknowledgements'),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader(this.title);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium,
      ),
    );
  }
}

class _EditableTile extends StatelessWidget {
  const _EditableTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 8),
      leading: Icon(icon),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}

class _InlineSwitchTile extends StatelessWidget {
  const _InlineSwitchTile({
    required this.icon,
    required this.title,
    required this.value,
    required this.onChanged,
  });

  final IconData icon;
  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 8),
      leading: Icon(icon),
      title: Text(title),
      trailing: Switch(value: value, onChanged: onChanged),
      onTap: () => onChanged(!value),
    );
  }
}

class _StaticTile extends StatelessWidget {
  const _StaticTile({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 8),
      leading: Icon(icon),
      title: Text(title),
      subtitle: Text(subtitle),
    );
  }
}
