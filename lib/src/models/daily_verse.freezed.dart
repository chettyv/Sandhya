// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'daily_verse.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

DailyVerse _$DailyVerseFromJson(Map<String, dynamic> json) {
  return _DailyVerse.fromJson(json);
}

/// @nodoc
mixin _$DailyVerse {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get scripture => throw _privateConstructorUsedError;
  String get reference => throw _privateConstructorUsedError;
  String? get commentary => throw _privateConstructorUsedError;
  int get recommendedMeditationMinutes => throw _privateConstructorUsedError;

  /// Serializes this DailyVerse to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DailyVerse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DailyVerseCopyWith<DailyVerse> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DailyVerseCopyWith<$Res> {
  factory $DailyVerseCopyWith(
          DailyVerse value, $Res Function(DailyVerse) then) =
      _$DailyVerseCopyWithImpl<$Res, DailyVerse>;
  @useResult
  $Res call(
      {String id,
      String title,
      String scripture,
      String reference,
      String? commentary,
      int recommendedMeditationMinutes});
}

/// @nodoc
class _$DailyVerseCopyWithImpl<$Res, $Val extends DailyVerse>
    implements $DailyVerseCopyWith<$Res> {
  _$DailyVerseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DailyVerse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? scripture = null,
    Object? reference = null,
    Object? commentary = freezed,
    Object? recommendedMeditationMinutes = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      scripture: null == scripture
          ? _value.scripture
          : scripture // ignore: cast_nullable_to_non_nullable
              as String,
      reference: null == reference
          ? _value.reference
          : reference // ignore: cast_nullable_to_non_nullable
              as String,
      commentary: freezed == commentary
          ? _value.commentary
          : commentary // ignore: cast_nullable_to_non_nullable
              as String?,
      recommendedMeditationMinutes: null == recommendedMeditationMinutes
          ? _value.recommendedMeditationMinutes
          : recommendedMeditationMinutes // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$DailyVerseImplCopyWith<$Res>
    implements $DailyVerseCopyWith<$Res> {
  factory _$$DailyVerseImplCopyWith(
          _$DailyVerseImpl value, $Res Function(_$DailyVerseImpl) then) =
      __$$DailyVerseImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String title,
      String scripture,
      String reference,
      String? commentary,
      int recommendedMeditationMinutes});
}

/// @nodoc
class __$$DailyVerseImplCopyWithImpl<$Res>
    extends _$DailyVerseCopyWithImpl<$Res, _$DailyVerseImpl>
    implements _$$DailyVerseImplCopyWith<$Res> {
  __$$DailyVerseImplCopyWithImpl(
      _$DailyVerseImpl _value, $Res Function(_$DailyVerseImpl) _then)
      : super(_value, _then);

  /// Create a copy of DailyVerse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? scripture = null,
    Object? reference = null,
    Object? commentary = freezed,
    Object? recommendedMeditationMinutes = null,
  }) {
    return _then(_$DailyVerseImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      scripture: null == scripture
          ? _value.scripture
          : scripture // ignore: cast_nullable_to_non_nullable
              as String,
      reference: null == reference
          ? _value.reference
          : reference // ignore: cast_nullable_to_non_nullable
              as String,
      commentary: freezed == commentary
          ? _value.commentary
          : commentary // ignore: cast_nullable_to_non_nullable
              as String?,
      recommendedMeditationMinutes: null == recommendedMeditationMinutes
          ? _value.recommendedMeditationMinutes
          : recommendedMeditationMinutes // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DailyVerseImpl implements _DailyVerse {
  const _$DailyVerseImpl(
      {required this.id,
      required this.title,
      required this.scripture,
      required this.reference,
      this.commentary,
      this.recommendedMeditationMinutes = 10});

  factory _$DailyVerseImpl.fromJson(Map<String, dynamic> json) =>
      _$$DailyVerseImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String scripture;
  @override
  final String reference;
  @override
  final String? commentary;
  @override
  @JsonKey()
  final int recommendedMeditationMinutes;

  @override
  String toString() {
    return 'DailyVerse(id: $id, title: $title, scripture: $scripture, reference: $reference, commentary: $commentary, recommendedMeditationMinutes: $recommendedMeditationMinutes)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DailyVerseImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.scripture, scripture) ||
                other.scripture == scripture) &&
            (identical(other.reference, reference) ||
                other.reference == reference) &&
            (identical(other.commentary, commentary) ||
                other.commentary == commentary) &&
            (identical(other.recommendedMeditationMinutes,
                    recommendedMeditationMinutes) ||
                other.recommendedMeditationMinutes ==
                    recommendedMeditationMinutes));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, title, scripture, reference,
      commentary, recommendedMeditationMinutes);

  /// Create a copy of DailyVerse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DailyVerseImplCopyWith<_$DailyVerseImpl> get copyWith =>
      __$$DailyVerseImplCopyWithImpl<_$DailyVerseImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DailyVerseImplToJson(
      this,
    );
  }
}

abstract class _DailyVerse implements DailyVerse {
  const factory _DailyVerse(
      {required final String id,
      required final String title,
      required final String scripture,
      required final String reference,
      final String? commentary,
      final int recommendedMeditationMinutes}) = _$DailyVerseImpl;

  factory _DailyVerse.fromJson(Map<String, dynamic> json) =
      _$DailyVerseImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get scripture;
  @override
  String get reference;
  @override
  String? get commentary;
  @override
  int get recommendedMeditationMinutes;

  /// Create a copy of DailyVerse
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DailyVerseImplCopyWith<_$DailyVerseImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
