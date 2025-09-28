import 'package:flutter/material.dart';

/// Enumerations and constants used for personalization across the app.

enum SpiritualTradition {
  shaivism,
  vaishnavism,
  shaktism,
  smartism,
  advaita,
  bhakti,
  karmaYoga,
  jnanaYoga,
  rajaYoga,
}

extension SpiritualTraditionDisplay on SpiritualTradition {
  String get displayName {
    switch (this) {
      case SpiritualTradition.shaivism:
        return 'Shaivism';
      case SpiritualTradition.vaishnavism:
        return 'Vaishnavism';
      case SpiritualTradition.shaktism:
        return 'Shaktism';
      case SpiritualTradition.smartism:
        return 'Smartism';
      case SpiritualTradition.advaita:
        return 'Advaita';
      case SpiritualTradition.bhakti:
        return 'Bhakti';
      case SpiritualTradition.karmaYoga:
        return 'Karma Yoga';
      case SpiritualTradition.jnanaYoga:
        return 'Jñāna Yoga';
      case SpiritualTradition.rajaYoga:
        return 'Rāja Yoga';
    }
  }
}

enum DeityPreference {
  ganesha,
  shiva,
  vishnu,
  krishna,
  rama,
  devi,
  durga,
  lakshmi,
  saraswati,
  hanuman,
  murugan,
  surya,
  narayana,
}

extension DeityPreferenceDisplay on DeityPreference {
  String get displayName {
    switch (this) {
      case DeityPreference.ganesha:
        return 'Ganesha';
      case DeityPreference.shiva:
        return 'Shiva';
      case DeityPreference.vishnu:
        return 'Vishnu';
      case DeityPreference.krishna:
        return 'Krishna';
      case DeityPreference.rama:
        return 'Rama';
      case DeityPreference.devi:
        return 'Devi';
      case DeityPreference.durga:
        return 'Durga';
      case DeityPreference.lakshmi:
        return 'Lakshmi';
      case DeityPreference.saraswati:
        return 'Saraswati';
      case DeityPreference.hanuman:
        return 'Hanuman';
      case DeityPreference.murugan:
        return 'Murugan';
      case DeityPreference.surya:
        return 'Surya';
      case DeityPreference.narayana:
        return 'Narayana';
    }
  }
}

enum SpiritualGoal {
  dailyPractice,
  meditation,
  scriptureStudy,
  devotion,
  devotionalSinging,
  ritualPractice,
  philosophicalUnderstanding,
  service,
  mindfulness,
  compassion,
}

extension SpiritualGoalDisplay on SpiritualGoal {
  String get displayName {
    switch (this) {
      case SpiritualGoal.dailyPractice:
        return 'Daily Practice';
      case SpiritualGoal.meditation:
        return 'Meditation';
      case SpiritualGoal.scriptureStudy:
        return 'Scripture Study';
      case SpiritualGoal.devotion:
        return 'Devotion';
      case SpiritualGoal.devotionalSinging:
        return 'Devotional Singing';
      case SpiritualGoal.ritualPractice:
        return 'Ritual Practice';
      case SpiritualGoal.philosophicalUnderstanding:
        return 'Philosophical Understanding';
      case SpiritualGoal.service:
        return 'Service (Seva)';
      case SpiritualGoal.mindfulness:
        return 'Mindfulness';
      case SpiritualGoal.compassion:
        return 'Compassion';
    }
  }
}

enum SupportedLanguage {
  english('en'),
  hindi('hi'),
  sanskrit('sa'),
  tamil('ta'),
  telugu('te'),
  bengali('bn'),
  marathi('mr'),
  gujarati('gu'),
  kannada('kn'),
  malayalam('ml'),
  punjabi('pa'),
  odia('or'),
  urdu('ur');

  const SupportedLanguage(this.code);
  final String code;

  String get displayName {
    switch (this) {
      case SupportedLanguage.english:
        return 'English';
      case SupportedLanguage.hindi:
        return 'Hindi';
      case SupportedLanguage.sanskrit:
        return 'Sanskrit';
      case SupportedLanguage.tamil:
        return 'Tamil';
      case SupportedLanguage.telugu:
        return 'Telugu';
      case SupportedLanguage.bengali:
        return 'Bengali';
      case SupportedLanguage.marathi:
        return 'Marathi';
      case SupportedLanguage.gujarati:
        return 'Gujarati';
      case SupportedLanguage.kannada:
        return 'Kannada';
      case SupportedLanguage.malayalam:
        return 'Malayalam';
      case SupportedLanguage.punjabi:
        return 'Punjabi';
      case SupportedLanguage.odia:
        return 'Odia';
      case SupportedLanguage.urdu:
        return 'Urdu';
    }
  }
}

