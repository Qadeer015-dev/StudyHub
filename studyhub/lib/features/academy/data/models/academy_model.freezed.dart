// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'academy_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

AcademyModel _$AcademyModelFromJson(Map<String, dynamic> json) {
  return _AcademyModel.fromJson(json);
}

/// @nodoc
mixin _$AcademyModel {
  int get id => throw _privateConstructorUsedError;
  String get uuid => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  @JsonKey(name: 'registration_number')
  String? get registrationNumber => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  String? get city => throw _privateConstructorUsedError;
  String? get state => throw _privateConstructorUsedError;
  String? get country => throw _privateConstructorUsedError;
  @JsonKey(name: 'postal_code')
  String? get postalCode => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  @JsonKey(name: 'owner_name')
  String get ownerName => throw _privateConstructorUsedError;
  @JsonKey(name: 'owner_phone')
  String? get ownerPhone => throw _privateConstructorUsedError;
  @JsonKey(name: 'owner_email')
  String? get ownerEmail => throw _privateConstructorUsedError;
  @JsonKey(name: 'establishment_date')
  DateTime? get establishmentDate => throw _privateConstructorUsedError;
  String? get website => throw _privateConstructorUsedError;
  @JsonKey(name: 'logo_url')
  String? get logoUrl => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime get createdAt => throw _privateConstructorUsedError;
  @JsonKey(name: 'updated_at')
  DateTime get updatedAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $AcademyModelCopyWith<AcademyModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AcademyModelCopyWith<$Res> {
  factory $AcademyModelCopyWith(
          AcademyModel value, $Res Function(AcademyModel) then) =
      _$AcademyModelCopyWithImpl<$Res, AcademyModel>;
  @useResult
  $Res call(
      {int id,
      String uuid,
      String name,
      String email,
      @JsonKey(name: 'registration_number') String? registrationNumber,
      String? address,
      String? city,
      String? state,
      String? country,
      @JsonKey(name: 'postal_code') String? postalCode,
      String? phone,
      @JsonKey(name: 'owner_name') String ownerName,
      @JsonKey(name: 'owner_phone') String? ownerPhone,
      @JsonKey(name: 'owner_email') String? ownerEmail,
      @JsonKey(name: 'establishment_date') DateTime? establishmentDate,
      String? website,
      @JsonKey(name: 'logo_url') String? logoUrl,
      String? description,
      String status,
      @JsonKey(name: 'created_at') DateTime createdAt,
      @JsonKey(name: 'updated_at') DateTime updatedAt});
}

/// @nodoc
class _$AcademyModelCopyWithImpl<$Res, $Val extends AcademyModel>
    implements $AcademyModelCopyWith<$Res> {
  _$AcademyModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? uuid = null,
    Object? name = null,
    Object? email = null,
    Object? registrationNumber = freezed,
    Object? address = freezed,
    Object? city = freezed,
    Object? state = freezed,
    Object? country = freezed,
    Object? postalCode = freezed,
    Object? phone = freezed,
    Object? ownerName = null,
    Object? ownerPhone = freezed,
    Object? ownerEmail = freezed,
    Object? establishmentDate = freezed,
    Object? website = freezed,
    Object? logoUrl = freezed,
    Object? description = freezed,
    Object? status = null,
    Object? createdAt = null,
    Object? updatedAt = null,
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
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      registrationNumber: freezed == registrationNumber
          ? _value.registrationNumber
          : registrationNumber // ignore: cast_nullable_to_non_nullable
              as String?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      city: freezed == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as String?,
      state: freezed == state
          ? _value.state
          : state // ignore: cast_nullable_to_non_nullable
              as String?,
      country: freezed == country
          ? _value.country
          : country // ignore: cast_nullable_to_non_nullable
              as String?,
      postalCode: freezed == postalCode
          ? _value.postalCode
          : postalCode // ignore: cast_nullable_to_non_nullable
              as String?,
      phone: freezed == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String?,
      ownerName: null == ownerName
          ? _value.ownerName
          : ownerName // ignore: cast_nullable_to_non_nullable
              as String,
      ownerPhone: freezed == ownerPhone
          ? _value.ownerPhone
          : ownerPhone // ignore: cast_nullable_to_non_nullable
              as String?,
      ownerEmail: freezed == ownerEmail
          ? _value.ownerEmail
          : ownerEmail // ignore: cast_nullable_to_non_nullable
              as String?,
      establishmentDate: freezed == establishmentDate
          ? _value.establishmentDate
          : establishmentDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      website: freezed == website
          ? _value.website
          : website // ignore: cast_nullable_to_non_nullable
              as String?,
      logoUrl: freezed == logoUrl
          ? _value.logoUrl
          : logoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AcademyModelImplCopyWith<$Res>
    implements $AcademyModelCopyWith<$Res> {
  factory _$$AcademyModelImplCopyWith(
          _$AcademyModelImpl value, $Res Function(_$AcademyModelImpl) then) =
      __$$AcademyModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int id,
      String uuid,
      String name,
      String email,
      @JsonKey(name: 'registration_number') String? registrationNumber,
      String? address,
      String? city,
      String? state,
      String? country,
      @JsonKey(name: 'postal_code') String? postalCode,
      String? phone,
      @JsonKey(name: 'owner_name') String ownerName,
      @JsonKey(name: 'owner_phone') String? ownerPhone,
      @JsonKey(name: 'owner_email') String? ownerEmail,
      @JsonKey(name: 'establishment_date') DateTime? establishmentDate,
      String? website,
      @JsonKey(name: 'logo_url') String? logoUrl,
      String? description,
      String status,
      @JsonKey(name: 'created_at') DateTime createdAt,
      @JsonKey(name: 'updated_at') DateTime updatedAt});
}

