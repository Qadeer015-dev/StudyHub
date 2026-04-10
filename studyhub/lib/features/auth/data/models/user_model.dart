import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

// Helper to convert 1/0 or true/false to bool
bool _boolFromJson(dynamic value) {
  if (value == 1 || value == '1' || value == true) return true;
  return false;
}

int _boolToJson(bool? value) => value == true ? 1 : 0;

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required int id,
    required String uuid,
    required String email,
    @JsonKey(name: 'full_name') required String fullName,
    String? phone,
    @JsonKey(name: 'academy_id') int? academyId,
    @JsonKey(name: 'profile_image') String? profileImage,
    @JsonKey(name: 'is_verified', fromJson: _boolFromJson, toJson: _boolToJson)
    bool? isVerified,
    @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
    required bool isActive,
    @JsonKey(name: 'last_login') DateTime? lastLogin,
    @JsonKey(name: 'created_at') DateTime? createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
    @Default([]) List<UserRoleModel> roles,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}

@freezed
class UserRoleModel with _$UserRoleModel {
  const factory UserRoleModel({
    required String role,
    @JsonKey(name: 'academy_id') int? academyId,
    @JsonKey(name: 'is_active', fromJson: _boolFromJson, toJson: _boolToJson)
    bool? isActive,
  }) = _UserRoleModel;

  factory UserRoleModel.fromJson(Map<String, dynamic> json) =>
      _$UserRoleModelFromJson(json);
}
