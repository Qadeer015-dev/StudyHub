import 'package:freezed_annotation/freezed_annotation.dart';

part 'create_academy_request.freezed.dart';
part 'create_academy_request.g.dart';

@freezed
class CreateAcademyRequest with _$CreateAcademyRequest {
  const factory CreateAcademyRequest({
    required String name,
    required String email,
    @JsonKey(name: 'owner_name') required String ownerName,
    String? phone,
    @JsonKey(name: 'registration_number') String? registrationNumber,
    String? address,
    String? city,
    String? state,
    String? country,
    @JsonKey(name: 'postal_code') String? postalCode,
    @JsonKey(name: 'owner_phone') String? ownerPhone,
    @JsonKey(name: 'owner_email') String? ownerEmail,
    @JsonKey(name: 'establishment_date') String? establishmentDate,
    String? website,
    String? description,
  }) = _CreateAcademyRequest;

  factory CreateAcademyRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateAcademyRequestFromJson(json);
}
