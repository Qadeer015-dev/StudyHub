// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

UserModel _$UserModelFromJson(Map<String, dynamic> json) {
  return _UserModel.fromJson(json);
}

/// @nodoc
mixin _$UserModel {
  int get id => throw _privateConstructorUsedError;
  String get uuid => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  @JsonKey(name: 'full_name')
  String get fullName => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  @JsonKey(name: 'academy_id')
  int? get academyId => throw _privateConstructorUsedError;
  @JsonKey(name: 'profile_image')
  String? get profileImage => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_verified', fromJson: _boolFromJson, toJson: _boolToJson)
  bool? get isVerified => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
  bool get isActive => throw _privateConstructorUsedError;
  @JsonKey(name: 'last_login')
  DateTime? get lastLogin => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime? get createdAt => throw _privateConstructorUsedError;
  @JsonKey(name: 'updated_at')
  DateTime? get updatedAt => throw _privateConstructorUsedError;
  List<UserRoleModel> get roles => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $UserModelCopyWith<UserModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserModelCopyWith<$Res> {
  factory $UserModelCopyWith(UserModel value, $Res Function(UserModel) then) =
      _$UserModelCopyWithImpl<$Res, UserModel>;
  @useResult
  $Res call(
      {int id,
      String uuid,
      String email,
      @JsonKey(name: 'full_name') String fullName,
      String? phone,
      @JsonKey(name: 'academy_id') int? academyId,
      @JsonKey(name: 'profile_image') String? profileImage,
      @JsonKey(
          name: 'is_verified', fromJson: _boolFromJson, toJson: _boolToJson)
      bool? isVerified,
      @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
      bool isActive,
      @JsonKey(name: 'last_login') DateTime? lastLogin,
      @JsonKey(name: 'created_at') DateTime? createdAt,
      @JsonKey(name: 'updated_at') DateTime? updatedAt,
      List<UserRoleModel> roles});
}

/// @nodoc
class _$UserModelCopyWithImpl<$Res, $Val extends UserModel>
    implements $UserModelCopyWith<$Res> {
  _$UserModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? uuid = null,
    Object? email = null,
    Object? fullName = null,
    Object? phone = freezed,
    Object? academyId = freezed,
    Object? profileImage = freezed,
    Object? isVerified = freezed,
    Object? isActive = null,
    Object? lastLogin = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
    Object? roles = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as int,
      uuid: null == uuid
          ? _value.uuid
          : uuid // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      fullName: null == fullName
          ? _value.fullName
          : fullName // ignore: cast_nullable_to_non_nullable
              as String,
      phone: freezed == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String?,
      academyId: freezed == academyId
          ? _value.academyId
          : academyId // ignore: cast_nullable_to_non_nullable
              as int?,
      profileImage: freezed == profileImage
          ? _value.profileImage
          : profileImage // ignore: cast_nullable_to_non_nullable
              as String?,
      isVerified: freezed == isVerified
          ? _value.isVerified
          : isVerified // ignore: cast_nullable_to_non_nullable
              as bool?,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
      lastLogin: freezed == lastLogin
          ? _value.lastLogin
          : lastLogin // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      roles: null == roles
          ? _value.roles
          : roles // ignore: cast_nullable_to_non_nullable
              as List<UserRoleModel>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$UserModelImplCopyWith<$Res>
    implements $UserModelCopyWith<$Res> {
  factory _$$UserModelImplCopyWith(
          _$UserModelImpl value, $Res Function(_$UserModelImpl) then) =
      __$$UserModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int id,
      String uuid,
      String email,
      @JsonKey(name: 'full_name') String fullName,
      String? phone,
      @JsonKey(name: 'academy_id') int? academyId,
      @JsonKey(name: 'profile_image') String? profileImage,
      @JsonKey(
          name: 'is_verified', fromJson: _boolFromJson, toJson: _boolToJson)
      bool? isVerified,
      @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
      bool isActive,
      @JsonKey(name: 'last_login') DateTime? lastLogin,
      @JsonKey(name: 'created_at') DateTime? createdAt,
      @JsonKey(name: 'updated_at') DateTime? updatedAt,
      List<UserRoleModel> roles});
}