/// @nodoc
class __$$AcademyModelImplCopyWithImpl<$Res>
    extends _$AcademyModelCopyWithImpl<$Res, _$AcademyModelImpl>
    implements _$$AcademyModelImplCopyWith<$Res> {
  __$$AcademyModelImplCopyWithImpl(
      _$AcademyModelImpl _value, $Res Function(_$AcademyModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? uuid = null,
    Object? name = null,
    Object? email = null,
    Object? registrationNumber = freezed,
    Object? address = freezed,
    Object? city = freezed,
    Object? state = freezed,
    Object? country = freezed,
    Object? postalCode = freezed,
    Object? phone = freezed,
    Object? ownerName = null,
    Object? ownerPhone = freezed,
    Object? ownerEmail = freezed,
    Object? establishmentDate = freezed,
    Object? website = freezed,
    Object? logoUrl = freezed,
    Object? description = freezed,
    Object? status = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_$AcademyModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as int,
      uuid: null == uuid
          ? _value.uuid
          : uuid // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      registrationNumber: freezed == registrationNumber
          ? _value.registrationNumber
          : registrationNumber // ignore: cast_nullable_to_non_nullable
              as String?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      city: freezed == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as String?,
      state: freezed == state
          ? _value.state
          : state // ignore: cast_nullable_to_non_nullable
              as String?,
      country: freezed == country
          ? _value.country
          : country // ignore: cast_nullable_to_non_nullable
              as String?,
      postalCode: freezed == postalCode
          ? _value.postalCode
          : postalCode // ignore: cast_nullable_to_non_nullable
              as String?,
      phone: freezed == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String?,
      ownerName: null == ownerName
          ? _value.ownerName
          : ownerName // ignore: cast_nullable_to_non_nullable
              as String,
      ownerPhone: freezed == ownerPhone
          ? _value.ownerPhone
          : ownerPhone // ignore: cast_nullable_to_non_nullable
              as String?,
      ownerEmail: freezed == ownerEmail
          ? _value.ownerEmail
          : ownerEmail // ignore: cast_nullable_to_non_nullable
              as String?,
      establishmentDate: freezed == establishmentDate
          ? _value.establishmentDate
          : establishmentDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      website: freezed == website
          ? _value.website
          : website // ignore: cast_nullable_to_non_nullable
              as String?,
      logoUrl: freezed == logoUrl
          ? _value.logoUrl
          : logoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AcademyModelImpl implements _AcademyModel {
  const _$AcademyModelImpl(
      {required this.id,
      required this.uuid,
      required this.name,
      required this.email,
      @JsonKey(name: 'registration_number') this.registrationNumber,
      this.address,
      this.city,
      this.state,
      this.country,
      @JsonKey(name: 'postal_code') this.postalCode,
      this.phone,
      @JsonKey(name: 'owner_name') required this.ownerName,
      @JsonKey(name: 'owner_phone') this.ownerPhone,
      @JsonKey(name: 'owner_email') this.ownerEmail,
      @JsonKey(name: 'establishment_date') this.establishmentDate,
      this.website,
      @JsonKey(name: 'logo_url') this.logoUrl,
      this.description,
      required this.status,
      @JsonKey(name: 'created_at') required this.createdAt,
      @JsonKey(name: 'updated_at') required this.updatedAt});

  factory _$AcademyModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$AcademyModelImplFromJson(json);

  @override
  final int id;
  @override
  final String uuid;
  @override
  final String name;
  @override
  final String email;
  @override
  @JsonKey(name: 'registration_number')
  final String? registrationNumber;
  @override
  final String? address;
  @override
  final String? city;
  @override
  final String? state;
  @override
  final String? country;
  @override
  @JsonKey(name: 'postal_code')
  final String? postalCode;
  @override
  final String? phone;
  @override
  @JsonKey(name: 'owner_name')
  final String ownerName;
  @override
  @JsonKey(name: 'owner_phone')
  final String? ownerPhone;
  @override
  @JsonKey(name: 'owner_email')
  final String? ownerEmail;
  @override
  @JsonKey(name: 'establishment_date')
  final DateTime? establishmentDate;
  @override
  final String? website;
  @override
  @JsonKey(name: 'logo_url')
  final String? logoUrl;
  @override
  final String? description;
  @override
  final String status;
  @override
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @override
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  @override
  String toString() {
    return 'AcademyModel(id: $id, uuid: $uuid, name: $name, email: $email, registrationNumber: $registrationNumber, address: $address, city: $city, state: $state, country: $country, postalCode: $postalCode, phone: $phone, ownerName: $ownerName, ownerPhone: $ownerPhone, ownerEmail: $ownerEmail, establishmentDate: $establishmentDate, website: $website, logoUrl: $logoUrl, description: $description, status: $status, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AcademyModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.uuid, uuid) || other.uuid == uuid) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.registrationNumber, registrationNumber) ||
                other.registrationNumber == registrationNumber) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.city, city) || other.city == city) &&
            (identical(other.state, state) || other.state == state) &&
            (identical(other.country, country) || other.country == country) &&
            (identical(other.postalCode, postalCode) ||
                other.postalCode == postalCode) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.ownerName, ownerName) ||
                other.ownerName == ownerName) &&
            (identical(other.ownerPhone, ownerPhone) ||
                other.ownerPhone == ownerPhone) &&
            (identical(other.ownerEmail, ownerEmail) ||
                other.ownerEmail == ownerEmail) &&
            (identical(other.establishmentDate, establishmentDate) ||
                other.establishmentDate == establishmentDate) &&
            (identical(other.website, website) || other.website == website) &&
            (identical(other.logoUrl, logoUrl) || other.logoUrl == logoUrl) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hashAll([
        runtimeType,
        id,
        uuid,
        name,
        email,
        registrationNumber,
        address,
        city,
        state,
        country,
        postalCode,
        phone,
        ownerName,
        ownerPhone,
        ownerEmail,
        establishmentDate,
        website,
        logoUrl,
        description,
        status,
        createdAt,
        updatedAt
      ]);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$AcademyModelImplCopyWith<_$AcademyModelImpl> get copyWith =>
      __$$AcademyModelImplCopyWithImpl<_$AcademyModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AcademyModelImplToJson(
      this,
    );
  }
}

