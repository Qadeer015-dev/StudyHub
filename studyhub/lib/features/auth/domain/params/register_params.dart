class RegisterParams {
  final String email;
  final String password;
  final String fullName;
  final String? phone;
  final String role;
  final int? academyId;

  const RegisterParams({
    required this.email,
    required this.password,
    required this.fullName,
    this.phone,
    required this.role,
    this.academyId,
  });

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{
      'email': email,
      'password': password,
      'full_name': fullName,
      'role': role,
    };
    if (phone != null) json['phone'] = phone;
    if (academyId != null) json['academy_id'] = academyId;
    return json;
  }
}