/// @nodoc
class __$$UserModelImplCopyWithImpl<$Res>
    extends _$UserModelCopyWithImpl<$Res, _$UserModelImpl>
    implements _$$UserModelImplCopyWith<$Res> {
  __$$UserModelImplCopyWithImpl(
      _$UserModelImpl _value, $Res Function(_$UserModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? uuid = null,
    Object? email = null,
    Object? fullName = null,
    Object? phone = freezed,
    Object? academyId = freezed,
    Object? profileImage = freezed,
    Object? isVerified = freezed,
    Object? isActive = null,
    Object? lastLogin = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
    Object? roles = null,
  }) {
    return _then(_$UserModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as int,
      uuid: null == uuid
          ? _value.uuid
          : uuid // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      fullName: null == fullName
          ? _value.fullName
          : fullName // ignore: cast_nullable_to_non_nullable
              as String,
      phone: freezed == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String?,
      academyId: freezed == academyId
          ? _value.academyId
          : academyId // ignore: cast_nullable_to_non_nullable
              as int?,
      profileImage: freezed == profileImage
          ? _value.profileImage
          : profileImage // ignore: cast_nullable_to_non_nullable
              as String?,
      isVerified: freezed == isVerified
          ? _value.isVerified
          : isVerified // ignore: cast_nullable_to_non_nullable
              as bool?,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
      lastLogin: freezed == lastLogin
          ? _value.lastLogin
          : lastLogin // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      roles: null == roles
          ? _value._roles
          : roles // ignore: cast_nullable_to_non_nullable
              as List<UserRoleModel>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$UserModelImpl implements _UserModel {
  const _$UserModelImpl(
      {required this.id,
      required this.uuid,
      required this.email,
      @JsonKey(name: 'full_name') required this.fullName,
      this.phone,
      @JsonKey(name: 'academy_id') this.academyId,
      @JsonKey(name: 'profile_image') this.profileImage,
      @JsonKey(
          name: 'is_verified', fromJson: _boolFromJson, toJson: _boolToJson)
      this.isVerified,
      @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
      required this.isActive,
      @JsonKey(name: 'last_login') this.lastLogin,
      @JsonKey(name: 'created_at') this.createdAt,
      @JsonKey(name: 'updated_at') this.updatedAt,
      final List<UserRoleModel> roles = const []})
      : _roles = roles;

  factory _$UserModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserModelImplFromJson(json);

  @override
  final int id;
  @override
  final String uuid;
  @override
  final String email;
  @override
  @JsonKey(name: 'full_name')
  final String fullName;
  @override
  final String? phone;
  @override
  @JsonKey(name: 'academy_id')
  final int? academyId;
  @override
  @JsonKey(name: 'profile_image')
  final String? profileImage;
  @override
  @JsonKey(name: 'is_verified', fromJson: _boolFromJson, toJson: _boolToJson)
  final bool? isVerified;
  @override
  @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
  final bool isActive;
  @override
  @JsonKey(name: 'last_login')
  final DateTime? lastLogin;
  @override
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;
  @override
  @JsonKey(name: 'updated_at')
  final DateTime? updatedAt;
  final List<UserRoleModel> _roles;
  @override
  @JsonKey()
  List<UserRoleModel> get roles {
    if (_roles is EqualUnmodifiableListView) return _roles;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_roles);
  }

  @override
  String toString() {
    return 'UserModel(id: $id, uuid: $uuid, email: $email, fullName: $fullName, phone: $phone, academyId: $academyId, profileImage: $profileImage, isVerified: $isVerified, isActive: $isActive, lastLogin: $lastLogin, createdAt: $createdAt, updatedAt: $updatedAt, roles: $roles)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.uuid, uuid) || other.uuid == uuid) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.fullName, fullName) ||
                other.fullName == fullName) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.academyId, academyId) ||
                other.academyId == academyId) &&
            (identical(other.profileImage, profileImage) ||
                other.profileImage == profileImage) &&
            (identical(other.isVerified, isVerified) ||
                other.isVerified == isVerified) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.lastLogin, lastLogin) ||
                other.lastLogin == lastLogin) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            const DeepCollectionEquality().equals(other._roles, _roles));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      uuid,
      email,
      fullName,
      phone,
      academyId,
      profileImage,
      isVerified,
      isActive,
      lastLogin,
      createdAt,
      updatedAt,
      const DeepCollectionEquality().hash(_roles));

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$UserModelImplCopyWith<_$UserModelImpl> get copyWith =>
      __$$UserModelImplCopyWithImpl<_$UserModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserModelImplToJson(
      this,
    );
  }
}

abstract class _UserModel implements UserModel {
  const factory _UserModel(
      {required final int id,
      required final String uuid,
      required final String email,
      @JsonKey(name: 'full_name') required final String fullName,
      final String? phone,
      @JsonKey(name: 'academy_id') final int? academyId,
      @JsonKey(name: 'profile_image') final String? profileImage,
      @JsonKey(
          name: 'is_verified', fromJson: _boolFromJson, toJson: _boolToJson)
      final bool? isVerified,
      @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
      required final bool isActive,
      @JsonKey(name: 'last_login') final DateTime? lastLogin,
      @JsonKey(name: 'created_at') final DateTime? createdAt,
      @JsonKey(name: 'updated_at') final DateTime? updatedAt,
      final List<UserRoleModel> roles}) = _$UserModelImpl;

  factory _UserModel.fromJson(Map<String, dynamic> json) =
      _$UserModelImpl.fromJson;

