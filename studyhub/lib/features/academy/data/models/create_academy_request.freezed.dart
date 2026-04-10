// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'create_academy_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CreateAcademyRequest _$CreateAcademyRequestFromJson(Map<String, dynamic> json) {
  return _CreateAcademyRequest.fromJson(json);
}

/// @nodoc
mixin _$CreateAcademyRequest {
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  @JsonKey(name: 'owner_name')
  String get ownerName => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  @JsonKey(name: 'registration_number')
  String? get registrationNumber => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  String? get city => throw _privateConstructorUsedError;
  String? get state => throw _privateConstructorUsedError;
  String? get country => throw _privateConstructorUsedError;
  @JsonKey(name: 'postal_code')
  String? get postalCode => throw _privateConstructorUsedError;
  @JsonKey(name: 'owner_phone')
  String? get ownerPhone => throw _privateConstructorUsedError;
  @JsonKey(name: 'owner_email')
  String? get ownerEmail => throw _privateConstructorUsedError;
  @JsonKey(name: 'establishment_date')
  String? get establishmentDate => throw _privateConstructorUsedError;
  String? get website => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $CreateAcademyRequestCopyWith<CreateAcademyRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateAcademyRequestCopyWith<$Res> {
  factory $CreateAcademyRequestCopyWith(CreateAcademyRequest value,
          $Res Function(CreateAcademyRequest) then) =
      _$CreateAcademyRequestCopyWithImpl<$Res, CreateAcademyRequest>;
  @useResult
  $Res call(
      {String name,
      String email,
      @JsonKey(name: 'owner_name') String ownerName,
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
      String? description});
}

/// @nodoc
class _$CreateAcademyRequestCopyWithImpl<$Res,
        $Val extends CreateAcademyRequest>
    implements $CreateAcademyRequestCopyWith<$Res> {
  _$CreateAcademyRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? email = null,
    Object? ownerName = null,
    Object? phone = freezed,
    Object? registrationNumber = freezed,
    Object? address = freezed,
    Object? city = freezed,
    Object? state = freezed,
    Object? country = freezed,
    Object? postalCode = freezed,
    Object? ownerPhone = freezed,
    Object? ownerEmail = freezed,
    Object? establishmentDate = freezed,
    Object? website = freezed,
    Object? description = freezed,
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
      ownerName: null == ownerName
          ? _value.ownerName
          : ownerName // ignore: cast_nullable_to_non_nullable
              as String,
      phone: freezed == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String?,
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
              as String?,
      website: freezed == website
          ? _value.website
          : website // ignore: cast_nullable_to_non_nullable
              as String?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CreateAcademyRequestImplCopyWith<$Res>
    implements $CreateAcademyRequestCopyWith<$Res> {
  factory _$$CreateAcademyRequestImplCopyWith(_$CreateAcademyRequestImpl value,
          $Res Function(_$CreateAcademyRequestImpl) then) =
      __$$CreateAcademyRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String name,
      String email,
      @JsonKey(name: 'owner_name') String ownerName,
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
      String? description});
}

