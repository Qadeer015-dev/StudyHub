import 'package:equatable/equatable.dart';
import 'user_role.dart';

class LoggedInUser extends Equatable {
  final int id;
  final String uuid;
  final String email;
  final String fullName;
  final int? academyId;
  final List<UserRole> roles;

  const LoggedInUser({
    required this.id,
    required this.uuid,
    required this.email,
    required this.fullName,
    this.academyId,
    required this.roles,
  });

  @override
  List<Object?> get props => [id, uuid, email, fullName, academyId, roles];
}