abstract class _AcademyModel implements AcademyModel {
  const factory _AcademyModel(
      {required final int id,
      required final String uuid,
      required final String name,
      required final String email,
      @JsonKey(name: 'registration_number') final String? registrationNumber,
      final String? address,
      final String? city,
      final String? state,
      final String? country,
      @JsonKey(name: 'postal_code') final String? postalCode,
      final String? phone,
      @JsonKey(name: 'owner_name') required final String ownerName,
      @JsonKey(name: 'owner_phone') final String? ownerPhone,
      @JsonKey(name: 'owner_email') final String? ownerEmail,
      @JsonKey(name: 'establishment_date') final DateTime? establishmentDate,
      final String? website,
      @JsonKey(name: 'logo_url') final String? logoUrl,
      final String? description,
      required final String status,
      @JsonKey(name: 'created_at') required final DateTime createdAt,
      @JsonKey(name: 'updated_at')
      required final DateTime updatedAt}) = _$AcademyModelImpl;

  factory _AcademyModel.fromJson(Map<String, dynamic> json) =
      _$AcademyModelImpl.fromJson;

  @override
  int get id;
  @override
  String get uuid;
  @override
  String get name;
  @override
  String get email;
  @override
  @JsonKey(name: 'registration_number')
  String? get registrationNumber;
  @override
  String? get address;
  @override
  String? get city;
  @override
  String? get state;
  @override
  String? get country;
  @override
  @JsonKey(name: 'postal_code')
  String? get postalCode;
  @override
  String? get phone;
  @override
  @JsonKey(name: 'owner_name')
  String get ownerName;
  @override
  @JsonKey(name: 'owner_phone')
  String? get ownerPhone;
  @override
  @JsonKey(name: 'owner_email')
  String? get ownerEmail;
  @override
  @JsonKey(name: 'establishment_date')
  DateTime? get establishmentDate;
  @override
  String? get website;
  @override
  @JsonKey(name: 'logo_url')
  String? get logoUrl;
  @override
  String? get description;
  @override
  String get status;
  @override
  @JsonKey(name: 'created_at')
  DateTime get createdAt;
  @override
  @JsonKey(name: 'updated_at')
  DateTime get updatedAt;
  @override
  @JsonKey(ignore: true)
  _$$AcademyModelImplCopyWith<_$AcademyModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
