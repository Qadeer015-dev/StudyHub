import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:studyhub/core/network/dio_client.dart';
import 'package:studyhub/features/auth/data/models/login_request.dart';
import 'package:studyhub/features/auth/data/models/login_response.dart';
import 'package:studyhub/features/auth/data/models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<LoginResponse> login(LoginRequest request);
  Future<LoginResponse> register(Map<String, dynamic> data);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final DioClient dioClient;

  AuthRemoteDataSourceImpl({required this.dioClient});

  @override
  Future<LoginResponse> login(LoginRequest request) async {
    try {
      final response = await dioClient.dio.post(
        '/auth/login',
        data: request.toJson(),
      );
      final apiResponse = ApiResponse<LoginResponse>.fromJson(
        response.data,
        (json) => LoginResponse.fromJson(json as Map<String, dynamic>),
      );
      return apiResponse.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<LoginResponse> register(Map<String, dynamic> data) async {
    final response = await dioClient.dio.post('/auth/register', data: data);
    final apiResponse = ApiResponse<LoginResponse>.fromJson(
      response.data,
      (json) => LoginResponse.fromJson(json as Map<String, dynamic>),
    );
    return apiResponse.data;
  }

  Exception _handleDioError(DioException e) {
    if (e.response?.statusCode == 401) {
      return Exception('Invalid email or password');
    }
    if (e.response?.data != null && e.response?.data['message'] != null) {
      return Exception(e.response?.data['message']);
    }
    return Exception(e.message ?? 'Network error');
  }
}