// ------------ Helpers & Validation --------------

final Map<DeityPreference, List<String>> deityKeywordsMap = {
  DeityPreference.ganesha: const ['ganesha', 'ganesh', 'vinayaka'],
  DeityPreference.shiva: const ['shiva', 'mahadeva', 'mahadev', 'shankara', 'shiv'],
  DeityPreference.vishnu: const ['vishnu', 'hari', 'narayana'],
  DeityPreference.krishna: const ['krishna', 'govinda', 'gopal', 'madhava'],
  DeityPreference.rama: const ['rama', 'ram'],
  DeityPreference.devi: const ['devi', 'shakti', 'ambika'],
  DeityPreference.durga: const ['durga', 'parvati', 'uma'],
  DeityPreference.lakshmi: const ['lakshmi', 'laxmi', 'shri'],
  DeityPreference.saraswati: const ['saraswati', 'sarawati'],
  DeityPreference.hanuman: const ['hanuman', 'anjaneya', 'maruti'],
  DeityPreference.murugan: const ['murugan', 'kartikeya', 'skanda', 'subrahmanya'],
  DeityPreference.surya: const ['surya', 'aditya', 'bhaskara'],
  DeityPreference.narayana: const ['narayana', 'narayan'],
};

final Map<SpiritualGoal, List<String>> goalKeywordsMap = {
  SpiritualGoal.dailyPractice: const ['daily', 'practice', 'routine'],
  SpiritualGoal.meditation: const ['meditation', 'dhyana', 'meditate'],
  SpiritualGoal.scriptureStudy: const ['study', 'scripture', 'gita', 'upanishad'],
  SpiritualGoal.devotion: const ['devotion', 'bhakti', 'worship'],
  SpiritualGoal.devotionalSinging: const ['kirtan', 'bhajan', 'singing'],
  SpiritualGoal.ritualPractice: const ['ritual', 'puja', 'homa', 'havan'],
  SpiritualGoal.philosophicalUnderstanding: const ['philosophy', 'jnana', 'wisdom', 'understanding'],
  SpiritualGoal.service: const ['seva', 'service', 'help'],
  SpiritualGoal.mindfulness: const ['mindfulness', 'awareness', 'presence'],
  SpiritualGoal.compassion: const ['compassion', 'kindness', 'ahimsa'],
};

bool isValidAge(int age) => age >= 13 && age <= 100;

bool isValidLanguageCode(String code) =>
    SupportedLanguage.values.any((l) => l.code.toLowerCase() == code.toLowerCase());

SpiritualTradition? parseTradition(String? value) {
  if (value == null) return null;
  final v = value.toLowerCase();
  for (final t in SpiritualTradition.values) {
    if (t.displayName.toLowerCase() == v || t.name.toLowerCase() == v) return t;
  }
  return null;
}

DeityPreference? parseDeity(String value) {
  final v = value.toLowerCase();
  for (final d in DeityPreference.values) {
    if (d.displayName.toLowerCase() == v || d.name.toLowerCase() == v) return d;
  }
  return null;
}

SpiritualGoal? parseGoal(String value) {
  final v = value.toLowerCase();
  for (final g in SpiritualGoal.values) {
    if (g.displayName.toLowerCase() == v || g.name.toLowerCase() == v) return g;
  }
  return null;
}

SupportedLanguage? parseLanguage(String value) {
  final v = value.toLowerCase();
  for (final l in SupportedLanguage.values) {
    if (l.code == v || l.displayName.toLowerCase() == v || l.name.toLowerCase() == v) {
      return l;
    }
  }
  return null;
}

/// Formats a [TimeOfDay] to HH:mm for storage / display helpers.
String formatTimeOfDay(TimeOfDay t) {
  final h = t.hour.toString().padLeft(2, '0');
  final m = t.minute.toString().padLeft(2, '0');
  return '$h:$m';
}

TimeOfDay? tryParseTimeOfDay(String? value) {
  if (value == null || value.isEmpty) return null;
  final parts = value.split(':');
  if (parts.length != 2) return null;
  final h = int.tryParse(parts[0]);
  final m = int.tryParse(parts[1]);
  if (h == null || m == null) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return TimeOfDay(hour: h, minute: m);
}

