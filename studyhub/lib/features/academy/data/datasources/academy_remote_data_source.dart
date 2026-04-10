import 'package:dio/dio.dart';
import 'package:studyhub/core/network/dio_client.dart';
import 'package:studyhub/features/academy/data/models/academy_model.dart';

abstract class AcademyRemoteDataSource {
  Future<AcademyModel> createAcademy(Map<String, dynamic> data);
}

class AcademyRemoteDataSourceImpl implements AcademyRemoteDataSource {
  final DioClient dioClient;

  AcademyRemoteDataSourceImpl({required this.dioClient});

  @override
  Future<AcademyModel> createAcademy(Map<String, dynamic> data) async {
    try {
      final response = await dioClient.dio.post('/academies', data: data);
      final responseData = response.data;
      if (responseData['success'] != true) {
        throw Exception(responseData['message'] ?? 'Failed to create academy');
      }
      // The API returns only {id, uuid} on creation. We need to fetch full academy.
      final academyId = responseData['data']['id'];
      final academyResponse = await dioClient.dio.get('/academies/$academyId');
      return AcademyModel.fromJson(academyResponse.data['data']);
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error');
    }
  }
}
