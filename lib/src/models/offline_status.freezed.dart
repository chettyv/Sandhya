// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'offline_status.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

OfflineStatus _$OfflineStatusFromJson(Map<String, dynamic> json) {
  return _OfflineStatus.fromJson(json);
}

/// @nodoc
mixin _$OfflineStatus {
  bool get isOnline => throw _privateConstructorUsedError;
  DateTime? get lastOnlineAt => throw _privateConstructorUsedError;
  CacheHealth get cacheStatus => throw _privateConstructorUsedError;
  bool get essentialContentCached => throw _privateConstructorUsedError;
  int get totalCachedItems => throw _privateConstructorUsedError;

  /// Serializes this OfflineStatus to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of OfflineStatus
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $OfflineStatusCopyWith<OfflineStatus> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $OfflineStatusCopyWith<$Res> {
  factory $OfflineStatusCopyWith(
          OfflineStatus value, $Res Function(OfflineStatus) then) =
      _$OfflineStatusCopyWithImpl<$Res, OfflineStatus>;
  @useResult
  $Res call(
      {bool isOnline,
      DateTime? lastOnlineAt,
      CacheHealth cacheStatus,
      bool essentialContentCached,
      int totalCachedItems});
}

/// @nodoc
class _$OfflineStatusCopyWithImpl<$Res, $Val extends OfflineStatus>
    implements $OfflineStatusCopyWith<$Res> {
  _$OfflineStatusCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of OfflineStatus
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? isOnline = null,
    Object? lastOnlineAt = freezed,
    Object? cacheStatus = null,
    Object? essentialContentCached = null,
    Object? totalCachedItems = null,
  }) {
    return _then(_value.copyWith(
      isOnline: null == isOnline
          ? _value.isOnline
          : isOnline // ignore: cast_nullable_to_non_nullable
              as bool,
      lastOnlineAt: freezed == lastOnlineAt
          ? _value.lastOnlineAt
          : lastOnlineAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      cacheStatus: null == cacheStatus
          ? _value.cacheStatus
          : cacheStatus // ignore: cast_nullable_to_non_nullable
              as CacheHealth,
      essentialContentCached: null == essentialContentCached
          ? _value.essentialContentCached
          : essentialContentCached // ignore: cast_nullable_to_non_nullable
              as bool,
      totalCachedItems: null == totalCachedItems
          ? _value.totalCachedItems
          : totalCachedItems // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$OfflineStatusImplCopyWith<$Res>
    implements $OfflineStatusCopyWith<$Res> {
  factory _$$OfflineStatusImplCopyWith(
          _$OfflineStatusImpl value, $Res Function(_$OfflineStatusImpl) then) =
      __$$OfflineStatusImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {bool isOnline,
      DateTime? lastOnlineAt,
      CacheHealth cacheStatus,
      bool essentialContentCached,
      int totalCachedItems});
}

/// @nodoc
class __$$OfflineStatusImplCopyWithImpl<$Res>
    extends _$OfflineStatusCopyWithImpl<$Res, _$OfflineStatusImpl>
    implements _$$OfflineStatusImplCopyWith<$Res> {
  __$$OfflineStatusImplCopyWithImpl(
      _$OfflineStatusImpl _value, $Res Function(_$OfflineStatusImpl) _then)
      : super(_value, _then);

  /// Create a copy of OfflineStatus
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? isOnline = null,
    Object? lastOnlineAt = freezed,
    Object? cacheStatus = null,
    Object? essentialContentCached = null,
    Object? totalCachedItems = null,
  }) {
    return _then(_$OfflineStatusImpl(
      isOnline: null == isOnline
          ? _value.isOnline
          : isOnline // ignore: cast_nullable_to_non_nullable
              as bool,
      lastOnlineAt: freezed == lastOnlineAt
          ? _value.lastOnlineAt
          : lastOnlineAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      cacheStatus: null == cacheStatus
          ? _value.cacheStatus
          : cacheStatus // ignore: cast_nullable_to_non_nullable
              as CacheHealth,
      essentialContentCached: null == essentialContentCached
          ? _value.essentialContentCached
          : essentialContentCached // ignore: cast_nullable_to_non_nullable
              as bool,
      totalCachedItems: null == totalCachedItems
          ? _value.totalCachedItems
          : totalCachedItems // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$OfflineStatusImpl implements _OfflineStatus {
  const _$OfflineStatusImpl(
      {required this.isOnline,
      this.lastOnlineAt,
      this.cacheStatus = CacheHealth.noCache,
      this.essentialContentCached = false,
      this.totalCachedItems = 0});

  factory _$OfflineStatusImpl.fromJson(Map<String, dynamic> json) =>
      _$$OfflineStatusImplFromJson(json);

  @override
  final bool isOnline;
  @override
  final DateTime? lastOnlineAt;
  @override
  @JsonKey()
  final CacheHealth cacheStatus;
  @override
  @JsonKey()
  final bool essentialContentCached;
  @override
  @JsonKey()
  final int totalCachedItems;

  @override
  String toString() {
    return 'OfflineStatus(isOnline: $isOnline, lastOnlineAt: $lastOnlineAt, cacheStatus: $cacheStatus, essentialContentCached: $essentialContentCached, totalCachedItems: $totalCachedItems)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$OfflineStatusImpl &&
            (identical(other.isOnline, isOnline) ||
                other.isOnline == isOnline) &&
            (identical(other.lastOnlineAt, lastOnlineAt) ||
                other.lastOnlineAt == lastOnlineAt) &&
            (identical(other.cacheStatus, cacheStatus) ||
                other.cacheStatus == cacheStatus) &&
            (identical(other.essentialContentCached, essentialContentCached) ||
                other.essentialContentCached == essentialContentCached) &&
            (identical(other.totalCachedItems, totalCachedItems) ||
                other.totalCachedItems == totalCachedItems));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, isOnline, lastOnlineAt,
      cacheStatus, essentialContentCached, totalCachedItems);

  /// Create a copy of OfflineStatus
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$OfflineStatusImplCopyWith<_$OfflineStatusImpl> get copyWith =>
      __$$OfflineStatusImplCopyWithImpl<_$OfflineStatusImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$OfflineStatusImplToJson(
      this,
    );
  }
}

abstract class _OfflineStatus implements OfflineStatus {
  const factory _OfflineStatus(
      {required final bool isOnline,
      final DateTime? lastOnlineAt,
      final CacheHealth cacheStatus,
      final bool essentialContentCached,
      final int totalCachedItems}) = _$OfflineStatusImpl;

  factory _OfflineStatus.fromJson(Map<String, dynamic> json) =
      _$OfflineStatusImpl.fromJson;

  @override
  bool get isOnline;
  @override
  DateTime? get lastOnlineAt;
  @override
  CacheHealth get cacheStatus;
  @override
  bool get essentialContentCached;
  @override
  int get totalCachedItems;

  /// Create a copy of OfflineStatus
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$OfflineStatusImplCopyWith<_$OfflineStatusImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
