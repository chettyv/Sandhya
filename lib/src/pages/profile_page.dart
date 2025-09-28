import 'package:flutter/material.dart';

// Uses app-wide Material 3 theme configured in AppTheme via MaterialApp

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
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
                        Text('Guest User', style: Theme.of(context).textTheme.titleMedium),
                        Text('Personalize your experience', style: Theme.of(context).textTheme.bodySmall),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),
              const _SectionHeader('Personal Information'),
              const _SettingTile(icon: Icons.badge_outlined, title: 'Name', subtitle: 'Add your name'),
              const _SettingTile(icon: Icons.email_outlined, title: 'Email', subtitle: 'Add your email'),

              const SizedBox(height: 16),
              const _SectionHeader('Spiritual Preferences'),
              const _SettingTile(icon: Icons.self_improvement_outlined, title: 'Deity Focus', subtitle: 'Select your focus'),
              const _SettingTile(icon: Icons.temple_hindu_outlined, title: 'Tradition', subtitle: 'Choose your tradition'),

              const SizedBox(height: 16),
              const _SectionHeader('Language Settings'),
              const _SettingTile(icon: Icons.language_outlined, title: 'App Language', subtitle: 'Choose your language'),

              const SizedBox(height: 16),
              const _SectionHeader('Notification Preferences'),
              const _SettingTile(icon: Icons.notifications_outlined, title: 'Daily Reminder', subtitle: 'Set reminder time'),
              const _SettingTile(icon: Icons.record_voice_over_outlined, title: 'Audio Alerts', subtitle: 'Enable reading prompts'),

              const SizedBox(height: 16),
              const _SectionHeader('App Settings'),
              const _SettingTile(icon: Icons.color_lens_outlined, title: 'Theme', subtitle: 'System default'),
              const _SettingTile(icon: Icons.info_outline, title: 'About', subtitle: 'Version and acknowledgements'),

              const SizedBox(height: 28),
              Center(
                child: Text(
                  'Personalization features coming soon',
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: cs.primary,
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

class _SettingTile extends StatelessWidget {
  const _SettingTile({
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
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile settings coming soon.')),
        );
      },
    );
  }
}
