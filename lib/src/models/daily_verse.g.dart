// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_verse.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DailyVerseImpl _$$DailyVerseImplFromJson(Map<String, dynamic> json) =>
    _$DailyVerseImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      scripture: json['scripture'] as String,
      transliteration: json['transliteration'] as String?,
      reference: json['reference'] as String,
      commentary: json['commentary'] as String?,
      translations: (json['translations'] as Map<String, dynamic>?)?.map(
        (k, e) => MapEntry(k, e as String),
      ),
      devotionalTitle: json['devotionalTitle'] as String?,
      devotionalReflection: json['devotionalReflection'] as String?,
      prayerTitle: json['prayerTitle'] as String?,
      prayerText: json['prayerText'] as String?,
      journalPrompt: json['journalPrompt'] as String?,
      recommendedMeditationMinutes:
          (json['recommendedMeditationMinutes'] as num?)?.toInt() ?? 10,
    );

Map<String, dynamic> _$$DailyVerseImplToJson(_$DailyVerseImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'scripture': instance.scripture,
      'transliteration': instance.transliteration,
      'reference': instance.reference,
      'commentary': instance.commentary,
      'translations': instance.translations,
      'devotionalTitle': instance.devotionalTitle,
      'devotionalReflection': instance.devotionalReflection,
      'prayerTitle': instance.prayerTitle,
      'prayerText': instance.prayerText,
      'journalPrompt': instance.journalPrompt,
      'recommendedMeditationMinutes': instance.recommendedMeditationMinutes,
    };
