// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserModelImpl _$$UserModelImplFromJson(Map<String, dynamic> json) =>
    _$UserModelImpl(
      id: (json['id'] as num).toInt(),
      uuid: json['uuid'] as String,
      email: json['email'] as String,
      fullName: json['full_name'] as String,
      phone: json['phone'] as String?,
      academyId: (json['academy_id'] as num?)?.toInt(),
      profileImage: json['profile_image'] as String?,
      isVerified: _boolFromJson(json['is_verified']),
      isActive: _boolFromJson(json['is_active']),
      lastLogin: json['last_login'] == null
          ? null
          : DateTime.parse(json['last_login'] as String),
      createdAt: json['created_at'] == null
          ? null
          : DateTime.parse(json['created_at'] as String),
      updatedAt: json['updated_at'] == null
          ? null
          : DateTime.parse(json['updated_at'] as String),
      roles: (json['roles'] as List<dynamic>?)
              ?.map((e) => UserRoleModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$$UserModelImplToJson(_$UserModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'uuid': instance.uuid,
      'email': instance.email,
      'full_name': instance.fullName,
      'phone': instance.phone,
      'academy_id': instance.academyId,
      'profile_image': instance.profileImage,
      'is_verified': _boolToJson(instance.isVerified),
      'is_active': _boolToJson(instance.isActive),
      'last_login': instance.lastLogin?.toIso8601String(),
      'created_at': instance.createdAt?.toIso8601String(),
      'updated_at': instance.updatedAt?.toIso8601String(),
      'roles': instance.roles,
    };

_$UserRoleModelImpl _$$UserRoleModelImplFromJson(Map<String, dynamic> json) =>
    _$UserRoleModelImpl(
      role: json['role'] as String,
      academyId: (json['academy_id'] as num?)?.toInt(),
      isActive: _boolFromJson(json['is_active']),
    );

Map<String, dynamic> _$$UserRoleModelImplToJson(_$UserRoleModelImpl instance) =>
    <String, dynamic>{
      'role': instance.role,
      'academy_id': instance.academyId,
      'is_active': _boolToJson(instance.isActive),
    };
