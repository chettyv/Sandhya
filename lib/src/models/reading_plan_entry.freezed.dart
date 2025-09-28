// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'reading_plan_entry.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ReadingPlanEntry _$ReadingPlanEntryFromJson(Map<String, dynamic> json) {
  return _ReadingPlanEntry.fromJson(json);
}

/// @nodoc
mixin _$ReadingPlanEntry {
  int get dayNumber => throw _privateConstructorUsedError;
  String get verseId => throw _privateConstructorUsedError;
  String? get guidance => throw _privateConstructorUsedError;
  List<String> get reflectionQuestions => throw _privateConstructorUsedError;
  List<String> get suggestedPractices => throw _privateConstructorUsedError;
  int get estimatedMinutes => throw _privateConstructorUsedError;
  List<int> get prerequisites => throw _privateConstructorUsedError;

  /// Serializes this ReadingPlanEntry to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReadingPlanEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReadingPlanEntryCopyWith<ReadingPlanEntry> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReadingPlanEntryCopyWith<$Res> {
  factory $ReadingPlanEntryCopyWith(
          ReadingPlanEntry value, $Res Function(ReadingPlanEntry) then) =
      _$ReadingPlanEntryCopyWithImpl<$Res, ReadingPlanEntry>;
  @useResult
  $Res call(
      {int dayNumber,
      String verseId,
      String? guidance,
      List<String> reflectionQuestions,
      List<String> suggestedPractices,
      int estimatedMinutes,
      List<int> prerequisites});
}

