import 'dart:convert';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:studyhub/core/storage/hive_init.dart';
import 'package:studyhub/core/storage/secure_storage.dart';
import 'package:studyhub/features/auth/data/models/user_model.dart';
import 'package:studyhub/features/auth/domain/entities/logged_in_user.dart';
import 'package:studyhub/features/auth/domain/entities/user_role.dart';

abstract class AuthLocalDataSource {
  Future<void> cacheToken(String token);
  Future<String?> getToken();
  Future<void> cacheUser(LoggedInUser user);
  Future<LoggedInUser?> getCachedUser();
  Future<void> clearAll();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final SecureStorage secureStorage;
  final Box userBox;

  AuthLocalDataSourceImpl({required this.secureStorage, required this.userBox});

  @override
  Future<void> cacheToken(String token) async {
    await secureStorage.saveTokens(accessToken: token);
  }

  @override
  Future<String?> getToken() => secureStorage.getAccessToken();

  @override
  Future<void> cacheUser(LoggedInUser user) async {
    final userJson = {
      'id': user.id,
      'uuid': user.uuid,
      'email': user.email,
      'fullName': user.fullName,
      'academyId': user.academyId,
      'roles': user.roles.map((r) => r.name).toList(),
    };
    await userBox.put('current_user', jsonEncode(userJson));
  }

  @override
  Future<LoggedInUser?> getCachedUser() async {
    final userString = userBox.get('current_user');
    if (userString == null) return null;
    final Map<String, dynamic> userMap = jsonDecode(userString);
    return LoggedInUser(
      id: userMap['id'],
      uuid: userMap['uuid'],
      email: userMap['email'],
      fullName: userMap['fullName'],
      academyId: userMap['academyId'],
      roles: (userMap['roles'] as List).map((r) {
        return UserRole.values.firstWhere((e) => e.name == r);
      }).toList(),
    );
  }

  @override
  Future<void> clearAll() async {
    await secureStorage.clearAll();
    await userBox.clear();
  }
}
