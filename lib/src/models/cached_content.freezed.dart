// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'cached_content.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CachedContent _$CachedContentFromJson(Map<String, dynamic> json) {
  return _CachedContent.fromJson(json);
}

/// @nodoc
mixin _$CachedContent {
  String get verseId => throw _privateConstructorUsedError;
  DateTime get cachedAt => throw _privateConstructorUsedError;
  DateTime? get expiresAt => throw _privateConstructorUsedError;
  CacheSource get cacheSource => throw _privateConstructorUsedError;
  int get accessCount => throw _privateConstructorUsedError;
  int get fileSize => throw _privateConstructorUsedError;

  /// Serializes this CachedContent to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CachedContent
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CachedContentCopyWith<CachedContent> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CachedContentCopyWith<$Res> {
  factory $CachedContentCopyWith(
          CachedContent value, $Res Function(CachedContent) then) =
      _$CachedContentCopyWithImpl<$Res, CachedContent>;
  @useResult
  $Res call(
      {String verseId,
      DateTime cachedAt,
      DateTime? expiresAt,
      CacheSource cacheSource,
      int accessCount,
      int fileSize});
}

/// @nodoc
class _$CachedContentCopyWithImpl<$Res, $Val extends CachedContent>
    implements $CachedContentCopyWith<$Res> {
  _$CachedContentCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CachedContent
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? verseId = null,
    Object? cachedAt = null,
    Object? expiresAt = freezed,
    Object? cacheSource = null,
    Object? accessCount = null,
    Object? fileSize = null,
  }) {
    return _then(_value.copyWith(
      verseId: null == verseId
          ? _value.verseId
          : verseId // ignore: cast_nullable_to_non_nullable
              as String,
      cachedAt: null == cachedAt
          ? _value.cachedAt
          : cachedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      expiresAt: freezed == expiresAt
          ? _value.expiresAt
          : expiresAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      cacheSource: null == cacheSource
          ? _value.cacheSource
          : cacheSource // ignore: cast_nullable_to_non_nullable
              as CacheSource,
      accessCount: null == accessCount
          ? _value.accessCount
          : accessCount // ignore: cast_nullable_to_non_nullable
              as int,
      fileSize: null == fileSize
          ? _value.fileSize
          : fileSize // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CachedContentImplCopyWith<$Res>
    implements $CachedContentCopyWith<$Res> {
  factory _$$CachedContentImplCopyWith(
          _$CachedContentImpl value, $Res Function(_$CachedContentImpl) then) =
      __$$CachedContentImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String verseId,
      DateTime cachedAt,
      DateTime? expiresAt,
      CacheSource cacheSource,
      int accessCount,
      int fileSize});
}

/// @nodoc
class __$$CachedContentImplCopyWithImpl<$Res>
    extends _$CachedContentCopyWithImpl<$Res, _$CachedContentImpl>
    implements _$$CachedContentImplCopyWith<$Res> {
  __$$CachedContentImplCopyWithImpl(
      _$CachedContentImpl _value, $Res Function(_$CachedContentImpl) _then)
      : super(_value, _then);

  /// Create a copy of CachedContent
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? verseId = null,
    Object? cachedAt = null,
    Object? expiresAt = freezed,
    Object? cacheSource = null,
    Object? accessCount = null,
    Object? fileSize = null,
  }) {
    return _then(_$CachedContentImpl(
      verseId: null == verseId
          ? _value.verseId
          : verseId // ignore: cast_nullable_to_non_nullable
              as String,
      cachedAt: null == cachedAt
          ? _value.cachedAt
          : cachedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      expiresAt: freezed == expiresAt
          ? _value.expiresAt
          : expiresAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      cacheSource: null == cacheSource
          ? _value.cacheSource
          : cacheSource // ignore: cast_nullable_to_non_nullable
              as CacheSource,
      accessCount: null == accessCount
          ? _value.accessCount
          : accessCount // ignore: cast_nullable_to_non_nullable
              as int,
      fileSize: null == fileSize
          ? _value.fileSize
          : fileSize // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CachedContentImpl implements _CachedContent {
  const _$CachedContentImpl(
      {required this.verseId,
      required this.cachedAt,
      this.expiresAt,
      this.cacheSource = CacheSource.embedded,
      this.accessCount = 0,
      this.fileSize = 0});

  factory _$CachedContentImpl.fromJson(Map<String, dynamic> json) =>
      _$$CachedContentImplFromJson(json);

  @override
  final String verseId;
  @override
  final DateTime cachedAt;
  @override
  final DateTime? expiresAt;
  @override
  @JsonKey()
  final CacheSource cacheSource;
  @override
  @JsonKey()
  final int accessCount;
  @override
  @JsonKey()
  final int fileSize;

  @override
  String toString() {
    return 'CachedContent(verseId: $verseId, cachedAt: $cachedAt, expiresAt: $expiresAt, cacheSource: $cacheSource, accessCount: $accessCount, fileSize: $fileSize)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CachedContentImpl &&
            (identical(other.verseId, verseId) || other.verseId == verseId) &&
            (identical(other.cachedAt, cachedAt) ||
                other.cachedAt == cachedAt) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            (identical(other.cacheSource, cacheSource) ||
                other.cacheSource == cacheSource) &&
            (identical(other.accessCount, accessCount) ||
                other.accessCount == accessCount) &&
            (identical(other.fileSize, fileSize) ||
                other.fileSize == fileSize));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, verseId, cachedAt, expiresAt,
      cacheSource, accessCount, fileSize);

  /// Create a copy of CachedContent
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CachedContentImplCopyWith<_$CachedContentImpl> get copyWith =>
      __$$CachedContentImplCopyWithImpl<_$CachedContentImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CachedContentImplToJson(
      this,
    );
  }
}

abstract class _CachedContent implements CachedContent {
  const factory _CachedContent(
      {required final String verseId,
      required final DateTime cachedAt,
      final DateTime? expiresAt,
      final CacheSource cacheSource,
      final int accessCount,
      final int fileSize}) = _$CachedContentImpl;

  factory _CachedContent.fromJson(Map<String, dynamic> json) =
      _$CachedContentImpl.fromJson;

  @override
  String get verseId;
  @override
  DateTime get cachedAt;
  @override
  DateTime? get expiresAt;
  @override
  CacheSource get cacheSource;
  @override
  int get accessCount;
  @override
  int get fileSize;

  /// Create a copy of CachedContent
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CachedContentImplCopyWith<_$CachedContentImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
