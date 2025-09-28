// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'streak_data.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

StreakData _$StreakDataFromJson(Map<String, dynamic> json) {
  return _StreakData.fromJson(json);
}

/// @nodoc
mixin _$StreakData {
  int get currentStreak => throw _privateConstructorUsedError;
  int get longestStreak => throw _privateConstructorUsedError;
  DateTime? get lastCompletionDate => throw _privateConstructorUsedError;
  DateTime get weekStart => throw _privateConstructorUsedError;
  List<bool> get weeklyStatus => throw _privateConstructorUsedError;

  /// Serializes this StreakData to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of StreakData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $StreakDataCopyWith<StreakData> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $StreakDataCopyWith<$Res> {
  factory $StreakDataCopyWith(
          StreakData value, $Res Function(StreakData) then) =
      _$StreakDataCopyWithImpl<$Res, StreakData>;
  @useResult
  $Res call(
      {int currentStreak,
      int longestStreak,
      DateTime? lastCompletionDate,
      DateTime weekStart,
      List<bool> weeklyStatus});
}

/// @nodoc
class _$StreakDataCopyWithImpl<$Res, $Val extends StreakData>
    implements $StreakDataCopyWith<$Res> {
  _$StreakDataCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of StreakData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? currentStreak = null,
    Object? longestStreak = null,
    Object? lastCompletionDate = freezed,
    Object? weekStart = null,
    Object? weeklyStatus = null,
  }) {
    return _then(_value.copyWith(
      currentStreak: null == currentStreak
          ? _value.currentStreak
          : currentStreak // ignore: cast_nullable_to_non_nullable
              as int,
      longestStreak: null == longestStreak
          ? _value.longestStreak
          : longestStreak // ignore: cast_nullable_to_non_nullable
              as int,
      lastCompletionDate: freezed == lastCompletionDate
          ? _value.lastCompletionDate
          : lastCompletionDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      weekStart: null == weekStart
          ? _value.weekStart
          : weekStart // ignore: cast_nullable_to_non_nullable
              as DateTime,
      weeklyStatus: null == weeklyStatus
          ? _value.weeklyStatus
          : weeklyStatus // ignore: cast_nullable_to_non_nullable
              as List<bool>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$StreakDataImplCopyWith<$Res>
    implements $StreakDataCopyWith<$Res> {
  factory _$$StreakDataImplCopyWith(
          _$StreakDataImpl value, $Res Function(_$StreakDataImpl) then) =
      __$$StreakDataImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int currentStreak,
      int longestStreak,
      DateTime? lastCompletionDate,
      DateTime weekStart,
      List<bool> weeklyStatus});
}

/// @nodoc
class __$$StreakDataImplCopyWithImpl<$Res>
    extends _$StreakDataCopyWithImpl<$Res, _$StreakDataImpl>
    implements _$$StreakDataImplCopyWith<$Res> {
  __$$StreakDataImplCopyWithImpl(
      _$StreakDataImpl _value, $Res Function(_$StreakDataImpl) _then)
      : super(_value, _then);

  /// Create a copy of StreakData
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? currentStreak = null,
    Object? longestStreak = null,
    Object? lastCompletionDate = freezed,
    Object? weekStart = null,
    Object? weeklyStatus = null,
  }) {
    return _then(_$StreakDataImpl(
      currentStreak: null == currentStreak
          ? _value.currentStreak
          : currentStreak // ignore: cast_nullable_to_non_nullable
              as int,
      longestStreak: null == longestStreak
          ? _value.longestStreak
          : longestStreak // ignore: cast_nullable_to_non_nullable
              as int,
      lastCompletionDate: freezed == lastCompletionDate
          ? _value.lastCompletionDate
          : lastCompletionDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      weekStart: null == weekStart
          ? _value.weekStart
          : weekStart // ignore: cast_nullable_to_non_nullable
              as DateTime,
      weeklyStatus: null == weeklyStatus
          ? _value._weeklyStatus
          : weeklyStatus // ignore: cast_nullable_to_non_nullable
              as List<bool>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$StreakDataImpl extends _StreakData {
  const _$StreakDataImpl(
      {this.currentStreak = 0,
      this.longestStreak = 0,
      this.lastCompletionDate,
      required this.weekStart,
      final List<bool> weeklyStatus = const <bool>[
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]})
      : _weeklyStatus = weeklyStatus,
        super._();

  factory _$StreakDataImpl.fromJson(Map<String, dynamic> json) =>
      _$$StreakDataImplFromJson(json);

  @override
  @JsonKey()
  final int currentStreak;
  @override
  @JsonKey()
  final int longestStreak;
  @override
  final DateTime? lastCompletionDate;
  @override
  final DateTime weekStart;
  final List<bool> _weeklyStatus;
  @override
  @JsonKey()
  List<bool> get weeklyStatus {
    if (_weeklyStatus is EqualUnmodifiableListView) return _weeklyStatus;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_weeklyStatus);
  }

  @override
  String toString() {
    return 'StreakData(currentStreak: $currentStreak, longestStreak: $longestStreak, lastCompletionDate: $lastCompletionDate, weekStart: $weekStart, weeklyStatus: $weeklyStatus)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$StreakDataImpl &&
            (identical(other.currentStreak, currentStreak) ||
                other.currentStreak == currentStreak) &&
            (identical(other.longestStreak, longestStreak) ||
                other.longestStreak == longestStreak) &&
            (identical(other.lastCompletionDate, lastCompletionDate) ||
                other.lastCompletionDate == lastCompletionDate) &&
            (identical(other.weekStart, weekStart) ||
                other.weekStart == weekStart) &&
            const DeepCollectionEquality()
                .equals(other._weeklyStatus, _weeklyStatus));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      currentStreak,
      longestStreak,
      lastCompletionDate,
      weekStart,
      const DeepCollectionEquality().hash(_weeklyStatus));

  /// Create a copy of StreakData
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$StreakDataImplCopyWith<_$StreakDataImpl> get copyWith =>
      __$$StreakDataImplCopyWithImpl<_$StreakDataImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$StreakDataImplToJson(
      this,
    );
  }
}

abstract class _StreakData extends StreakData {
  const factory _StreakData(
      {final int currentStreak,
      final int longestStreak,
      final DateTime? lastCompletionDate,
      required final DateTime weekStart,
      final List<bool> weeklyStatus}) = _$StreakDataImpl;
  const _StreakData._() : super._();

  factory _StreakData.fromJson(Map<String, dynamic> json) =
      _$StreakDataImpl.fromJson;

  @override
  int get currentStreak;
  @override
  int get longestStreak;
  @override
  DateTime? get lastCompletionDate;
  @override
  DateTime get weekStart;
  @override
  List<bool> get weeklyStatus;

  /// Create a copy of StreakData
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$StreakDataImplCopyWith<_$StreakDataImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
