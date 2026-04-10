// lib/features/auth/data/datasources/academy_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:studyhub/core/network/dio_client.dart';
import 'package:studyhub/features/academy/data/models/academy_model.dart';

abstract class AcademyRemoteDataSource {
  Future<AcademyModel> createAcademy(CreateAcademyRequest request);
}

class AcademyRemoteDataSourceImpl implements AcademyRemoteDataSource {
  final DioClient dioClient;

  AcademyRemoteDataSourceImpl({required this.dioClient});

  @override
  Future<AcademyModel> createAcademy(CreateAcademyRequest request) async {
    try {
      final response = await dioClient.dio.post(
        '/academies',
        data: request.toJson(),
      );

      final responseData = response.data;
      if (responseData['success'] != true) {
        throw Exception(responseData['message'] ?? 'Failed to create academy');
      }

      final data = responseData['data'] as Map<String, dynamic>;

      // If API returns full academy object, parse it normally.
      // Otherwise, you may need a separate GET request to fetch the full academy.
      // This placeholder assumes the API returns at least id, uuid, name, email, etc.
      return AcademyModel.fromJson(data);
    } on DioException catch (e) {
      final message = e.response?.data['message'] ?? 'Failed to create academy';
      throw Exception(message);
    }
  }
}
