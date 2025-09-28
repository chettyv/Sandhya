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
      reference: json['reference'] as String,
      commentary: json['commentary'] as String?,
      recommendedMeditationMinutes:
          (json['recommendedMeditationMinutes'] as num?)?.toInt() ?? 10,
    );

Map<String, dynamic> _$$DailyVerseImplToJson(_$DailyVerseImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'scripture': instance.scripture,
      'reference': instance.reference,
      'commentary': instance.commentary,
      'recommendedMeditationMinutes': instance.recommendedMeditationMinutes,
    };
