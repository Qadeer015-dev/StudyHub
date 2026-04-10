import 'package:freezed_annotation/freezed_annotation.dart';

part 'academy_model.freezed.dart';
part 'academy_model.g.dart';

@freezed
class AcademyModel with _$AcademyModel {
  const factory AcademyModel({
    required int id,
    required String uuid,
    required String name,
    required String email,
    @JsonKey(name: 'registration_number') String? registrationNumber,
    String? address,
    String? city,
    String? state,
    String? country,
    @JsonKey(name: 'postal_code') String? postalCode,
    String? phone,
    @JsonKey(name: 'owner_name') required String ownerName,
    @JsonKey(name: 'owner_phone') String? ownerPhone,
    @JsonKey(name: 'owner_email') String? ownerEmail,
    @JsonKey(name: 'establishment_date') DateTime? establishmentDate,
    String? website,
    @JsonKey(name: 'logo_url') String? logoUrl,
    String? description,
    required String status,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _AcademyModel;

  factory AcademyModel.fromJson(Map<String, dynamic> json) =>
      _$AcademyModelFromJson(json);
}
