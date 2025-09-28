// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_reading_progress.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ReadingPlanProgress _$ReadingPlanProgressFromJson(Map<String, dynamic> json) {
  return _ReadingPlanProgress.fromJson(json);
}

/// @nodoc
mixin _$ReadingPlanProgress {
  String get planId => throw _privateConstructorUsedError;
  DateTime get startedAt => throw _privateConstructorUsedError;
  Map<int, DateTime> get completedDays => throw _privateConstructorUsedError;

  /// Serializes this ReadingPlanProgress to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReadingPlanProgress
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReadingPlanProgressCopyWith<ReadingPlanProgress> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReadingPlanProgressCopyWith<$Res> {
  factory $ReadingPlanProgressCopyWith(
          ReadingPlanProgress value, $Res Function(ReadingPlanProgress) then) =
      _$ReadingPlanProgressCopyWithImpl<$Res, ReadingPlanProgress>;
  @useResult
  $Res call(
      {String planId, DateTime startedAt, Map<int, DateTime> completedDays});
}

/// @nodoc
class _$ReadingPlanProgressCopyWithImpl<$Res, $Val extends ReadingPlanProgress>
    implements $ReadingPlanProgressCopyWith<$Res> {
  _$ReadingPlanProgressCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReadingPlanProgress
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? planId = null,
    Object? startedAt = null,
    Object? completedDays = null,
  }) {
    return _then(_value.copyWith(
      planId: null == planId
          ? _value.planId
          : planId // ignore: cast_nullable_to_non_nullable
              as String,
      startedAt: null == startedAt
          ? _value.startedAt
          : startedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      completedDays: null == completedDays
          ? _value.completedDays
          : completedDays // ignore: cast_nullable_to_non_nullable
              as Map<int, DateTime>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ReadingPlanProgressImplCopyWith<$Res>
    implements $ReadingPlanProgressCopyWith<$Res> {
  factory _$$ReadingPlanProgressImplCopyWith(_$ReadingPlanProgressImpl value,
          $Res Function(_$ReadingPlanProgressImpl) then) =
      __$$ReadingPlanProgressImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String planId, DateTime startedAt, Map<int, DateTime> completedDays});
}

/// @nodoc
class __$$ReadingPlanProgressImplCopyWithImpl<$Res>
    extends _$ReadingPlanProgressCopyWithImpl<$Res, _$ReadingPlanProgressImpl>
    implements _$$ReadingPlanProgressImplCopyWith<$Res> {
  __$$ReadingPlanProgressImplCopyWithImpl(_$ReadingPlanProgressImpl _value,
      $Res Function(_$ReadingPlanProgressImpl) _then)
      : super(_value, _then);

  /// Create a copy of ReadingPlanProgress
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? planId = null,
    Object? startedAt = null,
    Object? completedDays = null,
  }) {
    return _then(_$ReadingPlanProgressImpl(
      planId: null == planId
          ? _value.planId
          : planId // ignore: cast_nullable_to_non_nullable
              as String,
      startedAt: null == startedAt
          ? _value.startedAt
          : startedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      completedDays: null == completedDays
          ? _value._completedDays
          : completedDays // ignore: cast_nullable_to_non_nullable
              as Map<int, DateTime>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ReadingPlanProgressImpl implements _ReadingPlanProgress {
  const _$ReadingPlanProgressImpl(
      {required this.planId,
      required this.startedAt,
      final Map<int, DateTime> completedDays = const <int, DateTime>{}})
      : _completedDays = completedDays;

  factory _$ReadingPlanProgressImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReadingPlanProgressImplFromJson(json);

  @override
  final String planId;
  @override
  final DateTime startedAt;
  final Map<int, DateTime> _completedDays;
  @override
  @JsonKey()
  Map<int, DateTime> get completedDays {
    if (_completedDays is EqualUnmodifiableMapView) return _completedDays;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_completedDays);
  }

  @override
  String toString() {
    return 'ReadingPlanProgress(planId: $planId, startedAt: $startedAt, completedDays: $completedDays)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReadingPlanProgressImpl &&
            (identical(other.planId, planId) || other.planId == planId) &&
            (identical(other.startedAt, startedAt) ||
                other.startedAt == startedAt) &&
            const DeepCollectionEquality()
                .equals(other._completedDays, _completedDays));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, planId, startedAt,
      const DeepCollectionEquality().hash(_completedDays));

  /// Create a copy of ReadingPlanProgress
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReadingPlanProgressImplCopyWith<_$ReadingPlanProgressImpl> get copyWith =>
      __$$ReadingPlanProgressImplCopyWithImpl<_$ReadingPlanProgressImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ReadingPlanProgressImplToJson(
      this,
    );
  }
}

abstract class _ReadingPlanProgress implements ReadingPlanProgress {
  const factory _ReadingPlanProgress(
      {required final String planId,
      required final DateTime startedAt,
      final Map<int, DateTime> completedDays}) = _$ReadingPlanProgressImpl;

  factory _ReadingPlanProgress.fromJson(Map<String, dynamic> json) =
      _$ReadingPlanProgressImpl.fromJson;

  @override
  String get planId;
  @override
  DateTime get startedAt;
  @override
  Map<int, DateTime> get completedDays;