/// @nodoc
class _$ReadingPlanEntryCopyWithImpl<$Res, $Val extends ReadingPlanEntry>
    implements $ReadingPlanEntryCopyWith<$Res> {
  _$ReadingPlanEntryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReadingPlanEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? dayNumber = null,
    Object? verseId = null,
    Object? guidance = freezed,
    Object? reflectionQuestions = null,
    Object? suggestedPractices = null,
    Object? estimatedMinutes = null,
    Object? prerequisites = null,
  }) {
    return _then(_value.copyWith(
      dayNumber: null == dayNumber
          ? _value.dayNumber
          : dayNumber // ignore: cast_nullable_to_non_nullable
              as int,
      verseId: null == verseId
          ? _value.verseId
          : verseId // ignore: cast_nullable_to_non_nullable
              as String,
      guidance: freezed == guidance
          ? _value.guidance
          : guidance // ignore: cast_nullable_to_non_nullable
              as String?,
      reflectionQuestions: null == reflectionQuestions
          ? _value.reflectionQuestions
          : reflectionQuestions // ignore: cast_nullable_to_non_nullable
              as List<String>,
      suggestedPractices: null == suggestedPractices
          ? _value.suggestedPractices
          : suggestedPractices // ignore: cast_nullable_to_non_nullable
              as List<String>,
      estimatedMinutes: null == estimatedMinutes
          ? _value.estimatedMinutes
          : estimatedMinutes // ignore: cast_nullable_to_non_nullable
              as int,
      prerequisites: null == prerequisites
          ? _value.prerequisites
          : prerequisites // ignore: cast_nullable_to_non_nullable
              as List<int>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ReadingPlanEntryImplCopyWith<$Res>
    implements $ReadingPlanEntryCopyWith<$Res> {
  factory _$$ReadingPlanEntryImplCopyWith(_$ReadingPlanEntryImpl value,
          $Res Function(_$ReadingPlanEntryImpl) then) =
      __$$ReadingPlanEntryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int dayNumber,
      String verseId,
      String? guidance,
      List<String> reflectionQuestions,
      List<String> suggestedPractices,
      int estimatedMinutes,
      List<int> prerequisites});
}

/// @nodoc
class __$$ReadingPlanEntryImplCopyWithImpl<$Res>
    extends _$ReadingPlanEntryCopyWithImpl<$Res, _$ReadingPlanEntryImpl>
    implements _$$ReadingPlanEntryImplCopyWith<$Res> {
  __$$ReadingPlanEntryImplCopyWithImpl(_$ReadingPlanEntryImpl _value,
      $Res Function(_$ReadingPlanEntryImpl) _then)
      : super(_value, _then);

  /// Create a copy of ReadingPlanEntry
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? dayNumber = null,
    Object? verseId = null,
    Object? guidance = freezed,
    Object? reflectionQuestions = null,
    Object? suggestedPractices = null,
    Object? estimatedMinutes = null,
    Object? prerequisites = null,
  }) {
    return _then(_$ReadingPlanEntryImpl(
      dayNumber: null == dayNumber
          ? _value.dayNumber
          : dayNumber // ignore: cast_nullable_to_non_nullable
              as int,
      verseId: null == verseId
          ? _value.verseId
          : verseId // ignore: cast_nullable_to_non_nullable
              as String,
      guidance: freezed == guidance
          ? _value.guidance
          : guidance // ignore: cast_nullable_to_non_nullable
              as String?,
      reflectionQuestions: null == reflectionQuestions
          ? _value._reflectionQuestions
          : reflectionQuestions // ignore: cast_nullable_to_non_nullable
              as List<String>,
      suggestedPractices: null == suggestedPractices
          ? _value._suggestedPractices
          : suggestedPractices // ignore: cast_nullable_to_non_nullable
              as List<String>,
      estimatedMinutes: null == estimatedMinutes
          ? _value.estimatedMinutes
          : estimatedMinutes // ignore: cast_nullable_to_non_nullable
              as int,
      prerequisites: null == prerequisites
          ? _value._prerequisites
          : prerequisites // ignore: cast_nullable_to_non_nullable
              as List<int>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ReadingPlanEntryImpl implements _ReadingPlanEntry {
  const _$ReadingPlanEntryImpl(
      {required this.dayNumber,
      required this.verseId,
      this.guidance,
      final List<String> reflectionQuestions = const <String>[],
      final List<String> suggestedPractices = const <String>[],
      this.estimatedMinutes = 10,
      final List<int> prerequisites = const <int>[]})
      : _reflectionQuestions = reflectionQuestions,
        _suggestedPractices = suggestedPractices,
        _prerequisites = prerequisites;

  factory _$ReadingPlanEntryImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReadingPlanEntryImplFromJson(json);

  @override
  final int dayNumber;
  @override
  final String verseId;
  @override
  final String? guidance;
  final List<String> _reflectionQuestions;
  @override
  @JsonKey()
  List<String> get reflectionQuestions {
    if (_reflectionQuestions is EqualUnmodifiableListView)
      return _reflectionQuestions;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_reflectionQuestions);
  }

  final List<String> _suggestedPractices;
  @override
  @JsonKey()
  List<String> get suggestedPractices {
    if (_suggestedPractices is EqualUnmodifiableListView)
      return _suggestedPractices;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_suggestedPractices);
  }

  @override
  @JsonKey()
  final int estimatedMinutes;
  final List<int> _prerequisites;
  @override
  @JsonKey()
  List<int> get prerequisites {
    if (_prerequisites is EqualUnmodifiableListView) return _prerequisites;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_prerequisites);
  }

  @override
  String toString() {
    return 'ReadingPlanEntry(dayNumber: $dayNumber, verseId: $verseId, guidance: $guidance, reflectionQuestions: $reflectionQuestions, suggestedPractices: $suggestedPractices, estimatedMinutes: $estimatedMinutes, prerequisites: $prerequisites)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReadingPlanEntryImpl &&
            (identical(other.dayNumber, dayNumber) ||
                other.dayNumber == dayNumber) &&
            (identical(other.verseId, verseId) || other.verseId == verseId) &&
            (identical(other.guidance, guidance) ||
                other.guidance == guidance) &&
            const DeepCollectionEquality()
                .equals(other._reflectionQuestions, _reflectionQuestions) &&
            const DeepCollectionEquality()
                .equals(other._suggestedPractices, _suggestedPractices) &&
            (identical(other.estimatedMinutes, estimatedMinutes) ||
                other.estimatedMinutes == estimatedMinutes) &&
            const DeepCollectionEquality()
                .equals(other._prerequisites, _prerequisites));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      dayNumber,
      verseId,
      guidance,
      const DeepCollectionEquality().hash(_reflectionQuestions),
      const DeepCollectionEquality().hash(_suggestedPractices),
      estimatedMinutes,
      const DeepCollectionEquality().hash(_prerequisites));

  /// Create a copy of ReadingPlanEntry
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReadingPlanEntryImplCopyWith<_$ReadingPlanEntryImpl> get copyWith =>
      __$$ReadingPlanEntryImplCopyWithImpl<_$ReadingPlanEntryImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ReadingPlanEntryImplToJson(
      this,
    );
  }
}

abstract class _ReadingPlanEntry implements ReadingPlanEntry {
  const factory _ReadingPlanEntry(
      {required final int dayNumber,
      required final String verseId,
      final String? guidance,
      final List<String> reflectionQuestions,
      final List<String> suggestedPractices,
      final int estimatedMinutes,
      final List<int> prerequisites}) = _$ReadingPlanEntryImpl;

  factory _ReadingPlanEntry.fromJson(Map<String, dynamic> json) =
      _$ReadingPlanEntryImpl.fromJson;

  @override
  int get dayNumber;
  @override
  String get verseId;
  @override
  String? get guidance;
  @override
  List<String> get reflectionQuestions;
  @override
  List<String> get suggestedPractices;
  @override
  int get estimatedMinutes;
  @override
  List<int> get prerequisites;

  /// Create a copy of ReadingPlanEntry
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReadingPlanEntryImplCopyWith<_$ReadingPlanEntryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
