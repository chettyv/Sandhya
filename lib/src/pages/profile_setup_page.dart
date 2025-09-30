import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/personalization_constants.dart';
import '../providers/user_profile_provider.dart';
import '../widgets/profile_form_widgets.dart';

class ProfileSetupPage extends ConsumerStatefulWidget {
  const ProfileSetupPage({super.key});

  static const routeName = '/profile-setup';

  @override
  ConsumerState<ProfileSetupPage> createState() => _ProfileSetupPageState();
}

class _ProfileSetupPageState extends ConsumerState<ProfileSetupPage> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _nameController;
  late TextEditingController _emailController;
  int _age = 21;
  List<String> _deities = const [];
  String? _tradition;
  String? _languageCode;
  List<String> _goals = const [];
  TimeOfDay? _notifTime;
  bool _audioEnabled = false;

  @override
  void initState() {
    super.initState();
    final p = ref.read(userProfileProvider);
    _nameController = TextEditingController(text: p.name);
    _emailController = TextEditingController(text: p.email);
    _age = p.age ?? 21;
    _deities = List<String>.from(p.deityPreferences);
    _tradition = p.spiritualTradition;
    _languageCode = p.preferredLanguage ?? SupportedLanguage.english.code;
    _goals = List<String>.from(p.spiritualGoals);
    _notifTime = p.notificationTime;
    _audioEnabled = p.audioEnabled;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final completion = ref.watch(profileCompletionPercentProvider);
    final notifier = ref.read(userProfileProvider.notifier);

    final deityOptions = DeityPreference.values.map((e) => e.displayName).toList();
    final goalOptions = SpiritualGoal.values.map((e) => e.displayName).toList();
    final traditionItems = SpiritualTradition.values
        .map((t) => DropdownMenuItem<String>(value: t.displayName, child: Text(t.displayName)))
        .toList();
    final languageItems = SupportedLanguage.values
        .map((l) => DropdownMenuItem<String>(value: l.code, child: Text(l.displayName)))
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile Setup'),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Personalize Your Journey', style: Theme.of(context).textTheme.titleLarge),
                          const SizedBox(height: 4),
                          Text(
                            'Set your preferences to receive tailored verses, reflections, and reminders.',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    SizedBox(
                      width: 84,
                      child: Column(
                        children: [
                          Text('${(completion * 100).round()}%'),
                          const SizedBox(height: 6),
                          LinearProgressIndicator(value: completion),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text('Basic Information', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 12),
                ProfileTextField(
                  label: 'Name',
                  hint: 'Your name',
                  initialValue: _nameController.text,
                  textInputAction: TextInputAction.next,
                  onChanged: (v) => _nameController.text = v,
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Please enter your name' : null,
                ),
                const SizedBox(height: 12),
                ProfileTextField(
                  label: 'Email (optional)',
                  hint: 'name@example.com',
                  initialValue: _emailController.text,
                  keyboardType: TextInputType.emailAddress,
                  onChanged: (v) => _emailController.text = v,
                  validator: (v) {
                    final t = (v ?? '').trim();
                    if (t.isEmpty) return null;
                    final ok = RegExp(r'^.+@.+\..+$').hasMatch(t);
                    return ok ? null : 'Invalid email';
                  },
                ),
                const SizedBox(height: 12),
                AgeSlider(
                  age: _age,
                  onChanged: (v) => setState(() => _age = v),
                ),
                const SizedBox(height: 24),
                Text('Spiritual Preferences', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 12),
                Text('Deity Preferences', style: Theme.of(context).textTheme.labelLarge),
                const SizedBox(height: 8),
                MultiSelectChips(
                  options: deityOptions,
                  selected: _deities,
                  onChanged: (v) => setState(() => _deities = v),
                ),
                const SizedBox(height: 12),
                DropdownFormField<String>(
                  label: 'Tradition',
                  hint: 'Select',
                  value: _tradition,
                  items: traditionItems,
                  onChanged: (v) => setState(() => _tradition = v),
                ),
                const SizedBox(height: 12),
                Text('Spiritual Goals', style: Theme.of(context).textTheme.labelLarge),
                const SizedBox(height: 8),
                MultiSelectChips(
                  options: goalOptions,
                  selected: _goals,
                  onChanged: (v) => setState(() => _goals = v),
                ),
                const SizedBox(height: 12),
                DropdownFormField<String>(
                  label: 'App Language',
                  value: _languageCode,
                  items: languageItems,
                  onChanged: (v) => setState(() => _languageCode = v),
                ),
                const SizedBox(height: 24),
                Text('Notifications', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                TimePickerTile(
                  title: 'Daily Reminder Time',
                  time: _notifTime,
                  onChanged: (t) => setState(() => _notifTime = t),
                ),
                BoolSwitchTile(
                  title: 'Enable Audio Prompts',
                  subtitle: 'Include devotional audio guidance where available',
                  value: _audioEnabled,
                  onChanged: (v) => setState(() => _audioEnabled = v),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    OutlinedButton(
                      onPressed: () async {
                        if (!_formKey.currentState!.validate()) return;
                        final navigator = Navigator.of(context);
                        await notifier.updateBasicInfo(
                          name: _nameController.text.trim(),
                          email: _emailController.text.trim(),
                        );
                        await notifier.updateAge(_age);
                        await notifier.updateDeityPreferences(_deities);
                        await notifier.updateSpiritualTradition(_tradition);
                        if (_languageCode != null) {
                          await notifier.updatePreferredLanguage(_languageCode!);
                        }
                        await notifier.updateSpiritualGoals(_goals);
                        await notifier.updateNotificationSettings(
                          time: _notifTime,
                          audioEnabled: _audioEnabled,
                        );
                        if (!context.mounted) return;
                        navigator.pop();
                      },
                      child: const Text('Save & Continue'),
                    ),
                    const SizedBox(width: 12),
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text('Skip for now'),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