  /// Create a copy of ReadingPlanProgress
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReadingPlanProgressImplCopyWith<_$ReadingPlanProgressImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CollectionProgress _$CollectionProgressFromJson(Map<String, dynamic> json) {
  return _CollectionProgress.fromJson(json);
}

/// @nodoc
mixin _$CollectionProgress {
  String get collectionId => throw _privateConstructorUsedError;
  DateTime get startedAt => throw _privateConstructorUsedError;
  Map<String, DateTime> get completedReferenceIds =>
      throw _privateConstructorUsedError;

  /// Serializes this CollectionProgress to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CollectionProgress
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CollectionProgressCopyWith<CollectionProgress> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CollectionProgressCopyWith<$Res> {
  factory $CollectionProgressCopyWith(
          CollectionProgress value, $Res Function(CollectionProgress) then) =
      _$CollectionProgressCopyWithImpl<$Res, CollectionProgress>;
  @useResult
  $Res call(
      {String collectionId,
      DateTime startedAt,
      Map<String, DateTime> completedReferenceIds});
}

/// @nodoc
class _$CollectionProgressCopyWithImpl<$Res, $Val extends CollectionProgress>
    implements $CollectionProgressCopyWith<$Res> {
  _$CollectionProgressCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CollectionProgress
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? collectionId = null,
    Object? startedAt = null,
    Object? completedReferenceIds = null,
  }) {
    return _then(_value.copyWith(
      collectionId: null == collectionId
          ? _value.collectionId
          : collectionId // ignore: cast_nullable_to_non_nullable
              as String,
      startedAt: null == startedAt
          ? _value.startedAt
          : startedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      completedReferenceIds: null == completedReferenceIds
          ? _value.completedReferenceIds
          : completedReferenceIds // ignore: cast_nullable_to_non_nullable
              as Map<String, DateTime>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CollectionProgressImplCopyWith<$Res>
    implements $CollectionProgressCopyWith<$Res> {
  factory _$$CollectionProgressImplCopyWith(_$CollectionProgressImpl value,
          $Res Function(_$CollectionProgressImpl) then) =
      __$$CollectionProgressImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String collectionId,
      DateTime startedAt,
      Map<String, DateTime> completedReferenceIds});
}

/// @nodoc
class __$$CollectionProgressImplCopyWithImpl<$Res>
    extends _$CollectionProgressCopyWithImpl<$Res, _$CollectionProgressImpl>
    implements _$$CollectionProgressImplCopyWith<$Res> {
  __$$CollectionProgressImplCopyWithImpl(_$CollectionProgressImpl _value,
      $Res Function(_$CollectionProgressImpl) _then)
      : super(_value, _then);

  /// Create a copy of CollectionProgress
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? collectionId = null,
    Object? startedAt = null,
    Object? completedReferenceIds = null,
  }) {
    return _then(_$CollectionProgressImpl(
      collectionId: null == collectionId
          ? _value.collectionId
          : collectionId // ignore: cast_nullable_to_non_nullable
              as String,
      startedAt: null == startedAt
          ? _value.startedAt
          : startedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      completedReferenceIds: null == completedReferenceIds
          ? _value._completedReferenceIds
          : completedReferenceIds // ignore: cast_nullable_to_non_nullable
              as Map<String, DateTime>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CollectionProgressImpl implements _CollectionProgress {
  const _$CollectionProgressImpl(
      {required this.collectionId,
      required this.startedAt,
      final Map<String, DateTime> completedReferenceIds =
          const <String, DateTime>{}})
      : _completedReferenceIds = completedReferenceIds;

  factory _$CollectionProgressImpl.fromJson(Map<String, dynamic> json) =>
      _$$CollectionProgressImplFromJson(json);

  @override
  final String collectionId;
  @override
  final DateTime startedAt;
  final Map<String, DateTime> _completedReferenceIds;
  @override
  @JsonKey()
  Map<String, DateTime> get completedReferenceIds {
    if (_completedReferenceIds is EqualUnmodifiableMapView)
      return _completedReferenceIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_completedReferenceIds);
  }

  @override
  String toString() {
    return 'CollectionProgress(collectionId: $collectionId, startedAt: $startedAt, completedReferenceIds: $completedReferenceIds)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CollectionProgressImpl &&
            (identical(other.collectionId, collectionId) ||
                other.collectionId == collectionId) &&
            (identical(other.startedAt, startedAt) ||
                other.startedAt == startedAt) &&
            const DeepCollectionEquality()
                .equals(other._completedReferenceIds, _completedReferenceIds));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, collectionId, startedAt,
      const DeepCollectionEquality().hash(_completedReferenceIds));

  /// Create a copy of CollectionProgress
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CollectionProgressImplCopyWith<_$CollectionProgressImpl> get copyWith =>
      __$$CollectionProgressImplCopyWithImpl<_$CollectionProgressImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CollectionProgressImplToJson(
      this,
    );
  }
}

abstract class _CollectionProgress implements CollectionProgress {
  const factory _CollectionProgress(
          {required final String collectionId,
          required final DateTime startedAt,
          final Map<String, DateTime> completedReferenceIds}) =
      _$CollectionProgressImpl;

  factory _CollectionProgress.fromJson(Map<String, dynamic> json) =
      _$CollectionProgressImpl.fromJson;

  @override
  String get collectionId;
  @override
  DateTime get startedAt;
  @override
  Map<String, DateTime> get completedReferenceIds;

  /// Create a copy of CollectionProgress
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CollectionProgressImplCopyWith<_$CollectionProgressImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