/// @nodoc
class __$$CreateAcademyRequestImplCopyWithImpl<$Res>
    extends _$CreateAcademyRequestCopyWithImpl<$Res, _$CreateAcademyRequestImpl>
    implements _$$CreateAcademyRequestImplCopyWith<$Res> {
  __$$CreateAcademyRequestImplCopyWithImpl(_$CreateAcademyRequestImpl _value,
      $Res Function(_$CreateAcademyRequestImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? email = null,
    Object? ownerName = null,
    Object? phone = freezed,
    Object? registrationNumber = freezed,
    Object? address = freezed,
    Object? city = freezed,
    Object? state = freezed,
    Object? country = freezed,
    Object? postalCode = freezed,
    Object? ownerPhone = freezed,
    Object? ownerEmail = freezed,
    Object? establishmentDate = freezed,
    Object? website = freezed,
    Object? description = freezed,
  }) {
    return _then(_$CreateAcademyRequestImpl(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      ownerName: null == ownerName
          ? _value.ownerName
          : ownerName // ignore: cast_nullable_to_non_nullable
              as String,
      phone: freezed == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String?,
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
              as String?,
      website: freezed == website
          ? _value.website
          : website // ignore: cast_nullable_to_non_nullable
              as String?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateAcademyRequestImpl implements _CreateAcademyRequest {
  const _$CreateAcademyRequestImpl(
      {required this.name,
      required this.email,
      @JsonKey(name: 'owner_name') required this.ownerName,
      this.phone,
      @JsonKey(name: 'registration_number') this.registrationNumber,
      this.address,
      this.city,
      this.state,
      this.country,
      @JsonKey(name: 'postal_code') this.postalCode,
      @JsonKey(name: 'owner_phone') this.ownerPhone,
      @JsonKey(name: 'owner_email') this.ownerEmail,
      @JsonKey(name: 'establishment_date') this.establishmentDate,
      this.website,
      this.description});

  factory _$CreateAcademyRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreateAcademyRequestImplFromJson(json);

  @override
  final String name;
  @override
  final String email;
  @override
  @JsonKey(name: 'owner_name')
  final String ownerName;
  @override
  final String? phone;
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
  @JsonKey(name: 'owner_phone')
  final String? ownerPhone;
  @override
  @JsonKey(name: 'owner_email')
  final String? ownerEmail;
  @override
  @JsonKey(name: 'establishment_date')
  final String? establishmentDate;
  @override
  final String? website;
  @override
  final String? description;

  @override
  String toString() {
    return 'CreateAcademyRequest(name: $name, email: $email, ownerName: $ownerName, phone: $phone, registrationNumber: $registrationNumber, address: $address, city: $city, state: $state, country: $country, postalCode: $postalCode, ownerPhone: $ownerPhone, ownerEmail: $ownerEmail, establishmentDate: $establishmentDate, website: $website, description: $description)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateAcademyRequestImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.ownerName, ownerName) ||
                other.ownerName == ownerName) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.registrationNumber, registrationNumber) ||
                other.registrationNumber == registrationNumber) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.city, city) || other.city == city) &&
            (identical(other.state, state) || other.state == state) &&
            (identical(other.country, country) || other.country == country) &&
            (identical(other.postalCode, postalCode) ||
                other.postalCode == postalCode) &&
            (identical(other.ownerPhone, ownerPhone) ||
                other.ownerPhone == ownerPhone) &&
            (identical(other.ownerEmail, ownerEmail) ||
                other.ownerEmail == ownerEmail) &&
            (identical(other.establishmentDate, establishmentDate) ||
                other.establishmentDate == establishmentDate) &&
            (identical(other.website, website) || other.website == website) &&
            (identical(other.description, description) ||
                other.description == description));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      name,
      email,
      ownerName,
      phone,
      registrationNumber,
      address,
      city,
      state,
      country,
      postalCode,
      ownerPhone,
      ownerEmail,
      establishmentDate,
      website,
      description);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateAcademyRequestImplCopyWith<_$CreateAcademyRequestImpl>
      get copyWith =>
          __$$CreateAcademyRequestImplCopyWithImpl<_$CreateAcademyRequestImpl>(
              this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateAcademyRequestImplToJson(
      this,
    );
  }
}

abstract class _CreateAcademyRequest implements CreateAcademyRequest {
  const factory _CreateAcademyRequest(
      {required final String name,
      required final String email,
      @JsonKey(name: 'owner_name') required final String ownerName,
      final String? phone,
      @JsonKey(name: 'registration_number') final String? registrationNumber,
      final String? address,
      final String? city,
      final String? state,
      final String? country,
      @JsonKey(name: 'postal_code') final String? postalCode,
      @JsonKey(name: 'owner_phone') final String? ownerPhone,
      @JsonKey(name: 'owner_email') final String? ownerEmail,
      @JsonKey(name: 'establishment_date') final String? establishmentDate,
      final String? website,
      final String? description}) = _$CreateAcademyRequestImpl;

  factory _CreateAcademyRequest.fromJson(Map<String, dynamic> json) =
      _$CreateAcademyRequestImpl.fromJson;

  @override
  String get name;
  @override
  String get email;
  @override
  @JsonKey(name: 'owner_name')
  String get ownerName;
  @override
  String? get phone;
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
  @JsonKey(name: 'owner_phone')
  String? get ownerPhone;
  @override
  @JsonKey(name: 'owner_email')
  String? get ownerEmail;
  @override
  @JsonKey(name: 'establishment_date')
  String? get establishmentDate;
  @override
  String? get website;
  @override
  String? get description;
  @override
  @JsonKey(ignore: true)
  _$$CreateAcademyRequestImplCopyWith<_$CreateAcademyRequestImpl>
      get copyWith => throw _privateConstructorUsedError;
}
