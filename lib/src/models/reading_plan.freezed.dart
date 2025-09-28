// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'reading_plan.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ReadingPlan _$ReadingPlanFromJson(Map<String, dynamic> json) {
  return _ReadingPlan.fromJson(json);
}

/// @nodoc
mixin _$ReadingPlan {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  int get durationDays => throw _privateConstructorUsedError;
  DifficultyLevel get difficulty => throw _privateConstructorUsedError;
  int get estimatedDailyMinutes => throw _privateConstructorUsedError;
  PlanType get type => throw _privateConstructorUsedError;
  List<ReadingPlanEntry> get entries => throw _privateConstructorUsedError;

  /// Serializes this ReadingPlan to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReadingPlan
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReadingPlanCopyWith<ReadingPlan> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReadingPlanCopyWith<$Res> {
  factory $ReadingPlanCopyWith(
          ReadingPlan value, $Res Function(ReadingPlan) then) =
      _$ReadingPlanCopyWithImpl<$Res, ReadingPlan>;
  @useResult
  $Res call(
      {String id,
      String title,
      String description,
      int durationDays,
      DifficultyLevel difficulty,
      int estimatedDailyMinutes,
      PlanType type,
      List<ReadingPlanEntry> entries});
}

/// @nodoc
class _$ReadingPlanCopyWithImpl<$Res, $Val extends ReadingPlan>
    implements $ReadingPlanCopyWith<$Res> {
  _$ReadingPlanCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReadingPlan
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? durationDays = null,
    Object? difficulty = null,
    Object? estimatedDailyMinutes = null,
    Object? type = null,
    Object? entries = null,
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
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      durationDays: null == durationDays
          ? _value.durationDays
          : durationDays // ignore: cast_nullable_to_non_nullable
              as int,
      difficulty: null == difficulty
          ? _value.difficulty
          : difficulty // ignore: cast_nullable_to_non_nullable
              as DifficultyLevel,
      estimatedDailyMinutes: null == estimatedDailyMinutes
          ? _value.estimatedDailyMinutes
          : estimatedDailyMinutes // ignore: cast_nullable_to_non_nullable
              as int,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as PlanType,
      entries: null == entries
          ? _value.entries
          : entries // ignore: cast_nullable_to_non_nullable
              as List<ReadingPlanEntry>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ReadingPlanImplCopyWith<$Res>
    implements $ReadingPlanCopyWith<$Res> {
  factory _$$ReadingPlanImplCopyWith(
          _$ReadingPlanImpl value, $Res Function(_$ReadingPlanImpl) then) =
      __$$ReadingPlanImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String title,
      String description,
      int durationDays,
      DifficultyLevel difficulty,
      int estimatedDailyMinutes,
      PlanType type,
      List<ReadingPlanEntry> entries});
}

/// @nodoc
class __$$ReadingPlanImplCopyWithImpl<$Res>
    extends _$ReadingPlanCopyWithImpl<$Res, _$ReadingPlanImpl>
    implements _$$ReadingPlanImplCopyWith<$Res> {
  __$$ReadingPlanImplCopyWithImpl(
      _$ReadingPlanImpl _value, $Res Function(_$ReadingPlanImpl) _then)
      : super(_value, _then);

  /// Create a copy of ReadingPlan
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? durationDays = null,
    Object? difficulty = null,
    Object? estimatedDailyMinutes = null,
    Object? type = null,
    Object? entries = null,
  }) {
    return _then(_$ReadingPlanImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      durationDays: null == durationDays
          ? _value.durationDays
          : durationDays // ignore: cast_nullable_to_non_nullable
              as int,
      difficulty: null == difficulty
          ? _value.difficulty
          : difficulty // ignore: cast_nullable_to_non_nullable
              as DifficultyLevel,
      estimatedDailyMinutes: null == estimatedDailyMinutes
          ? _value.estimatedDailyMinutes
          : estimatedDailyMinutes // ignore: cast_nullable_to_non_nullable
              as int,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as PlanType,
      entries: null == entries
          ? _value._entries
          : entries // ignore: cast_nullable_to_non_nullable
              as List<ReadingPlanEntry>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ReadingPlanImpl implements _ReadingPlan {
  const _$ReadingPlanImpl(
      {required this.id,
      required this.title,
      required this.description,
      required this.durationDays,
      this.difficulty = DifficultyLevel.beginner,
      this.estimatedDailyMinutes = 10,
      this.type = PlanType.beginner,
      final List<ReadingPlanEntry> entries = const <ReadingPlanEntry>[]})
      : _entries = entries;

  factory _$ReadingPlanImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReadingPlanImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String description;
  @override
  final int durationDays;
  @override
  @JsonKey()
  final DifficultyLevel difficulty;
  @override
  @JsonKey()
  final int estimatedDailyMinutes;
  @override
  @JsonKey()
  final PlanType type;
  final List<ReadingPlanEntry> _entries;
  @override
  @JsonKey()
  List<ReadingPlanEntry> get entries {
    if (_entries is EqualUnmodifiableListView) return _entries;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_entries);
  }

  @override
  String toString() {
    return 'ReadingPlan(id: $id, title: $title, description: $description, durationDays: $durationDays, difficulty: $difficulty, estimatedDailyMinutes: $estimatedDailyMinutes, type: $type, entries: $entries)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReadingPlanImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.durationDays, durationDays) ||
                other.durationDays == durationDays) &&
            (identical(other.difficulty, difficulty) ||
                other.difficulty == difficulty) &&
            (identical(other.estimatedDailyMinutes, estimatedDailyMinutes) ||
                other.estimatedDailyMinutes == estimatedDailyMinutes) &&
            (identical(other.type, type) || other.type == type) &&
            const DeepCollectionEquality().equals(other._entries, _entries));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      title,
      description,
      durationDays,
      difficulty,
      estimatedDailyMinutes,
      type,
      const DeepCollectionEquality().hash(_entries));

  /// Create a copy of ReadingPlan
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReadingPlanImplCopyWith<_$ReadingPlanImpl> get copyWith =>
      __$$ReadingPlanImplCopyWithImpl<_$ReadingPlanImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ReadingPlanImplToJson(
      this,
    );
  }
}

abstract class _ReadingPlan implements ReadingPlan {
  const factory _ReadingPlan(
      {required final String id,
      required final String title,
      required final String description,
      required final int durationDays,
      final DifficultyLevel difficulty,
      final int estimatedDailyMinutes,
      final PlanType type,
      final List<ReadingPlanEntry> entries}) = _$ReadingPlanImpl;

  factory _ReadingPlan.fromJson(Map<String, dynamic> json) =
      _$ReadingPlanImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get description;
  @override
  int get durationDays;
  @override
  DifficultyLevel get difficulty;
  @override
  int get estimatedDailyMinutes;
  @override
  PlanType get type;
  @override
  List<ReadingPlanEntry> get entries;

  /// Create a copy of ReadingPlan
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReadingPlanImplCopyWith<_$ReadingPlanImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
