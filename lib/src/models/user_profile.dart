import 'package:flutter/material.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../core/personalization_constants.dart';

part 'user_profile.freezed.dart';
part 'user_profile.g.dart';

class _TimeOfDayConverter implements JsonConverter<TimeOfDay?, String?> {
  const _TimeOfDayConverter();
  @override
  TimeOfDay? fromJson(String? json) => tryParseTimeOfDay(json);
  @override
  String? toJson(TimeOfDay? object) => object == null ? null : formatTimeOfDay(object);
}

/// Immutable user profile capturing personalization preferences.
@freezed
class UserProfile with _$UserProfile {
  const factory UserProfile({
    // Basic
    @Default('') String name,
    @Default('') String email,
    int? age,

    // Preferences
    @Default(<String>[]) List<String> deityPreferences, // e.g., 'Shiva', 'Krishna'
    String? spiritualTradition, // e.g., 'Shaivism'
    String? preferredLanguage, // e.g., 'en'
    @Default(<String>[]) List<String> spiritualGoals, // e.g., 'Meditation'

    // Notifications / Audio
    @_TimeOfDayConverter() TimeOfDay? notificationTime,
    @Default(false) bool audioEnabled,
  }) = _UserProfile;

  const UserProfile._();

  factory UserProfile.fromJson(Map<String, dynamic> json) => _$UserProfileFromJson(json);

  /// Recommended default for new users.
  factory UserProfile.defaults() => const UserProfile(
        name: '',
        email: '',
        deityPreferences: <String>[],
        spiritualGoals: <String>[],
        audioEnabled: false,
      );

  bool get hasName => name.trim().isNotEmpty;
  bool get hasEmail => email.trim().isNotEmpty;
  bool get hasAge => age != null && isValidAge(age!);
  bool get hasLanguage => preferredLanguage != null && isValidLanguageCode(preferredLanguage!);

  /// Minimal completion for enabling personalization.
  bool get isComplete {
    final deityOk = deityPreferences.isNotEmpty;
    final goalOk = spiritualGoals.isNotEmpty;
    return hasName && hasAge && hasLanguage && deityOk && goalOk;
  }

  SpiritualTradition? get traditionEnum => parseTradition(spiritualTradition);

  List<DeityPreference> get deityEnums =>
      deityPreferences.map(parseDeity).whereType<DeityPreference>().toList(growable: false);

  List<SpiritualGoal> get goalEnums =>
      spiritualGoals.map(parseGoal).whereType<SpiritualGoal>().toList(growable: false);

  SupportedLanguage? get languageEnum => preferredLanguage == null
      ? null
      : parseLanguage(preferredLanguage!);
}

