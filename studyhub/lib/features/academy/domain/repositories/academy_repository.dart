import 'package:studyhub/features/academy/data/datasources/academy_remote_data_source.dart';
import 'package:studyhub/features/academy/data/models/academy_model.dart';

abstract class AcademyRepository {
  Future<AcademyModel> createAcademy(Map<String, dynamic> data);
}

class AcademyRepositoryImpl implements AcademyRepository {
  final AcademyRemoteDataSource remoteDataSource;

  AcademyRepositoryImpl({required this.remoteDataSource});

  @override
  Future<AcademyModel> createAcademy(Map<String, dynamic> data) async {
    return await remoteDataSource.createAcademy(data);
  }
}