  @override
  int get id;
  @override
  String get uuid;
  @override
  String get email;
  @override
  @JsonKey(name: 'full_name')
  String get fullName;
  @override
  String? get phone;
  @override
  @JsonKey(name: 'academy_id')
  int? get academyId;
  @override
  @JsonKey(name: 'profile_image')
  String? get profileImage;
  @override
  @JsonKey(name: 'is_verified', fromJson: _boolFromJson, toJson: _boolToJson)
  bool? get isVerified;
  @override
  @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
  bool get isActive;
  @override
  @JsonKey(name: 'last_login')
  DateTime? get lastLogin;
  @override
  @JsonKey(name: 'created_at')
  DateTime? get createdAt;
  @override
  @JsonKey(name: 'updated_at')
  DateTime? get updatedAt;
  @override
  List<UserRoleModel> get roles;
  @override
  @JsonKey(ignore: true)
  _$$UserModelImplCopyWith<_$UserModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

UserRoleModel _$UserRoleModelFromJson(Map<String, dynamic> json) {
  return _UserRoleModel.fromJson(json);
}

/// @nodoc
mixin _$UserRoleModel {
  String get role => throw _privateConstructorUsedError;
  @JsonKey(name: 'academy_id')
  int? get academyId => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
  bool? get isActive => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $UserRoleModelCopyWith<UserRoleModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserRoleModelCopyWith<$Res> {
  factory $UserRoleModelCopyWith(
          UserRoleModel value, $Res Function(UserRoleModel) then) =
      _$UserRoleModelCopyWithImpl<$Res, UserRoleModel>;
  @useResult
  $Res call(
      {String role,
      @JsonKey(name: 'academy_id') int? academyId,
      @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
      bool? isActive});
}

/// @nodoc
class _$UserRoleModelCopyWithImpl<$Res, $Val extends UserRoleModel>
    implements $UserRoleModelCopyWith<$Res> {
  _$UserRoleModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? role = null,
    Object? academyId = freezed,
    Object? isActive = freezed,
  }) {
    return _then(_value.copyWith(
      role: null == role
          ? _value.role
          : role // ignore: cast_nullable_to_non_nullable
              as String,
      academyId: freezed == academyId
          ? _value.academyId
          : academyId // ignore: cast_nullable_to_non_nullable
              as int?,
      isActive: freezed == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$UserRoleModelImplCopyWith<$Res>
    implements $UserRoleModelCopyWith<$Res> {
  factory _$$UserRoleModelImplCopyWith(
          _$UserRoleModelImpl value, $Res Function(_$UserRoleModelImpl) then) =
      __$$UserRoleModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String role,
      @JsonKey(name: 'academy_id') int? academyId,
      @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
      bool? isActive});
}

/// @nodoc
class __$$UserRoleModelImplCopyWithImpl<$Res>
    extends _$UserRoleModelCopyWithImpl<$Res, _$UserRoleModelImpl>
    implements _$$UserRoleModelImplCopyWith<$Res> {
  __$$UserRoleModelImplCopyWithImpl(
      _$UserRoleModelImpl _value, $Res Function(_$UserRoleModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? role = null,
    Object? academyId = freezed,
    Object? isActive = freezed,
  }) {
    return _then(_$UserRoleModelImpl(
      role: null == role
          ? _value.role
          : role // ignore: cast_nullable_to_non_nullable
              as String,
      academyId: freezed == academyId
          ? _value.academyId
          : academyId // ignore: cast_nullable_to_non_nullable
              as int?,
      isActive: freezed == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$UserRoleModelImpl implements _UserRoleModel {
  const _$UserRoleModelImpl(
      {required this.role,
      @JsonKey(name: 'academy_id') this.academyId,
      @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
      this.isActive});

  factory _$UserRoleModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserRoleModelImplFromJson(json);

  @override
  final String role;
  @override
  @JsonKey(name: 'academy_id')
  final int? academyId;
  @override
  @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
  final bool? isActive;

  @override
  String toString() {
    return 'UserRoleModel(role: $role, academyId: $academyId, isActive: $isActive)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserRoleModelImpl &&
            (identical(other.role, role) || other.role == role) &&
            (identical(other.academyId, academyId) ||
                other.academyId == academyId) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, role, academyId, isActive);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$UserRoleModelImplCopyWith<_$UserRoleModelImpl> get copyWith =>
      __$$UserRoleModelImplCopyWithImpl<_$UserRoleModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserRoleModelImplToJson(
      this,
    );
  }
}

abstract class _UserRoleModel implements UserRoleModel {
  const factory _UserRoleModel(
      {required final String role,
      @JsonKey(name: 'academy_id') final int? academyId,
      @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
      final bool? isActive}) = _$UserRoleModelImpl;

  factory _UserRoleModel.fromJson(Map<String, dynamic> json) =
      _$UserRoleModelImpl.fromJson;

  @override
  String get role;
  @override
  @JsonKey(name: 'academy_id')
  int? get academyId;
  @override
  @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
  bool? get isActive;
  @override
  @JsonKey(ignore: true)
  _$$UserRoleModelImplCopyWith<_$UserRoleModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
