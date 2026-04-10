// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_academy_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CreateAcademyRequestImpl _$$CreateAcademyRequestImplFromJson(
        Map<String, dynamic> json) =>
    _$CreateAcademyRequestImpl(
      name: json['name'] as String,
      email: json['email'] as String,
      ownerName: json['owner_name'] as String,
      phone: json['phone'] as String?,
      registrationNumber: json['registration_number'] as String?,
      address: json['address'] as String?,
      city: json['city'] as String?,
      state: json['state'] as String?,
      country: json['country'] as String?,
      postalCode: json['postal_code'] as String?,
      ownerPhone: json['owner_phone'] as String?,
      ownerEmail: json['owner_email'] as String?,
      establishmentDate: json['establishment_date'] as String?,
      website: json['website'] as String?,
      description: json['description'] as String?,
    );

Map<String, dynamic> _$$CreateAcademyRequestImplToJson(
        _$CreateAcademyRequestImpl instance) =>
    <String, dynamic>{
      'name': instance.name,
      'email': instance.email,
      'owner_name': instance.ownerName,
      'phone': instance.phone,
      'registration_number': instance.registrationNumber,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
      'postal_code': instance.postalCode,
      'owner_phone': instance.ownerPhone,
      'owner_email': instance.ownerEmail,
      'establishment_date': instance.establishmentDate,
      'website': instance.website,
      'description': instance.description,
    };
