import 'package:studyhub/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:studyhub/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:studyhub/features/auth/data/models/login_request.dart';
import 'package:studyhub/features/auth/data/models/user_model.dart';
import 'package:studyhub/features/auth/domain/entities/logged_in_user.dart';
import 'package:studyhub/features/auth/domain/entities/user_role.dart';

abstract class AuthRepository {
  Future<LoggedInUser> login(String email, String password, {int? academyId});
  Future<LoggedInUser> register({
    required String email,
    required String password,
    required String fullName,
    required String role,
    int? academyId,
    String? phone,
  });
  Future<LoggedInUser?> getCurrentUser();
  Future<void> logout();
}

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<LoggedInUser> register({
    required String email,
    required String password,
    required String fullName,
    required String role,
    int? academyId,
    String? phone,
  }) async {
    final data = {
      'email': email,
      'password': password,
      'full_name': fullName,
      'role': role,
      if (academyId != null) 'academy_id': academyId,
      if (phone != null) 'phone': phone,
    };
    final response = await remoteDataSource.register(data);

    await localDataSource.cacheToken(response.token);
    final roles = _mapRoles(response.user.roles);
    final loggedInUser = _mapToLoggedInUser(response.user, roles);
    await localDataSource.cacheUser(loggedInUser);

    return loggedInUser;
  }

  @override
  Future<LoggedInUser> login(String email, String password,
      {int? academyId}) async {
    final request =
        LoginRequest(email: email, password: password, academyId: academyId);
    final response = await remoteDataSource.login(request);

    // Cache token and user
    await localDataSource.cacheToken(response.token);
    final roles = _mapRoles(response.user.roles);
    final loggedInUser = _mapToLoggedInUser(response.user, roles);
    await localDataSource.cacheUser(loggedInUser);

    return loggedInUser;
  }

  @override
  Future<LoggedInUser?> getCurrentUser() async {
    final token = await localDataSource.getToken();
    if (token == null) return null;
    return await localDataSource.getCachedUser();
  }

  @override
  Future<void> logout() async {
    await localDataSource.clearAll();
  }

  LoggedInUser _mapToLoggedInUser(UserModel user, List<UserRole> roles) {
    return LoggedInUser(
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      fullName: user.fullName,
      academyId: user.academyId,
      roles: roles,
    );
  }

  List<UserRole> _mapRoles(List<UserRoleModel> roles) {
    return roles.map((r) {
      switch (r.role) {
        case 'admin':
          return UserRole.admin;
        case 'teacher':
          return UserRole.teacher;
        case 'student':
          return UserRole.student;
        case 'parent':
          return UserRole.parent;
        default:
          throw Exception('Unknown role: ${r.role}');
      }
    }).toList();
  }
}
