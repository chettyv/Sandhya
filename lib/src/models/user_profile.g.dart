// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserProfileImpl _$$UserProfileImplFromJson(Map<String, dynamic> json) =>
    _$UserProfileImpl(
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      age: (json['age'] as num?)?.toInt(),
      deityPreferences: (json['deityPreferences'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      spiritualTradition: json['spiritualTradition'] as String?,
      preferredLanguage: json['preferredLanguage'] as String?,
      spiritualGoals: (json['spiritualGoals'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const <String>[],
      notificationTime: const _TimeOfDayConverter()
          .fromJson(json['notificationTime'] as String?),
      audioEnabled: json['audioEnabled'] as bool? ?? false,
    );

Map<String, dynamic> _$$UserProfileImplToJson(_$UserProfileImpl instance) =>
    <String, dynamic>{
      'name': instance.name,
      'email': instance.email,
      'age': instance.age,
      'deityPreferences': instance.deityPreferences,
      'spiritualTradition': instance.spiritualTradition,
      'preferredLanguage': instance.preferredLanguage,
      'spiritualGoals': instance.spiritualGoals,
      'notificationTime':
          const _TimeOfDayConverter().toJson(instance.notificationTime),
      'audioEnabled': instance.audioEnabled,
    };
