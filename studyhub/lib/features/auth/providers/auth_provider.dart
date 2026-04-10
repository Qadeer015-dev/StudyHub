//lib/features/auth/providers/auth_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:studyhub/features/auth/domain/entities/logged_in_user.dart';
import 'package:studyhub/features/auth/domain/repositories/auth_repository.dart';
import 'package:studyhub/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:studyhub/features/auth/data/datasources/auth_local_data_source.dart';
import 'package:studyhub/core/network/dio_client.dart';
import 'package:studyhub/core/storage/secure_storage.dart';
import 'package:studyhub/core/storage/hive_init.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:studyhub/features/auth/domain/entities/user_role.dart';
// State
class AuthState {
  final LoggedInUser? user;
  final bool isLoading;
  final String? errorMessage;

  AuthState({this.user, this.isLoading = false, this.errorMessage});

  AuthState copyWith({
    LoggedInUser? user,
    bool? isLoading,
    String? errorMessage,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}


// Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(AuthState()) {
    _init();
  }

  Future<void> _init() async {
    state = state.copyWith(isLoading: true);
    final user = await _repository.getCurrentUser();
    state = state.copyWith(user: user, isLoading: false);
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final user = await _repository.login(email, password);
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String fullName,
    required String role,
    int? academyId,
    String? phone,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final user = await _repository.register(
        email: email,
        password: password,
        fullName: fullName,
        role: role,
        academyId: academyId,
        phone: phone,
      );
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    state = AuthState();
  }
}

// Providers
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dioClient = ref.watch(dioClientProvider);
  final secureStorage = ref.watch(secureStorageProvider);
  final userBox = ref.watch(userBoxProvider);

  final remoteDataSource = AuthRemoteDataSourceImpl(dioClient: dioClient);
  final localDataSource =
      AuthLocalDataSourceImpl(secureStorage: secureStorage, userBox: userBox);

  return AuthRepositoryImpl(
    remoteDataSource: remoteDataSource,
    localDataSource: localDataSource,
  );
});

final authNotifierProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository);
});

// Dependency providers
final dioClientProvider = Provider<DioClient>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);
  return DioClient(secureStorage: secureStorage);
});

final secureStorageProvider = Provider<SecureStorage>((ref) => SecureStorage());

final userBoxProvider = Provider<Box>((ref) => Hive.box(HiveBoxes.user));
