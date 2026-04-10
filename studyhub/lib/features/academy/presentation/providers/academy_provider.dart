import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:studyhub/features/academy/data/datasources/academy_remote_data_source.dart';
import 'package:studyhub/features/academy/domain/repositories/academy_repository.dart';
import 'package:studyhub/features/academy/data/models/academy_model.dart';
import 'package:studyhub/core/network/dio_client.dart';
import 'package:studyhub/features/auth/providers/auth_provider.dart';

// Provider for AcademyRepository
final academyRepositoryProvider = Provider<AcademyRepository>((ref) {
  final dioClient = ref.watch(dioClientProvider);
  final remoteDataSource = AcademyRemoteDataSourceImpl(dioClient: dioClient);
  return AcademyRepositoryImpl(remoteDataSource: remoteDataSource);
});

// State for academy creation
class CreateAcademyState {
  final bool isLoading;
  final AcademyModel? academy;
  final String? errorMessage;

  CreateAcademyState({this.isLoading = false, this.academy, this.errorMessage});

  CreateAcademyState copyWith({
    bool? isLoading,
    AcademyModel? academy,
    String? errorMessage,
  }) {
    return CreateAcademyState(
      isLoading: isLoading ?? this.isLoading,
      academy: academy ?? this.academy,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

// Notifier
class CreateAcademyNotifier extends StateNotifier<CreateAcademyState> {
  final AcademyRepository _repository;

  CreateAcademyNotifier(this._repository) : super(CreateAcademyState());

  Future<void> createAcademy(Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final academy = await _repository.createAcademy(data);
      state = state.copyWith(isLoading: false, academy: academy);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  void reset() {
    state = CreateAcademyState();
  }
}

final createAcademyProvider =
    StateNotifierProvider<CreateAcademyNotifier, CreateAcademyState>((ref) {
  final repo = ref.watch(academyRepositoryProvider);
  return CreateAcademyNotifier(repo);
});

// Provider to get the created academy ID
final createdAcademyIdProvider = Provider<int?>((ref) {
  final state = ref.watch(createAcademyProvider);
  return state.academy?.id;
});
