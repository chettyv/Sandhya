// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_profile.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

UserProfile _$UserProfileFromJson(Map<String, dynamic> json) {
  return _UserProfile.fromJson(json);
}

/// @nodoc
mixin _$UserProfile {
// Basic
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  int? get age => throw _privateConstructorUsedError; // Preferences
  List<String> get deityPreferences =>
      throw _privateConstructorUsedError; // e.g., 'Shiva', 'Krishna'
  String? get spiritualTradition =>
      throw _privateConstructorUsedError; // e.g., 'Shaivism'
  String? get preferredLanguage =>
      throw _privateConstructorUsedError; // e.g., 'en'
  List<String> get spiritualGoals =>
      throw _privateConstructorUsedError; // e.g., 'Meditation'
// Notifications / Audio
  @_TimeOfDayConverter()
  TimeOfDay? get notificationTime => throw _privateConstructorUsedError;
  bool get audioEnabled => throw _privateConstructorUsedError;

  /// Serializes this UserProfile to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UserProfile
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserProfileCopyWith<UserProfile> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserProfileCopyWith<$Res> {
  factory $UserProfileCopyWith(
          UserProfile value, $Res Function(UserProfile) then) =
      _$UserProfileCopyWithImpl<$Res, UserProfile>;
  @useResult
  $Res call(
      {String name,
      String email,
      int? age,
      List<String> deityPreferences,
      String? spiritualTradition,
      String? preferredLanguage,
      List<String> spiritualGoals,
      @_TimeOfDayConverter() TimeOfDay? notificationTime,
      bool audioEnabled});
}

/// @nodoc
class _$UserProfileCopyWithImpl<$Res, $Val extends UserProfile>
    implements $UserProfileCopyWith<$Res> {
  _$UserProfileCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UserProfile
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? email = null,
    Object? age = freezed,
    Object? deityPreferences = null,
    Object? spiritualTradition = freezed,
    Object? preferredLanguage = freezed,
    Object? spiritualGoals = null,
    Object? notificationTime = freezed,
    Object? audioEnabled = null,
  }) {
    return _then(_value.copyWith(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      age: freezed == age
          ? _value.age
          : age // ignore: cast_nullable_to_non_nullable
              as int?,
      deityPreferences: null == deityPreferences
          ? _value.deityPreferences
          : deityPreferences // ignore: cast_nullable_to_non_nullable
              as List<String>,
      spiritualTradition: freezed == spiritualTradition
          ? _value.spiritualTradition
          : spiritualTradition // ignore: cast_nullable_to_non_nullable
              as String?,
      preferredLanguage: freezed == preferredLanguage
          ? _value.preferredLanguage
          : preferredLanguage // ignore: cast_nullable_to_non_nullable
              as String?,
      spiritualGoals: null == spiritualGoals
          ? _value.spiritualGoals
          : spiritualGoals // ignore: cast_nullable_to_non_nullable
              as List<String>,
      notificationTime: freezed == notificationTime
          ? _value.notificationTime
          : notificationTime // ignore: cast_nullable_to_non_nullable
              as TimeOfDay?,
      audioEnabled: null == audioEnabled
          ? _value.audioEnabled
          : audioEnabled // ignore: cast_nullable_to_non_nullable
              as bool,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$UserProfileImplCopyWith<$Res>
    implements $UserProfileCopyWith<$Res> {
  factory _$$UserProfileImplCopyWith(
          _$UserProfileImpl value, $Res Function(_$UserProfileImpl) then) =
      __$$UserProfileImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String name,
      String email,
      int? age,
      List<String> deityPreferences,
      String? spiritualTradition,
      String? preferredLanguage,
      List<String> spiritualGoals,
      @_TimeOfDayConverter() TimeOfDay? notificationTime,
      bool audioEnabled});
}

/// @nodoc
class __$$UserProfileImplCopyWithImpl<$Res>
    extends _$UserProfileCopyWithImpl<$Res, _$UserProfileImpl>
    implements _$$UserProfileImplCopyWith<$Res> {
  __$$UserProfileImplCopyWithImpl(
      _$UserProfileImpl _value, $Res Function(_$UserProfileImpl) _then)
      : super(_value, _then);

  /// Create a copy of UserProfile
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? email = null,
    Object? age = freezed,
    Object? deityPreferences = null,
    Object? spiritualTradition = freezed,
    Object? preferredLanguage = freezed,
    Object? spiritualGoals = null,
    Object? notificationTime = freezed,
    Object? audioEnabled = null,
  }) {
    return _then(_$UserProfileImpl(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      age: freezed == age
          ? _value.age
          : age // ignore: cast_nullable_to_non_nullable
              as int?,
      deityPreferences: null == deityPreferences
          ? _value._deityPreferences
          : deityPreferences // ignore: cast_nullable_to_non_nullable
              as List<String>,
      spiritualTradition: freezed == spiritualTradition
          ? _value.spiritualTradition
          : spiritualTradition // ignore: cast_nullable_to_non_nullable
              as String?,
      preferredLanguage: freezed == preferredLanguage
          ? _value.preferredLanguage
          : preferredLanguage // ignore: cast_nullable_to_non_nullable
              as String?,
      spiritualGoals: null == spiritualGoals
          ? _value._spiritualGoals
          : spiritualGoals // ignore: cast_nullable_to_non_nullable
              as List<String>,
      notificationTime: freezed == notificationTime
          ? _value.notificationTime
          : notificationTime // ignore: cast_nullable_to_non_nullable
              as TimeOfDay?,
      audioEnabled: null == audioEnabled
          ? _value.audioEnabled
          : audioEnabled // ignore: cast_nullable_to_non_nullable
              as bool,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$UserProfileImpl extends _UserProfile {
  const _$UserProfileImpl(
      {this.name = '',
      this.email = '',
      this.age,
      final List<String> deityPreferences = const <String>[],
      this.spiritualTradition,
      this.preferredLanguage,
      final List<String> spiritualGoals = const <String>[],
      @_TimeOfDayConverter() this.notificationTime,
      this.audioEnabled = false})
      : _deityPreferences = deityPreferences,
        _spiritualGoals = spiritualGoals,
        super._();

  factory _$UserProfileImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserProfileImplFromJson(json);

// Basic
  @override
  @JsonKey()
  final String name;
  @override
  @JsonKey()
  final String email;
  @override
  final int? age;
// Preferences
  final List<String> _deityPreferences;
// Preferences
  @override
  @JsonKey()
  List<String> get deityPreferences {
    if (_deityPreferences is EqualUnmodifiableListView)
      return _deityPreferences;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_deityPreferences);
  }

// e.g., 'Shiva', 'Krishna'
  @override
  final String? spiritualTradition;
// e.g., 'Shaivism'
  @override
  final String? preferredLanguage;
// e.g., 'en'
  final List<String> _spiritualGoals;
// e.g., 'en'
  @override
  @JsonKey()
  List<String> get spiritualGoals {
    if (_spiritualGoals is EqualUnmodifiableListView) return _spiritualGoals;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_spiritualGoals);
  }

// e.g., 'Meditation'
// Notifications / Audio
  @override
  @_TimeOfDayConverter()
  final TimeOfDay? notificationTime;
  @override
  @JsonKey()
  final bool audioEnabled;

  @override
  String toString() {
    return 'UserProfile(name: $name, email: $email, age: $age, deityPreferences: $deityPreferences, spiritualTradition: $spiritualTradition, preferredLanguage: $preferredLanguage, spiritualGoals: $spiritualGoals, notificationTime: $notificationTime, audioEnabled: $audioEnabled)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserProfileImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.age, age) || other.age == age) &&
            const DeepCollectionEquality()
                .equals(other._deityPreferences, _deityPreferences) &&
            (identical(other.spiritualTradition, spiritualTradition) ||
                other.spiritualTradition == spiritualTradition) &&
            (identical(other.preferredLanguage, preferredLanguage) ||
                other.preferredLanguage == preferredLanguage) &&
            const DeepCollectionEquality()
                .equals(other._spiritualGoals, _spiritualGoals) &&
            (identical(other.notificationTime, notificationTime) ||
                other.notificationTime == notificationTime) &&
            (identical(other.audioEnabled, audioEnabled) ||
                other.audioEnabled == audioEnabled));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      name,
      email,
      age,
      const DeepCollectionEquality().hash(_deityPreferences),
      spiritualTradition,
      preferredLanguage,
      const DeepCollectionEquality().hash(_spiritualGoals),
      notificationTime,
      audioEnabled);

  /// Create a copy of UserProfile
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserProfileImplCopyWith<_$UserProfileImpl> get copyWith =>
      __$$UserProfileImplCopyWithImpl<_$UserProfileImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserProfileImplToJson(
      this,
    );
  }
}

abstract class _UserProfile extends UserProfile {
  const factory _UserProfile(
      {final String name,
      final String email,
      final int? age,
      final List<String> deityPreferences,
      final String? spiritualTradition,
      final String? preferredLanguage,
      final List<String> spiritualGoals,
      @_TimeOfDayConverter() final TimeOfDay? notificationTime,
      final bool audioEnabled}) = _$UserProfileImpl;
  const _UserProfile._() : super._();

  factory _UserProfile.fromJson(Map<String, dynamic> json) =
      _$UserProfileImpl.fromJson;

// Basic
  @override
  String get name;
  @override
  String get email;
  @override
  int? get age; // Preferences
  @override
  List<String> get deityPreferences; // e.g., 'Shiva', 'Krishna'
  @override
  String? get spiritualTradition; // e.g., 'Shaivism'
  @override
  String? get preferredLanguage; // e.g., 'en'
  @override
  List<String> get spiritualGoals; // e.g., 'Meditation'
// Notifications / Audio
  @override
  @_TimeOfDayConverter()
  TimeOfDay? get notificationTime;
  @override
  bool get audioEnabled;

  /// Create a copy of UserProfile
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserProfileImplCopyWith<_$UserProfileImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
