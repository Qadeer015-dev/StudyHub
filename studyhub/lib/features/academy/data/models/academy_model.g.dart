// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'academy_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AcademyModelImpl _$$AcademyModelImplFromJson(Map<String, dynamic> json) =>
    _$AcademyModelImpl(
      id: (json['id'] as num).toInt(),
      uuid: json['uuid'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      registrationNumber: json['registration_number'] as String?,
      address: json['address'] as String?,
      city: json['city'] as String?,
      state: json['state'] as String?,
      country: json['country'] as String?,
      postalCode: json['postal_code'] as String?,
      phone: json['phone'] as String?,
      ownerName: json['owner_name'] as String,
      ownerPhone: json['owner_phone'] as String?,
      ownerEmail: json['owner_email'] as String?,
      establishmentDate: json['establishment_date'] == null
          ? null
          : DateTime.parse(json['establishment_date'] as String),
      website: json['website'] as String?,
      logoUrl: json['logo_url'] as String?,
      description: json['description'] as String?,
      status: json['status'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$$AcademyModelImplToJson(_$AcademyModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'uuid': instance.uuid,
      'name': instance.name,
      'email': instance.email,
      'registration_number': instance.registrationNumber,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
      'postal_code': instance.postalCode,
      'phone': instance.phone,
      'owner_name': instance.ownerName,
      'owner_phone': instance.ownerPhone,
      'owner_email': instance.ownerEmail,
      'establishment_date': instance.establishmentDate?.toIso8601String(),
      'website': instance.website,
      'logo_url': instance.logoUrl,
      'description': instance.description,
      'status': instance.status,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
