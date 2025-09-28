// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'scripture_reference.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ScriptureReference _$ScriptureReferenceFromJson(Map<String, dynamic> json) {
  return _ScriptureReference.fromJson(json);
}

/// @nodoc
mixin _$ScriptureReference {
  /// Unique ID of this reference entry. By default we use the verseId.
  String get id => throw _privateConstructorUsedError;

  /// ID of the corresponding DailyVerse content.
  String get verseId => throw _privateConstructorUsedError;

  /// Short title for display in library cards.
  String get title => throw _privateConstructorUsedError;

  /// Canonical source grouping (e.g., Bhagavad Gita, Upanishads).
  ScriptureSource get source => throw _privateConstructorUsedError;

  /// Topic tags for browsing and search.
  List<String> get tags => throw _privateConstructorUsedError;

  /// Suggested difficulty level for readers.
  DifficultyLevel get difficulty => throw _privateConstructorUsedError;

  /// Estimated time to read/reflect, in minutes.
  int get estimatedMinutes => throw _privateConstructorUsedError;

  /// Serializes this ScriptureReference to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ScriptureReference
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ScriptureReferenceCopyWith<ScriptureReference> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ScriptureReferenceCopyWith<$Res> {
  factory $ScriptureReferenceCopyWith(
          ScriptureReference value, $Res Function(ScriptureReference) then) =
      _$ScriptureReferenceCopyWithImpl<$Res, ScriptureReference>;
  @useResult
  $Res call(
      {String id,
      String verseId,
      String title,
      ScriptureSource source,
      List<String> tags,
      DifficultyLevel difficulty,
      int estimatedMinutes});
}

/// @nodoc
class _$ScriptureReferenceCopyWithImpl<$Res, $Val extends ScriptureReference>
    implements $ScriptureReferenceCopyWith<$Res> {
  _$ScriptureReferenceCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ScriptureReference
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? verseId = null,
    Object? title = null,
    Object? source = null,
    Object? tags = null,
    Object? difficulty = null,
    Object? estimatedMinutes = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      verseId: null == verseId
          ? _value.verseId
          : verseId // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      source: null == source
          ? _value.source
          : source // ignore: cast_nullable_to_non_nullable
              as ScriptureSource,
      tags: null == tags
          ? _value.tags
          : tags // ignore: cast_nullable_to_non_nullable
              as List<String>,
      difficulty: null == difficulty
          ? _value.difficulty
          : difficulty // ignore: cast_nullable_to_non_nullable
              as DifficultyLevel,
      estimatedMinutes: null == estimatedMinutes
          ? _value.estimatedMinutes
          : estimatedMinutes // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ScriptureReferenceImplCopyWith<$Res>
    implements $ScriptureReferenceCopyWith<$Res> {
  factory _$$ScriptureReferenceImplCopyWith(_$ScriptureReferenceImpl value,
          $Res Function(_$ScriptureReferenceImpl) then) =
      __$$ScriptureReferenceImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String verseId,
      String title,
      ScriptureSource source,
      List<String> tags,
      DifficultyLevel difficulty,
      int estimatedMinutes});
}

/// @nodoc
class __$$ScriptureReferenceImplCopyWithImpl<$Res>
    extends _$ScriptureReferenceCopyWithImpl<$Res, _$ScriptureReferenceImpl>
    implements _$$ScriptureReferenceImplCopyWith<$Res> {
  __$$ScriptureReferenceImplCopyWithImpl(_$ScriptureReferenceImpl _value,
      $Res Function(_$ScriptureReferenceImpl) _then)
      : super(_value, _then);

  /// Create a copy of ScriptureReference
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? verseId = null,
    Object? title = null,
    Object? source = null,
    Object? tags = null,
    Object? difficulty = null,
    Object? estimatedMinutes = null,
  }) {
    return _then(_$ScriptureReferenceImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      verseId: null == verseId
          ? _value.verseId
          : verseId // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      source: null == source
          ? _value.source
          : source // ignore: cast_nullable_to_non_nullable
              as ScriptureSource,
      tags: null == tags
          ? _value._tags
          : tags // ignore: cast_nullable_to_non_nullable
              as List<String>,
      difficulty: null == difficulty
          ? _value.difficulty
          : difficulty // ignore: cast_nullable_to_non_nullable
              as DifficultyLevel,
      estimatedMinutes: null == estimatedMinutes
          ? _value.estimatedMinutes
          : estimatedMinutes // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ScriptureReferenceImpl implements _ScriptureReference {
  const _$ScriptureReferenceImpl(
      {required this.id,
      required this.verseId,
      required this.title,
      required this.source,
      final List<String> tags = const <String>[],
      this.difficulty = DifficultyLevel.beginner,
      this.estimatedMinutes = 10})
      : _tags = tags;

  factory _$ScriptureReferenceImpl.fromJson(Map<String, dynamic> json) =>
      _$$ScriptureReferenceImplFromJson(json);

  /// Unique ID of this reference entry. By default we use the verseId.
  @override
  final String id;

  /// ID of the corresponding DailyVerse content.
  @override
  final String verseId;

  /// Short title for display in library cards.
  @override
  final String title;

  /// Canonical source grouping (e.g., Bhagavad Gita, Upanishads).
  @override
  final ScriptureSource source;

  /// Topic tags for browsing and search.
  final List<String> _tags;

  /// Topic tags for browsing and search.
  @override
  @JsonKey()
  List<String> get tags {
    if (_tags is EqualUnmodifiableListView) return _tags;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_tags);
  }

  /// Suggested difficulty level for readers.
  @override
  @JsonKey()
  final DifficultyLevel difficulty;

  /// Estimated time to read/reflect, in minutes.
  @override
  @JsonKey()
  final int estimatedMinutes;

  @override
  String toString() {
    return 'ScriptureReference(id: $id, verseId: $verseId, title: $title, source: $source, tags: $tags, difficulty: $difficulty, estimatedMinutes: $estimatedMinutes)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ScriptureReferenceImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.verseId, verseId) || other.verseId == verseId) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.source, source) || other.source == source) &&
            const DeepCollectionEquality().equals(other._tags, _tags) &&
            (identical(other.difficulty, difficulty) ||
                other.difficulty == difficulty) &&
            (identical(other.estimatedMinutes, estimatedMinutes) ||
                other.estimatedMinutes == estimatedMinutes));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, verseId, title, source,
      const DeepCollectionEquality().hash(_tags), difficulty, estimatedMinutes);

  /// Create a copy of ScriptureReference
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ScriptureReferenceImplCopyWith<_$ScriptureReferenceImpl> get copyWith =>
      __$$ScriptureReferenceImplCopyWithImpl<_$ScriptureReferenceImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ScriptureReferenceImplToJson(
      this,
    );
  }
}

abstract class _ScriptureReference implements ScriptureReference {
  const factory _ScriptureReference(
      {required final String id,
      required final String verseId,
      required final String title,
      required final ScriptureSource source,
      final List<String> tags,
      final DifficultyLevel difficulty,
      final int estimatedMinutes}) = _$ScriptureReferenceImpl;

  factory _ScriptureReference.fromJson(Map<String, dynamic> json) =
      _$ScriptureReferenceImpl.fromJson;

  /// Unique ID of this reference entry. By default we use the verseId.
  @override
  String get id;

  /// ID of the corresponding DailyVerse content.
  @override
  String get verseId;

  /// Short title for display in library cards.
  @override
  String get title;

  /// Canonical source grouping (e.g., Bhagavad Gita, Upanishads).
  @override
  ScriptureSource get source;

  /// Topic tags for browsing and search.
  @override
  List<String> get tags;

  /// Suggested difficulty level for readers.
  @override
  DifficultyLevel get difficulty;

  /// Estimated time to read/reflect, in minutes.
  @override
  int get estimatedMinutes;

  /// Create a copy of ScriptureReference
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ScriptureReferenceImplCopyWith<_$ScriptureReferenceImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
